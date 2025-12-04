# Plan: ElevenLabs Proxy MCP Server Fix

## Root Cause Analyse

### Das Problem
Der `elevenlabs-proxy` MCP Server wurde in `~/.claude/.mcp.json` registriert, aber:
- Diese Datei ist eine **project-level** Config für das Verzeichnis `~/.claude/`
- Wir arbeiten in `/Users/pretor/Documents/PAI - TPOS/`
- Deshalb wird der Proxy nicht geladen

### Beweise
1. Debug-Log Zeile 78-79 zeigt nur `elevenlabs` und `voice-mode` Startup-Versuche
2. `claude mcp list` zeigt nur `voice-mode: ✓ Connected`
3. `~/.claude.json` enthält unter `mcpServers` nur `voice-mode`
4. Der Proxy selbst funktioniert (manueller Test erfolgreich)

### Die 3 Voice-Systeme
| System | Zweck | Status |
|--------|-------|--------|
| voice-mode MCP | STT/TTS via OpenAI endpoints | ✅ Funktioniert |
| elevenlabs-proxy | Token-optimierte ElevenLabs Tools | ❌ Nicht geladen |
| voice-server | Standalone Notifications (Jarvis/Ottie) | ✅ Funktioniert |

---

## Lösung

### Gewählte Lösung: Global registrieren

Den Proxy zur globalen `~/.claude.json` hinzufügen.

---

## Implementierungsschritte

1. [ ] Backup: `cp ~/.claude.json ~/.claude/history/backups/claude.json.backup-proxy-fix`
2. [ ] Proxy global registrieren:
   ```bash
   claude mcp add elevenlabs-proxy \
     --command node \
     --args "/Users/pretor/.claude/custom-mcps/elevenlabs-proxy/dist/index.js" \
     --env "ELEVENLABS_API_KEY=\${ELEVENLABS_API_KEY}"
   ```
3. [ ] Claude Code neu starten (exit + claude)
4. [ ] Verifizieren: `claude mcp list` sollte `elevenlabs-proxy: ✓` zeigen
5. [ ] Testen: ElevenLabs TTS mit Otti Voice
6. [ ] Aufräumen: `~/.claude/.mcp.json` kann den elevenlabs-proxy Eintrag entfernen

---

## Erwartetes Ergebnis

Nach dem Fix:
- 6 ElevenLabs Tools verfügbar (statt 0 oder 24)
- ~6k MCP tokens (statt 24.8k mit vollem ElevenLabs)
- Otti Voice ID `***REMOVED***` nutzbar
- "MCP server failed" verschwindet

---

## Kritische Dateien

- `/Users/pretor/.claude.json` - Global config (zu modifizieren)
- `/Users/pretor/.claude/.mcp.json` - Falsche Stelle (aufräumen)
- `/Users/pretor/.claude/custom-mcps/elevenlabs-proxy/` - Der Proxy (funktioniert)
- `/Users/pretor/.claude/config/voice-feedback.json` - Otti Voice Config
