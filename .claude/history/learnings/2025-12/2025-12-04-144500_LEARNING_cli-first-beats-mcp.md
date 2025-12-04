# LEARNING: CLI-First schlägt MCP für einfache API-Wrapper

**Datum:** 2025-12-04
**Kontext:** ElevenLabs Voice Integration für PAI/TPOS
**Wichtigkeit:** HOCH

---

## Das Problem

Ein MCP-basierter Proxy für ElevenLabs Voice hatte wiederkehrende Probleme:

1. **Zombie-Prozesse**: Alte MCP-Server liefen mit veralteten API Keys
2. **Reconnect-Fehler**: Nach `pkill` der Prozesse reconnected Claude Code nicht automatisch
3. **Komplexe Debug-Kette**: `Claude Code → stdio → Proxy → stdio → elevenlabs-mcp → REST API`
4. **Mehrere Sessions Debugging** ohne stabiles Ergebnis

---

## Die Erkenntnis

**MCP ist für Discovery, nicht für Production.**

Die PAI CONSTITUTION (Zeile 692) sagt es klar:

> "CRITICAL PATTERN: Never write API calls directly in prompts or bash scripts."
> "Discovery via MCP → Production via CLI-First TypeScript"

### Zwei-Tier MCP Strategie

| Tier | Verwendung | Beispiel |
|------|------------|----------|
| **Tier 1: MCP** | Entdecken, Erkunden, Prototyping | "Was kann diese API?" |
| **Tier 2: CLI** | Production, Wiederholbare Tasks | "Nutze diese API täglich" |

---

## Die Lösung

**Statt MCP-Proxy: Ein CLI Tool (`pai-voice`)**

```bash
# Vorher (fragil):
mcp__elevenlabs-proxy__text_to_speech → stdio → MCP → REST

# Nachher (robust):
~/.claude/bin/pai-voice/pai-voice.ts say "Text" --play
```

### Vorteile

| Aspekt | MCP | CLI |
|--------|-----|-----|
| Komplexität | Hoch (stdio, reconnect) | Niedrig (direkter API-Call) |
| Debugging | Schwer | Einfach (`--verbose`) |
| Testing | Braucht Claude Code | Standalone |
| Zuverlässigkeit | Reconnect-Probleme | Funktioniert immer |
| PAI-Konformität | Tier 1 | CLI-First |

---

## Implementierung

**Zeitaufwand:** ~20 Minuten (statt Stunden MCP-Debugging)

**Ergebnis:** `~/.claude/bin/pai-voice/`
- `pai-voice.ts` - 420 LOC TypeScript
- Direkte REST API Calls
- Alle wichtigen Commands: say, transcribe, play, voices, subscription

---

## Wann MCP, wann CLI?

### MCP verwenden wenn:
- [ ] Erste Erkundung einer API
- [ ] Prototyping
- [ ] Einmalige Tasks
- [ ] API-Struktur noch unklar

### CLI bauen wenn:
- [x] API wird regelmäßig verwendet
- [x] Deterministische Ergebnisse wichtig
- [x] Testbarkeit erforderlich
- [x] Teil des täglichen Workflows

---

## Konsequenzen für TPOS

1. **Voice-Integration**: Ab jetzt via `pai-voice` CLI, kein MCP
2. **Neue API-Integrationen**: Erst MCP zum Erkunden, dann CLI für Production
3. **system-createcli Skill**: Nutzen für neue CLI-Tools

---

## Referenzen

- PAI CONSTITUTION: `~/.claude/skills/CORE/CONSTITUTION.md` (Zeile 692ff)
- CLI-First Architecture: `~/.claude/skills/CORE/cli-first-architecture.md`
- Session-Dokumentation: `~/.claude/history/sessions/2025-12/2025-12-04-142500_SESSION_pai-voice-cli-creation.md`

---

## Zitat zum Merken

> "Build tools that work perfectly without AI, then add AI to make them easier to use."
> — PAI CONSTITUTION, CLI-First Architecture
