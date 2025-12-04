---
name: DelegationPatterns
description: Agent delegation and parallelization patterns. USE WHEN parallelize OR delegate OR agents OR Task tool OR intern OR engineer agent.
relevant_when: "parallelize", "delegate", "agents", "Task tool", "intern", "engineer agent", "subagent", "parallel", "implement", "build", "create"
---

# Delegation & Parallelization

**WHENEVER A TASK CAN BE PARALLELIZED, USE MULTIPLE AGENTS!**

---

## MANDATORY DELEGATION TRIGGERS

**Du MUSST an Agents delegieren wenn:**

| Trigger | Agent | Beispiel |
|---------|-------|----------|
| "implementiere", "baue", "erstelle" (Code) | `engineer` | MCP Proxy implementieren |
| "plane", "designe", "PRD" | `architect` | System-Architektur entwerfen |
| "recherchiere", "finde heraus" | `researcher` | Technologie-Vergleich |
| "exploriere", "suche in codebase" | `Explore` | Wo ist X definiert? |
| Mehrere unabhängige Dateien erstellen | `engineer` (parallel) | 4 Source-Files gleichzeitig |

### Negativ-Beispiel: MCP Proxy Session

**Was passierte:** Hauptagent implementierte alles selbst
**Was hätte passieren sollen:**

```
1. Hauptagent: Plant Struktur, definiert Allowlist
2. Hauptagent → engineer Agent:
   "Implementiere MCP Proxy mit folgender Spec:
   - Pfad: ~/.claude/custom-mcps/elevenlabs-proxy/
   - 4 Dateien: config.ts, client.ts, server.ts, index.ts
   - Allowlist: [6 Tools]
   - Muss upstream ElevenLabs MCP starten
   - Muss .env laden für API Key"
3. engineer Agent: Implementiert, testet, returned
4. Hauptagent: Integriert in MCP Config
```

**Ersparnis:** ~5k Tokens im Hauptkontext

---

## Agent-Auswahl-Matrix

| Aufgabe | Agent | Model | Grund |
|---------|-------|-------|-------|
| Code schreiben (>50 LOC) | `engineer` | sonnet | Spezialisiert auf Implementation |
| PRD/Architektur erstellen | `architect` | sonnet | Spezialisiert auf Design |
| Web Research | `researcher` | sonnet | Hat WebSearch/WebFetch |
| Codebase durchsuchen | `Explore` | haiku | Schnell, günstig |
| Einfache Checks | `general-purpose` | haiku | Grunt work |
| Design/UX Fragen | `designer` | sonnet | Spezialisiert auf Design |

---

## Model Selection (CRITICAL FOR SPEED)

| Task Type | Model | Why |
|-----------|-------|-----|
| Deep reasoning, complex architecture | `opus` | Maximum intelligence needed |
| Standard implementation, most coding | `sonnet` | Good balance of speed + capability |
| Simple lookups, quick checks, grunt work | `haiku` | 10-20x faster, sufficient intelligence |

---

## Delegation Syntax

```typescript
// FALSCH - Hauptagent macht alles selbst
Write({ file_path: "src/server.ts", content: "..." })

// RICHTIG - An engineer delegieren
Task({
  subagent_type: "engineer",
  model: "sonnet",
  prompt: `Implementiere einen MCP Server mit:
  - Pfad: ~/.claude/custom-mcps/my-proxy/
  - Tool-Filter für Allowlist
  - Upstream-Verbindung zu [X]
  Gib zurück: Liste aller erstellten Dateien mit Status`,
  description: "Implement MCP Proxy"
})
```

---

## Parallelisierung

**Immer parallel wenn möglich:**

```typescript
// 3 Agents gleichzeitig starten
Task({ subagent_type: "Explore", prompt: "Finde alle MCP configs", model: "haiku" })
Task({ subagent_type: "researcher", prompt: "Recherchiere MCP SDK patterns" })
Task({ subagent_type: "engineer", prompt: "Implementiere Basis-Struktur" })
```

---

## Hauptagent-Rolle

Der Hauptagent (du) sollte:
- **Koordinieren** - Aufgaben verteilen
- **Planen** - Struktur und Spec definieren
- **Integrieren** - Ergebnisse zusammenführen
- **Kommunizieren** - Mit User interagieren

Der Hauptagent sollte NICHT:
- Lange Code-Files selbst schreiben
- Tiefe Research selbst durchführen
- Repetitive Tasks selbst machen
