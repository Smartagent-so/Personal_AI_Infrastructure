# SESSION: pai-voice CLI Erstellung

**Datum:** 2025-12-04 14:25 PST
**Ziel:** MCP-Proxy durch CLI-First Tool ersetzen
**Status:** ✅ Abgeschlossen

---

## Kontext

### Problem
Der `elevenlabs-proxy` MCP Server hatte Reconnect-Probleme nach dem Killen von Zombie-Prozessen. Claude Code startet MCP-Server nicht automatisch neu.

### Entscheidung
Statt weiteres MCP-Debugging: **CLI-First Ansatz** gemäß PAI CONSTITUTION.

**Begründung:**
- PAI Prinzip #4: "CLI as Interface"
- PAI Prinzip #3: "Code Before Prompts"
- CONSTITUTION Zeile 692: "Never write API calls directly in prompts"
- CLI ist deterministisch, testbar, versionierbar

---

## Architektur-Entscheidung

| Option | Gewählt | Begründung |
|--------|---------|------------|
| MCP Proxy (stdio) | Nein | Reconnect-Probleme, komplexe Kette |
| HTTP MCP Server | Nein | Noch immer MCP-Overhead |
| **CLI Tool** | **Ja** | PAI-konform, einfach, deterministisch |

---

## Spezifikation: pai-voice CLI

### Tier-Entscheidung
**Tier 1** (llcli-style)
- < 10 Commands
- Einfache API-Calls
- JSON Output + Audio-Dateien

### Commands

| Command | Beschreibung | Beispiel |
|---------|--------------|----------|
| `say` | Text-to-Speech | `pai-voice say "Hallo" --play` |
| `transcribe` | Speech-to-Text | `pai-voice transcribe audio.mp3` |
| `play` | Audio abspielen | `pai-voice play file.mp3` |
| `voices` | Voices auflisten | `pai-voice voices --search "deutsch"` |
| `subscription` | Abo-Status prüfen | `pai-voice subscription` |

### Konfiguration

```bash
# In ~/.claude/.env
ELEVENLABS_API_KEY=xxx
ELEVENLABS_VOICE_ID=***REMOVED***  # Default Voice
ELEVENLABS_MODEL=eleven_flash_v2_5         # Schnellstes Modell
```

### Flags

| Flag | Beschreibung |
|------|--------------|
| `--voice` | Voice ID überschreiben |
| `--model` | Model überschreiben |
| `--output` | Output-Datei (default: /tmp/pai-voice-{timestamp}.mp3) |
| `--play` | Audio sofort abspielen |
| `--json` | JSON-Output statt Human-readable |

---

## Implementierung

### Schritt 1: CLI erstellen
- [ ] pai-voice.ts Hauptdatei
- [ ] TypeScript Interfaces
- [ ] Alle Commands implementieren

### Schritt 2: Dokumentation
- [ ] README.md
- [ ] QUICKSTART.md

### Schritt 3: Test
- [ ] --help funktioniert
- [ ] say Command funktioniert
- [ ] play Command funktioniert

### Schritt 4: Cleanup
- [ ] MCP-Einträge entfernen (elevenlabs-proxy, elevenlabs-direct)
- [ ] Alte Proxy-Dateien archivieren

---

## Änderungsprotokoll

| Zeit | Aktion |
|------|--------|
| 14:25 | Session gestartet, Entscheidung dokumentiert |
| 14:38 | CLI Verzeichnis erstellt |
| 14:39 | pai-voice.ts implementiert (420 LOC) |
| 14:39 | package.json, tsconfig.json, README.md, QUICKSTART.md erstellt |
| 14:40 | Tests erfolgreich: --help, subscription, say --play |
| 14:42 | MCP-Einträge entfernt (elevenlabs-proxy, elevenlabs-direct) |
| 14:42 | Alter Proxy-Code archiviert nach history/upgrades/deprecated/ |

---

## Ergebnis

### Erfolgreich implementiert

**pai-voice CLI** in `~/.claude/bin/pai-voice/`

| Datei | Beschreibung |
|-------|--------------|
| `pai-voice.ts` | Haupt-CLI (420 LOC TypeScript) |
| `package.json` | NPM Metadata |
| `tsconfig.json` | TypeScript Config |
| `README.md` | Vollständige Dokumentation |
| `QUICKSTART.md` | 30-Sekunden Guide |

### Getestete Commands

| Command | Status |
|---------|--------|
| `--help` | ✅ Funktioniert |
| `--version` | ✅ Funktioniert |
| `subscription` | ✅ Zeigt Tier, Characters, Reset-Datum |
| `say "text" --play` | ✅ Generiert und spielt Audio |

### Cleanup durchgeführt

- [x] `elevenlabs-proxy` aus .mcp.json entfernt
- [x] `elevenlabs-direct` aus .mcp.json entfernt
- [x] Alter Proxy-Code nach `history/upgrades/deprecated/2025-12-04_elevenlabs-proxy/` verschoben

### Architektur-Verbesserung

**Vorher:**
```
Claude Code → stdio → MCP Proxy → stdio → elevenlabs-mcp → REST API
```

**Nachher:**
```
Claude Code → Bash → pai-voice CLI → REST API
```

### Nächste Schritte

1. ✅ Voice-Feedback Hooks aktualisiert um `pai-voice` zu nutzen
2. Alias `pv` in ~/.zshrc einrichten (optional)
3. Bei nächstem Session-Start: Alte MCP-Prozesse sind weg

---

## Voice-Hooks Implementierung (Phase 2)

**Datum:** 2025-12-04 ~18:00 PST

### Neue Dateien

| Datei | Beschreibung |
|-------|--------------|
| `~/.claude/hooks/agent-start-voice.ts` | PreToolUse Hook für Agent-Start Voice |

### Geänderte Dateien

| Datei | Änderung |
|-------|----------|
| `~/.claude/hooks/subagent-stop-hook.ts` | Von localhost:***REMOVED*** auf pai-voice CLI |
| `~/.claude/settings.json` | Neuer PreToolUse Hook für "Task" matcher |

### Voice-Verhalten

| Event | Voice |
|-------|-------|
| Agent-Start (PreToolUse:Task) | "Starte {Agent-Name} Agent" (synchron) |
| Agent-Ende (SubagentStop) | Completion-Message via pai-voice |
| Zwischen-Feedback | Manuell durch PAI |

### Agent-Namen Mapping

```typescript
const AGENT_NAMES = {
  'Explore': 'Erkunden',
  'Plan': 'Planer',
  'researcher': 'Recherche',
  'engineer': 'Engineer',
  'architect': 'Architekt',
  'designer': 'Designer',
  // etc.
};
```

### Getestet

- ✅ `agent-start-voice.ts` mit simuliertem Task-Input
- ✅ Voice-Output mit Otti-Stimme

---

## Learnings

1. **CLI-First ist einfacher als MCP** für einfache API-Wrapper
2. **stdio-basierte MCPs** haben Reconnect-Probleme nach Prozess-Kill
3. **PAI CONSTITUTION** hat die richtige Antwort (Zeile 692)
4. **system-createcli Workflow** funktioniert gut als Leitfaden
