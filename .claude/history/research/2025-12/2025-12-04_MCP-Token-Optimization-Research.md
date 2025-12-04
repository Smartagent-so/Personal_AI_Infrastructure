---
capture_type: RESEARCH
timestamp: 2025-12-04T10:30:00.000Z
session_id: context-optimization
title: "MCP Token Optimization - 3 Ansätze im Vergleich"
tags: ["mcp", "token-optimization", "lazy-loading", "docker", "proxy"]
relevant_when: "MCP tokens reduzieren, context overflow, lazy loading MCP, Docker MCP Gateway, MCP proxy"
---

# MCP Token Optimization Research

**Datum:** 2025-12-04
**Kontext:** PAI Context Overflow Problem - MCP Tools verbrauchen ~24.8k Tokens (12.4%)

---

## Executive Summary

| Option | Aufwand | Token-Ersparnis | Empfehlung |
|--------|---------|-----------------|------------|
| **lazy-mcp Wrapper** | 2-4h | 95% (~24k → 500) | Komplex, experimentell |
| **Docker MCP Gateway** | 15-20h | 50-80% | Overkill für Single-User |
| **Custom TypeScript Proxy** | 8-12h | 70% (~24k → 7k) | Beste Balance |
| **mcp-filter (Python)** | 1.5h | 72% | **EMPFOHLEN** - Quick Win |

---

## Option 1: lazy-mcp Wrapper

### Was ist es?
Go-basierter Proxy von [voicetreelab/lazy-mcp](https://github.com/voicetreelab/lazy-mcp) der alle MCP Tools hinter 2 Meta-Tools versteckt:

```
get_tools_in_category(path)  → Navigiert Tool-Hierarchie
execute_tool(tool, args)     → Führt Tool on-demand aus
```

### Token-Ersparnis
- **Vorher:** 67k+ Tokens (alle Tools geladen)
- **Nachher:** ~500 Tokens (nur 2 Meta-Tools)
- **Ersparnis:** 95-98%

### Aufwand
```bash
git clone https://github.com/voicetreelab/lazy-mcp.git
cd lazy-mcp && make build
./build/structure_generator --config config.json --output ~/.claude/lazy-mcp-hierarchy
```

### Probleme
1. **Kein nativer Claude Code Support** - Nur Workaround via Proxy
2. **Discovery Overhead** - Claude muss erst durch Hierarchie navigieren
3. **Go-Dependency** - Nicht TypeScript-native
4. **Experimentell** - Relativ neues Projekt

### Verdict
❌ **Nicht empfohlen** für PAI - Zu komplex für den Nutzen, Discovery-UX problematisch

---

## Option 2: Docker MCP Gateway

### Was ist es?
Docker's zentrale MCP-Verwaltung mit On-Demand Container Spawning:

```
┌─────────────────────────────────────┐
│ Docker MCP Gateway                  │
│ ├── mcp-find (Search catalog)       │
│ ├── mcp-add (Add to session)        │
│ └── mcp-remove (Remove from ctx)    │
└─────────────────────────────────────┘
         │
         ▼ On-Demand
┌─────────────────────────────────────┐
│ Container: mcp/elevenlabs           │
│ Container: mcp/github               │
│ Container: mcp/filesystem           │
└─────────────────────────────────────┘
```

### Token-Ersparnis
- **98.7% Claim:** Aus Anthropic-Validierung (150k → 2k)
- **Realität für PAI:** 50-80% (140k → 30k) bei 10 Servern
- **Methodik nicht offengelegt**

### Aufwand
- Docker Desktop 4.48+ erforderlich
- 15-20 Stunden Setup
- +1.8GB RAM Overhead
- 1-3s Cold Start Latenz

### ElevenLabs in Docker
```yaml
# docker-compose.yml
services:
  elevenlabs:
    image: mcp/elevenlabs:latest
    environment:
      - ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}
      - ELEVENLABS_MCP_OUTPUT_MODE=resources
```

### Probleme
1. **Overkill für Single-User** - Designed für Enterprise
2. **Experimental Status** - "may encounter unexpected behavior"
3. **Latenz** - Container-Starts dauern 1-3s
4. **Komplexität** - 400% mehr Setup, 300% mehr Debugging

### Verdict
❌ **Nicht empfohlen** für PAI - Overkill, zu viel Overhead für 10 MCP Server

---

## Option 3: Custom TypeScript Proxy

### Was ist es?
Eigener MCP Server der nur gewünschte Tools von ElevenLabs durchreicht:

```
Claude Code → Custom Proxy (6 Tools) → ElevenLabs MCP (16 Tools)
                    ↓
            [Tool-Allowlist Filter]
```

### Token-Ersparnis
- **Vorher:** 16 Tools × ~3k = ~48k Tokens (ElevenLabs allein)
- **Nachher:** 6 Tools × ~3k = ~18k Tokens
- **Ersparnis:** ~70% für ElevenLabs

### Implementierung (~200 LOC)

```typescript
// src/config.ts
export const ALLOWED_TOOLS = [
  "text_to_speech",
  "play_audio",
  "search_voices",
  "voice_clone",
  "speech_to_text",
  "check_subscription",
];

// src/server.ts - Interceptor Pattern
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const upstream = await client.listTools();
  return {
    tools: upstream.tools.filter(t => ALLOWED_TOOLS.includes(t.name))
  };
});
```

### Aufwand
| Phase | Stunden |
|-------|---------|
| Setup | 1-2h |
| Core Logic | 3-4h |
| Testing | 2-3h |
| Integration | 1-2h |
| **Total** | **8-12h** |

### Probleme
1. **Entwicklungszeit** - 8-12 Stunden
2. **Maintenance** - ~2-4h/Jahr
3. **ElevenLabs Updates** - Manuelles Allowlist-Update

### Verdict
⚠️ **Möglich** - Gute Balance, aber es gibt eine schnellere Alternative

---

## Option 3b: mcp-filter (Python) - EMPFOHLEN

### Was ist es?
Fertiges Python-Tool [pro-vi/mcp-filter](https://github.com/pro-vi/mcp-filter) das Tool-Filtering ohne Code ermöglicht:

```bash
pip install mcp-filter
```

### Konfiguration
```json
{
  "mcpServers": {
    "elevenlabs-filtered": {
      "command": "mcp-filter",
      "args": [
        "run", "-t", "stdio",
        "--stdio-command", "uvx",
        "--stdio-arg", "elevenlabs-mcp",
        "-a", "text_to_speech,play_audio,search_voices,voice_clone,speech_to_text,check_subscription"
      ]
    }
  }
}
```

### Token-Ersparnis
- **Dokumentiert:** 72% Reduktion (50k → 13.7k)
- **Für ElevenLabs:** ~70% (16 → 6 Tools)

### Aufwand
| Phase | Zeit |
|-------|------|
| Installation | 10 min |
| Konfiguration | 20 min |
| Testing | 30 min |
| **Total** | **1.5h** |

### Vorteile
1. **Zero Code** - Nur Konfiguration
2. **Production Ready** - Bewährt, dokumentiert
3. **Flexibel** - Regex-Patterns, Rename, Deny-Listen
4. **Wartungsarm** - Allowlist in Config, kein Rebuild

### Nachteile
1. **Python Dependency** - Nicht TypeScript-native
2. **Externe Dependency** - Nicht Teil von PAI

### Verdict
✅ **EMPFOHLEN** - Beste Kosten-Nutzen-Relation, sofort einsetzbar

---

## Entscheidungsmatrix

| Kriterium | lazy-mcp | Docker | Custom TS | mcp-filter |
|-----------|----------|--------|-----------|------------|
| **Setup-Zeit** | 2-4h | 15-20h | 8-12h | 1.5h |
| **Token-Ersparnis** | 95% | 50-80% | 70% | 72% |
| **Komplexität** | Hoch | Sehr Hoch | Mittel | Niedrig |
| **Maintenance** | Mittel | Hoch | Niedrig | Sehr Niedrig |
| **TypeScript** | Nein (Go) | Nein | Ja | Nein (Python) |
| **Production Ready** | Nein | Nein | Ja | Ja |
| **PAI-Fit** | ❌ | ❌ | ⚠️ | ✅ |

---

## Empfohlene Strategie für PAI

### Phase 1: Quick Win (Jetzt)
```bash
# mcp-filter installieren
pip install mcp-filter

# ElevenLabs filtern (6 statt 16 Tools)
# In ~/.claude/.mcp.json konfigurieren
```
**Erwartete Ersparnis:** ~10-15k Tokens

### Phase 2: Evaluieren (1-2 Monate)
- Token-Verbrauch monitoren
- Tool-Nutzung tracken
- Entscheiden ob mehr nötig

### Phase 3: Custom Proxy (Optional)
Nur wenn:
- TypeScript-Native wichtig ist
- Mehr Customization benötigt wird
- mcp-filter Limitationen auftreten

### Phase 4: Native Support abwarten
- Anthropic kennt das Problem (GitHub Issues #7336, #6638, #11364)
- Native Lazy Loading könnte kommen
- Dann Migration auf native Lösung

---

## Quellen

### lazy-mcp
- https://github.com/voicetreelab/lazy-mcp
- https://github.com/MaxOstrowski/lazy-mcp
- https://github.com/machjesusmoto/claude-lazy-loading

### Docker MCP Gateway
- https://docs.docker.com/ai/mcp-catalog-and-toolkit/mcp-gateway/
- https://www.docker.com/blog/docker-mcp-gateway-secure-infrastructure-for-agentic-ai/

### Custom Proxy
- https://github.com/modelcontextprotocol/typescript-sdk
- https://github.com/punkpeye/mcp-proxy
- https://github.com/pro-vi/mcp-filter

### ElevenLabs MCP
- https://github.com/elevenlabs/elevenlabs-mcp
- https://hub.docker.com/mcp/server/elevenlabs

### Claude Code Issues
- https://github.com/anthropics/claude-code/issues/7336
- https://github.com/anthropics/claude-code/issues/6638
- https://github.com/anthropics/claude-code/issues/11364

---

**Captured:** 2025-12-04
**Next Action:** mcp-filter für ElevenLabs implementieren
