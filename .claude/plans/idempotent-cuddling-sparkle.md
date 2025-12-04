# Fix: ElevenLabs MCP Proxy "Invalid API Key" Error

## Problem
Der `mcp__elevenlabs-proxy__text_to_speech` Call scheitert mit:
```
status_code: 401, body: {'status': 'invalid_api_key', 'message': 'Invalid API key'}
```

Aber: Der User hört trotzdem Voice (Jarvis) - das kommt vom **Hook-System**, nicht vom MCP.

## Architektur-Überblick

```
┌─────────────────────────────────────────────────────────────┐
│                    VOICE SYSTEME                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. HOOKS (funktioniert ✅)                                 │
│     ~/.claude/hooks/lib/elevenlabs-tts.ts                   │
│     → Liest .env direkt → API Call → afplay                 │
│                                                             │
│  2. MCP PROXY (broken ❌)                                   │
│     mcp__elevenlabs-proxy__text_to_speech                   │
│     → Startet uvx elevenlabs-mcp → API Key fehlt?           │
│                                                             │
│  3. NATIVE MCP (nicht getestet)                             │
│     mcp__elevenlabs__text_to_speech                         │
│     → Native Claude MCP → Eigener API Key?                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Root Cause Analyse

**Bestätigt:** User hörte Voice beim Session-Start → **Hook funktioniert** → **API Key ist gültig!**

**Root Cause:** Der MCP Proxy leitet den API Key nicht korrekt an `uvx elevenlabs-mcp` weiter.

**Warum:**
1. `index.ts` lädt `.env` mit dotenv
2. `client.ts` übergibt `process.env` an StdioClientTransport
3. **ABER:** `uvx` spawnt einen Python-Prozess der möglicherweise:
   - Die env vars nicht erbt (Shell-Umgebung)
   - Oder `elevenlabs-mcp` erwartet `ELEVEN_API_KEY` statt `ELEVENLABS_API_KEY`

## Diagnose-Schritte

### Step 1: API Key Validierung
```bash
# Quick API check
curl -s -H "xi-api-key: $ELEVENLABS_API_KEY" \
  https://api.elevenlabs.io/v1/user | jq .subscription
```

### Step 2: Vergleich Hook vs Proxy Key
- Hook: `~/.claude/hooks/lib/elevenlabs-tts.ts` liest aus `~/.claude/.env`
- Proxy: `~/.claude/custom-mcps/elevenlabs-proxy/src/index.ts` liest aus `~/.claude/.env`
- Beide sollten identisch sein

### Step 3: UVX Test
```bash
# Prüfen ob uvx funktioniert
uvx elevenlabs-mcp --help
```

### Step 4: MCP Debug Log
```bash
# Proxy mit Debug starten
cd ~/.claude/custom-mcps/elevenlabs-proxy
DEBUG=* bun run start
```

## Lösungsoptionen

### Option A: API Key erneuern (wenn ungültig)
1. Neuen Key bei https://elevenlabs.io/app/settings/api-keys generieren
2. In `~/.claude/.env` aktualisieren
3. Claude Code neustarten

### Option B: Proxy fixen (wenn env-Problem)
1. Debug-Logging in `index.ts` hinzufügen
2. Prüfen ob `process.env.ELEVENLABS_API_KEY` gesetzt ist
3. Explicit Key in Upstream-Call übergeben

### Option C: Auf Native MCP wechseln (Workaround)
1. `mcp__elevenlabs__text_to_speech` statt proxy nutzen
2. Proxy deaktivieren
3. Trade-off: Mehr Token-Verbrauch (16 vs 6 Tools)

## Empfohlener Ansatz

Da der API Key nachweislich funktioniert (Hook!), direkt **Option B** implementieren:

1. **Debug-Logging** in `index.ts` hinzufügen um zu sehen ob Key geladen wird
2. **Env-Variable prüfen:** `elevenlabs-mcp` erwartet möglicherweise `ELEVEN_API_KEY`
3. **Explicit Key setzen** in der Upstream-Konfiguration falls nötig

## Zu ändernde Dateien

| Datei | Aktion |
|-------|--------|
| `~/.claude/.env` | API Key prüfen/aktualisieren |
| `~/.claude/custom-mcps/elevenlabs-proxy/src/index.ts` | Debug-Logging hinzufügen |
| `~/.claude/settings.local.json` | Ggf. Native MCP aktivieren |

## Nächste Schritte

1. [ ] API Key mit curl validieren
2. [ ] Falls ungültig: Neuen Key generieren
3. [ ] Falls gültig: Proxy Debug-Logs prüfen
4. [ ] Fix implementieren und testen
