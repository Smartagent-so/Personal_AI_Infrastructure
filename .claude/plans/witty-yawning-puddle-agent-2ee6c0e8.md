# Docker MCP Optimization Research

**Date:** 2025-12-04
**Agent:** claude-researcher
**Topic:** Docker's MCP implementation and optimization strategies based on Anthropic's recommendations

---

## Executive Summary

Docker has implemented multiple strategies to optimize Model Context Protocol (MCP) servers, focusing on **on-demand container spawning**, **dynamic tool discovery**, and **token usage reduction**. Their approach addresses the critical problem where "it takes surprisingly few tools for the context window to accumulate hundreds of thousands of tokens of nothing but tool definition."

**Key Innovation:** Docker's MCP Gateway creates a proxy layer between AI clients and MCP servers, enabling **lazy loading** of tools through on-demand container lifecycle management.

---

## 1. Docker's MCP Architecture

### Core Components

| Component | Repository | Purpose |
|-----------|------------|---------|
| **MCP Gateway** | [docker/mcp-gateway](https://github.com/docker/mcp-gateway) | Central proxy managing server lifecycle, credentials, and routing |
| **MCP Toolkit** | Built into Docker Desktop | GUI for server management and configuration |
| **MCP Registry** | [docker/mcp-registry](https://github.com/docker/mcp-registry) | Catalog of containerized MCP servers |

### Architecture Pattern

```
AI Client → MCP Gateway → MCP Servers (Docker Containers)
             │
             ├─ On-demand container spawning
             ├─ Credential injection
             ├─ Security restrictions
             └─ Request routing
```

**Language:** Go-based (98.5% of codebase) for fast compilation and minimal runtime overhead

---

## 2. On-Demand Container Spawning

### How It Works

The Gateway implements **lazy container initialization**:

1. **Request arrives** from AI client
2. **Gateway identifies** which server handles the tool
3. **Gateway spawns container** if not already running
4. **Gateway injects** credentials and security restrictions
5. **Request forwarded** to containerized server
6. **Response returns** through Gateway to client

### Key Implementation Details

**Docker Socket Mount:**
```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock
```

This gives the Gateway "full container management capabilities, allowing it to spawn, monitor, and manage MCP server containers dynamically."

**Command Example:**
```bash
docker run -d -p 8811:8811 --restart=always --name=mcp-gateway \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $HOME/.docker/mcp:/mcp:ro \
  docker/mcp-gateway \
  --catalog=/mcp/catalogs/docker-mcp.yaml \
  --registry=/mcp/registry.yaml \
  --watch=true \
  --transport=sse \
  --port=8811
```

---

## 3. Dynamic MCP: Runtime Tool Discovery

### The Problem

Traditional MCP requires pre-configuring all servers before starting an agent session. This leads to:
- Massive upfront token consumption
- Rigid configurations
- Manual setup overhead

### Docker's Solution: Dynamic MCP

**Core Capability:** "AI agents discover and add MCP servers on-demand during a conversation, without manual configuration."

### Six Management Tools

When clients connect to the Gateway, they receive these **primordial tools**:

| Tool | Function | Token Impact |
|------|----------|--------------|
| `mcp-find` | Search catalog by name/description | Lightweight |
| `mcp-add` | Add servers to current session | On-demand only |
| `mcp-config-set` | Configure server settings | As needed |
| `mcp-remove` | Remove servers from session | Reduces active tools |
| `mcp-exec` | Execute existing tools | Direct routing |
| `code-mode` | Create JavaScript composite tools | **Massive reduction** |

### Configuration

```bash
# Enable/disable dynamic tools
docker mcp feature enable dynamic-tools
docker mcp feature disable dynamic-tools
```

**Important:** "Dynamically added servers and tools are associated with your current session only."

---

## 4. Token Usage Reduction Strategies

### Problem Scale

**Example scenario:**
- **3 MCP servers** (filesystem, git, mcp-gateway)
- **Token consumption:** 42,600 tokens
- **Just in tool definitions** (no actual work!)

### Strategy 1: Code-Mode Tool Composition

**How it works:** Instead of exposing hundreds of individual tools, agents write JavaScript code that composes multiple tool calls into a single "code-mode tool."

**Token savings:** "Hundreds of thousands of fewer tokens being sent to the model on each turn."

**Why:** On subsequent turns, the model only needs to know about one new code-mode tool instead of all the underlying primitives.

### Strategy 2: Selective Tool Exposure

Docker distinguishes between:
- **Available tools** (in catalog, searchable)
- **Active tools** (loaded in context window)

```bash
# Enable specific servers only
docker mcp server enable duckduckgo wikipedia-mcp

# Disable unused servers
docker mcp server disable filesystem git

# List currently active tools
docker mcp tools ls --format=json
```

### Strategy 3: Tool Filtering

Configuration file: `~/.docker/mcp/tools.yaml`

```yaml
# Example: Per-server tool filtering (wildcards supported)
github:
  allowed:
    - search_*
    - get_repository
  blocked:
    - delete_*
    - admin_*
```

---

## 5. Configuration Files

Docker MCP Gateway uses four configuration files in `~/.docker/mcp/`:

| File | Purpose | Example Content |
|------|---------|-----------------|
| **docker-mcp.yaml** | Server definitions | Image, command, secrets, env vars, schemas |
| **registry.yaml** | Enabled servers | Whitelist of active server names |
| **config.yaml** | Per-server settings | API endpoints, feature toggles, paths |
| **tools.yaml** | Tool filtering | Wildcards for allowed/blocked tools |

### Example: docker-mcp.yaml Structure

```yaml
# Filesystem server configuration
filesystem:
  image: mcp/filesystem:latest
  command: ["--mode", "stdio"]
  environment:
    - MCP_MODE=stdio
    - LOG_LEVEL=error
  secrets:
    - FILESYSTEM_ROOT
  config_schema:
    paths:
      type: array
      description: "Allowed filesystem paths"
```

### Example: registry.yaml

```yaml
# Only these servers are enabled
enabled_servers:
  - duckduckgo
  - wikipedia-mcp
  - github
```

### Example: Writing Configuration

```bash
# Write per-server config
cat << 'EOF' | docker mcp config write
filesystem:
  paths:
    - /Users/username/Documents
    - /Users/username/Projects
github:
  default_org: myorg
EOF
```

---

## 6. Docker Compose Patterns

### Minimal Setup

```yaml
services:
  gateway:
    image: docker/mcp-gateway
    command:
      - --servers=duckduckgo
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

### Production Setup

```yaml
services:
  gateway:
    image: docker/mcp-gateway
    ports:
      - "8080:8080"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
      - "~/.docker/mcp:/mcp"
    command:
      - --catalog=/mcp/catalogs/docker-mcp.yaml
      - --config=/mcp/config.yaml
      - --registry=/mcp/registry.yaml
      - --secrets=docker-desktop
      - --watch=true
      - --transport=sse
      - --port=8080
    restart: always
```

**Key Options:**
- `--memory`: Memory per MCP server (default "2Gb")
- `--transport`: `stdio`, `sse`, or `streaming`
- `--watch`: Auto-reload on config changes
- `--secrets`: `docker-desktop` or path to `.env` file

---

## 7. Security Best Practices

Docker's MCP implementation includes built-in security measures:

### Isolation

- **Containers run with restricted privileges**
- **Network isolation** (prefer STDIO over network ports)
- **Resource limits** (CPU, memory constraints per container)

### Credential Management

- **Centralized secret injection** via Gateway
- **Never hardcode secrets** in images
- **Docker Desktop secret store integration**

### Recommended Practices

1. **Limit mounts:** Only expose needed directories
2. **Use read-only mounts** where possible
3. **Secure secrets:** Pass via environment variables
4. **Restrict permissions:** Use read-only database users
5. **Update regularly:** Keep container images patched
6. **Monitor resources:** Use `docker stats` to track usage

---

## 8. Community Solutions: lazy-mcp

### Alternative Approach

Repository: [voicetreelab/lazy-mcp](https://github.com/voicetreelab/lazy-mcp)

**Problem addressed:** "Even with only 3 MCP servers, tool definitions consume 42.6k tokens."

### Implementation Strategy

**Token savings:** 17% reduction (34,000 tokens) by hiding 2 MCP tools that aren't always needed

### Meta-Tool Architecture

Instead of exposing all tools, lazy-mcp provides two primitives:

1. **`get_tools_in_category(path)`**
   - Navigate hierarchical tool structure
   - Return categories or tools at each level
   - Progressive discovery without full definitions

2. **`execute_tool(tool_path, arguments)`**
   - Invoke tools by path (e.g., `coding_tools.serena.find_symbol`)
   - Lazy-load parent server only when needed
   - Execute and return result

### Configuration Pattern

**Two-phase setup:**

1. **Structure generation:**
   ```bash
   # Read config.json describing MCP servers
   structure_generator --config=config.json --output=structure.json
   ```

2. **Proxy deployment:**
   ```bash
   # Run proxy serving hierarchical structure
   lazy-mcp-proxy --structure=structure.json
   ```

### Hierarchical Organization

Tools organize as dot-separated paths:
```
coding_tools/
  ├─ serena/
  │   ├─ find_symbol
  │   ├─ list_files
  │   └─ read_file
  └─ github/
      ├─ search_issues
      └─ create_pr
```

Agents explore progressively without fetching complete documentation upfront.

---

## 9. Proposed Lazy Loading (Feature Request #7336)

### The Vision

GitHub Issue: [anthropics/claude-code#7336](https://github.com/anthropics/claude-code/issues/7336)

**Goal:** 95% token reduction from 108k to ~5k tokens at startup

### Registry System

**Concept:** Load only a lightweight index at startup containing:
- Tool names
- Brief descriptions
- Trigger keywords

**Mechanism:** On-demand loading when keywords detected or tools called

### Three-Phase Implementation

**Phase 1 (Basic):**
- Add `lazyLoad` flag to MCP configs
- Implement on-demand loading when tools called
- Use registry instead of full definitions

**Phase 2 (Intelligent):**
- Keyword-based auto-loading
- Pattern recognition for common workflows
- Tool relationship mapping

**Phase 3 (Advanced):**
- Session-based learning of usage patterns
- Predictive preloading based on project context
- Dynamic unloading of unused tools

### Configuration Example

```json
{
  "mcpServers": {
    "github": {
      "lazyLoad": true,
      "triggers": ["github", "repository", "issue", "pull request"],
      "preloadWith": ["git"]
    },
    "filesystem": {
      "lazyLoad": false,
      "reason": "Core tool, always needed"
    }
  },
  "lazyLoading": {
    "enabled": true,
    "maxInitialTokens": 5000
  }
}
```

### Token Impact

| Scenario | Current | Proposed | Reduction |
|----------|---------|----------|-----------|
| Startup | 108k tokens | 5k tokens | 95% |
| Available for conversation | 92k tokens | 195k tokens | +112% |

---

## 10. Third-Party Optimizers

### ToolHive MCP Optimizer

**Problem:** "A simple prompt like 'List the 10 most recent issues from my GitHub repo' uses 102,000 tokens... because the model receives metadata for 114 tools, most of which have nothing to do with the request."

**Solution:** Two lightweight primitives replace tool flooding:

1. **`find_tool`**
   - Hybrid semantic + keyword search
   - Returns only relevant tools for the task
   - Dramatically reduces context size

2. **`call_tool`**
   - Routes selected tool request to appropriate server
   - No need to expose all tools upfront

**Documentation:** [Stacklok MCP Optimizer](https://docs.stacklok.com/toolhive/tutorials/mcp-optimizer)

### GraphQL Approach

**Problem:** Verbose API responses and tool proliferation

**Solution:** Reimagine MCP server architecture with GraphQL

**Results:** 70-80% token reduction by:
- Returning only requested fields
- Eliminating unnecessary nested data
- Consolidating multiple tools into parameterized queries

**Article:** [Medium - Optimizing Token Usage in MCP Servers with GraphQL](https://medium.com/@mukundkidambi/optimizing-token-usage-in-mcp-servers-with-graphql-a-70-80-token-reduction-strategy-d4a620fdc690)

---

## 11. Patterns We Can Adopt for PAI

### Pattern 1: Selective Server Enabling

**Docker's approach:**
```bash
# Only enable what you need
docker mcp server enable filesystem research

# Disable everything else
docker mcp server reset
```

**PAI adaptation:**
```typescript
// In MCP config or settings
{
  "defaultEnabled": false, // Nothing loads by default
  "enableOnDemand": true,
  "coreServers": ["filesystem"], // Always needed
  "contextualServers": {
    "research": ["brave", "wikipedia"],
    "coding": ["github", "git"],
    "data": ["sqlite", "postgres"]
  }
}
```

### Pattern 2: Tool Filtering

**Docker's approach:**
```yaml
# tools.yaml
github:
  allowed:
    - search_*
    - get_*
  blocked:
    - delete_*
```

**PAI adaptation:**
```typescript
// Filter tools based on session context
interface ToolFilter {
  server: string;
  allowlist?: string[]; // Glob patterns
  blocklist?: string[];
  loadOnKeyword?: string[]; // Trigger words
}
```

### Pattern 3: Meta-Tool Discovery

**lazy-mcp approach:**
- Two meta-tools: `get_tools_in_category()` and `execute_tool()`
- Hierarchical exploration
- Progressive disclosure

**PAI adaptation:**
```typescript
// Core PAI meta-tools
{
  "pai_discover_skills": {
    "description": "Search available skills by capability",
    "parameters": { "query": "string", "category": "string" }
  },
  "pai_activate_skill": {
    "description": "Load and activate a skill on-demand",
    "parameters": { "skill_name": "string" }
  },
  "pai_deactivate_skill": {
    "description": "Unload unused skill to free tokens",
    "parameters": { "skill_name": "string" }
  }
}
```

### Pattern 4: Session-Based Tool Loading

**Concept:** Load tools based on session type

```typescript
type SessionType = 'research' | 'coding' | 'writing' | 'analysis';

const SESSION_TOOLS: Record<SessionType, string[]> = {
  research: ['brave', 'wikipedia', 'arxiv', 'web-fetch'],
  coding: ['github', 'git', 'filesystem', 'grep'],
  writing: ['filesystem', 'grammar-check', 'style-guide'],
  analysis: ['sqlite', 'data-viz', 'statistics']
};

// At session start
function initializeSession(type: SessionType) {
  const tools = SESSION_TOOLS[type];
  return loadToolsOnDemand(tools);
}
```

### Pattern 5: Code-Mode Tool Composition

**Docker's approach:** Let agents write JavaScript that composes multiple tools into one "super-tool"

**PAI adaptation:**
```typescript
// Instead of exposing 50 research tools, expose:
{
  "pai_compose_research": {
    "description": "Write code to compose research workflow",
    "sandbox": "deno", // Secure runtime
    "available_primitives": [
      "webSearch",
      "webFetch",
      "extractContent",
      "synthesize"
    ]
  }
}

// Agent writes:
async function researchCompany(name: string) {
  const results = await webSearch(`${name} company profile`);
  const pages = await Promise.all(
    results.map(r => webFetch(r.url))
  );
  return synthesize(pages);
}
```

### Pattern 6: Trigger-Based Loading

**Proposed approach from Feature Request #7336:**

```typescript
interface MCPServerConfig {
  name: string;
  lazyLoad: boolean;
  triggers: string[]; // Keywords that activate this server
  preloadWith?: string[]; // Related servers to load together
}

const configs: MCPServerConfig[] = [
  {
    name: "github",
    lazyLoad: true,
    triggers: ["github", "repository", "pull request", "issue"],
    preloadWith: ["git"]
  },
  {
    name: "research",
    lazyLoad: true,
    triggers: ["research", "search", "find information", "web"],
    preloadWith: ["brave", "wikipedia"]
  }
];

// When prompt contains "github", auto-load github + git servers
```

---

## 12. Implementation Recommendations for PAI

### Immediate Actions (Phase 1)

1. **Audit current MCP token usage**
   ```bash
   # Check Claude Code startup token consumption
   claude --mcp-debug --show-token-usage
   ```

2. **Create tool inventory**
   ```typescript
   // Categorize all MCP tools by:
   // - Core (always needed)
   // - Contextual (research, coding, writing)
   // - Specialized (rarely used)
   ```

3. **Implement selective enabling**
   ```json
   // claude_desktop_config.json
   {
     "mcpServers": {
       "filesystem": { "autoStart": true },
       "research": { "autoStart": false, "loadOnDemand": true },
       "github": { "autoStart": false, "loadOnDemand": true }
     }
   }
   ```

### Medium-Term Actions (Phase 2)

4. **Build skill discovery system**
   - Create `pai_discover_skills` tool
   - Implement hierarchical skill catalog
   - Add trigger-based activation

5. **Implement tool filtering**
   - Create `tools.yaml` equivalent for PAI
   - Define allowlist/blocklist per skill
   - Add wildcard pattern support

6. **Session-type detection**
   - Detect session type from initial prompt
   - Load appropriate tool subset
   - Allow manual override

### Long-Term Actions (Phase 3)

7. **Usage pattern learning**
   - Track which tools are actually used
   - Build predictive loading model
   - Auto-optimize tool sets per user

8. **Dynamic unloading**
   - Monitor tool usage in session
   - Unload tools unused for >N turns
   - Reclaim token budget

9. **Code-mode composition**
   - Expose PAI primitives to safe sandbox
   - Let agents compose workflows
   - Cache successful compositions

---

## 13. Key Takeaways

### What Docker Did Right

1. **Proxy Pattern:** Gateway sits between client and servers, managing lifecycle
2. **On-Demand Spawning:** Containers start only when tools are called
3. **Dynamic Discovery:** Agents search and add tools at runtime
4. **Code-Mode Composition:** Hundreds of thousands of tokens saved per turn
5. **Security First:** Isolation, credential injection, resource limits built-in

### What We Can Learn

1. **Don't load everything upfront** - Default to disabled, enable on-demand
2. **Use meta-tools** - Two discovery tools beat exposing hundreds directly
3. **Context matters** - Research sessions need different tools than coding
4. **Composition > Proliferation** - Let agents compose primitives vs exposing every variant
5. **Session isolation** - Tools loaded in one session don't persist (prevents bloat)

### Critical Metrics

| Metric | Docker's Achievement |
|--------|---------------------|
| Token reduction | 95% (108k → 5k proposed) |
| Code-mode savings | "Hundreds of thousands per turn" |
| lazy-mcp savings | 17% (34k tokens) |
| GraphQL approach | 70-80% reduction |

---

## Sources

- [Docker MCP Documentation](https://docs.docker.com/ai/gordon/mcp/)
- [Docker MCP Gateway Repository](https://github.com/docker/mcp-gateway)
- [Docker MCP Registry Repository](https://github.com/docker/mcp-registry)
- [Dynamic MCP Documentation](https://docs.docker.com/ai/mcp-catalog-and-toolkit/dynamic-mcp/)
- [lazy-mcp Repository](https://github.com/voicetreelab/lazy-mcp)
- [Claude Code Feature Request #7336](https://github.com/anthropics/claude-code/issues/7336)
- [Docker Blog: Model Context Protocol](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
- [Docker Blog: Dynamic MCPs](https://www.docker.com/blog/dynamic-mcps-stop-hardcoding-your-agents-world/)
- [Docker Blog: MCP Gateway](https://www.docker.com/blog/docker-mcp-gateway-secure-infrastructure-for-agentic-ai/)
- [ToolHive MCP Optimizer](https://docs.stacklok.com/toolhive/tutorials/mcp-optimizer)
- [Medium: GraphQL MCP Optimization](https://medium.com/@mukundkidambi/optimizing-token-usage-in-mcp-servers-with-graphql-a-70-80-token-reduction-strategy-d4a620fdc690)

---

**Research completed:** 2025-12-04
**Next steps:** Review findings, prioritize patterns for PAI implementation
