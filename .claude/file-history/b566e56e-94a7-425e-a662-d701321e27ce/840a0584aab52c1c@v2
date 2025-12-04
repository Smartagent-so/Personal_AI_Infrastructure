# CISSpeak

Voice output tool for CIS (Creative Intelligence Suite) agents.

## Usage

```bash
bun CISSpeak.ts <agent> "<message>"
```

## Agents

| Agent | Role | Voice |
|-------|------|-------|
| `carson` | Brainstorming Specialist | Dan (British, cheerful) |
| `maya` | Design Thinking Maestro | Katie (Authentic, flowing) |
| `quinn` | Problem Solver | Henry (British, analytical) |
| `victor` | Innovation Oracle | Luke (British, polished) |
| `sophia` | Master Storyteller | Nayva (Warm storyteller) |

## Examples

```bash
# Carson celebrates an idea
bun CISSpeak.ts carson "YES AND! Building on that brilliant idea..."

# Dr. Quinn finds a root cause
bun CISSpeak.ts quinn "AHA! The root cause is not what you thought!"

# Maya prompts empathy
bun CISSpeak.ts maya "What does that frustration feel like?"

# Victor challenges assumptions
bun CISSpeak.ts victor "But is that really the job customers hire you for?"

# Sophia tells a story
bun CISSpeak.ts sophia "Every brand has a story waiting to be told."
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `VOICE_SERVER` | `http://localhost:***REMOVED***` | Voice server URL |

## Limitations

- Maximum message length: 500 characters
- Requires voice server running on configured URL

## Integration

Use from workflows:

```bash
# In a workflow script
bun ${PAI_DIR}/skills/CIS/tools/CISSpeak.ts quinn "WHY did that happen?"
```
