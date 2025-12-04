---
capture_type: DECISION
timestamp: 2025-12-04T14:30:00.000Z
session_id: context-optimization
title: "MCP Proxy: TypeScript statt Python (PAI-Prinzip)"
tags: ["mcp", "typescript", "python", "principles", "proxy"]
relevant_when: "MCP proxy implementieren, mcp-filter vs custom, TypeScript vs Python entscheidung"
---

# Decision: MCP Proxy - TypeScript statt Python

**Date:** 2025-12-04
**Context:** MCP Token Optimization für PAI

---

## Entscheidung

**TypeScript Custom Proxy** statt **mcp-filter (Python)**

---

## Begründung

### PAI-Prinzip verletzt
```
Stack Preferences (Always Active):
- TypeScript > Python - Use TypeScript unless explicitly approved
```

Obwohl mcp-filter schneller wäre (1.5h vs 8-12h), würde es gegen unser Kernprinzip verstoßen.

### Argumente für TypeScript

1. **Konsistenz** - Gesamtes PAI-System ist TypeScript
2. **Wartbarkeit** - Ein Sprachstack, kein Python-Wissen nötig
3. **Integration** - Native mit Bun, PAI-Hooks, etc.
4. **Kontrolle** - Volle Anpassbarkeit
5. **Prinzipientreue** - "TypeScript > Python" ist Constitutional

### Argumente gegen Python (mcp-filter)

1. **Externe Dependency** - Nicht Teil von PAI
2. **Python-Runtime** - Zusätzliche Laufzeitumgebung
3. **Debugging** - Zwei Sprachen debuggen
4. **Upgrade-Pfad** - Abhängig von externem Maintainer

---

## Alternative gespeichert

Falls TypeScript-Ansatz scheitert, existiert Fallback:

```bash
# Fallback: mcp-filter (Python)
pip install mcp-filter
# Config siehe: ~/.claude/history/research/2025-12/2025-12-04_MCP-Token-Optimization-Research.md
```

---

## Rollback-Mechanismus

### Vor Implementation
```bash
# Backup aktuelle MCP Config
cp ~/.claude/.mcp.json ~/.claude/history/backups/mcp.json.backup-2025-12-04
```

### Bei Problemen
```bash
# Rollback zur Original-Config
cp ~/.claude/history/backups/mcp.json.backup-2025-12-04 ~/.claude/.mcp.json
# Claude Code neu starten
```

### ElevenLabs Plugin
- ElevenLabs ist globales Plugin (nicht in .mcp.json)
- Plugin bleibt aktiv als Fallback
- Custom Proxy wird ZUSÄTZLICH konfiguriert, nicht als Ersatz

---

## Nächste Schritte (Neue Session)

1. [ ] MCP Config Backup erstellen
2. [ ] TypeScript Proxy Projekt erstellen (`~/.claude/custom-mcps/elevenlabs-proxy/`)
3. [ ] Implementierung (~200 LOC, siehe Research-Doc)
4. [ ] Testing mit MCP Inspector
5. [ ] In .mcp.json registrieren
6. [ ] Token-Verbrauch messen (vorher/nachher)

---

## Referenzen

- Research: `~/.claude/history/research/2025-12/2025-12-04_MCP-Token-Optimization-Research.md`
- Plan: `~/.claude/plans/witty-yawning-puddle.md`
- Code-Skeleton: Im Research-Doc Section 5.1

---

**Captured:** 2025-12-04T14:30:00.000Z
