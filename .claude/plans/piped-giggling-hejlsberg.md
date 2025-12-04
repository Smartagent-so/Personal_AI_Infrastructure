# Plan: Voice-Feedback für Agent-Start und Agent-Ende

## Ziel

Automatisches Voice-Feedback via `pai-voice` CLI bei:
1. **Agent-Start**: "Starte {agent-type} Agent..." (synchron, vor Agent-Ausführung)
2. **Agent-Ende**: "{Agent} hat X abgeschlossen" (nach Agent-Completion)
3. **Zwischen-Feedback**: Manuell durch PAI (kein Hook)

---

## Zu ändernde Dateien

| Datei | Aktion | Beschreibung |
|-------|--------|--------------|
| `~/.claude/hooks/agent-start-voice.ts` | NEU | PreToolUse Hook für Agent-Start Voice |
| `~/.claude/hooks/subagent-stop-hook.ts` | ÄNDERN | Von localhost:***REMOVED*** auf pai-voice CLI |
| `~/.claude/settings.json` | ÄNDERN | Neuen Hook zu PreToolUse hinzufügen |

---

## Implementierung

### 1. Neuer Hook: `agent-start-voice.ts`

**Zweck:** Bei Task-Tool Aufruf synchron Voice abspielen

```typescript
#!/usr/bin/env bun
// Hook: PreToolUse - Agent Start Voice
// Trigger: Task tool mit subagent_type

import { execSync } from 'child_process';
import { homedir } from 'os';
import { join } from 'path';

const PAI_VOICE = join(homedir(), '.claude', 'bin', 'pai-voice', 'pai-voice.ts');

// Agent-Namen für Voice (lesbar)
const AGENT_NAMES: Record<string, string> = {
  'Explore': 'Erkunden',
  'Plan': 'Planer',
  'researcher': 'Recherche',
  'engineer': 'Engineer',
  'architect': 'Architekt',
  'designer': 'Designer',
  'perplexity-researcher': 'Perplexity Recherche',
  'gemini-researcher': 'Gemini Recherche',
  'claude-researcher': 'Claude Recherche',
};

async function main() {
  const input = await Bun.stdin.text();
  const data = JSON.parse(input);

  // Nur bei Task-Tool
  if (data.tool_name !== 'Task') {
    process.exit(0);
  }

  const agentType = data.tool_input?.subagent_type;
  if (!agentType) {
    process.exit(0);
  }

  // Voice-Text erstellen
  const agentName = AGENT_NAMES[agentType] || agentType;
  const message = `Starte ${agentName} Agent`;

  // Synchron Voice abspielen (blockiert max 2-3 Sek)
  try {
    execSync(`${PAI_VOICE} say "${message}" --play`, {
      timeout: 5000,
      stdio: 'ignore'
    });
  } catch (e) {
    // Voice-Fehler sollten Hook nicht crashen
    console.error('Voice failed:', e);
  }
}

main();
```

**Eigenschaften:**
- Synchron (wartet auf Voice bevor Agent startet)
- Timeout: 5 Sekunden max
- Fehler-tolerant (crashed nicht bei Voice-Problemen)

---

### 2. Änderung: `subagent-stop-hook.ts`

**Änderung:** Ersetze `fetch('http://localhost:***REMOVED***/notify', ...)` durch `pai-voice` CLI

**Vorher (Zeile 278-293):**
```typescript
await fetch('http://localhost:***REMOVED***/notify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: `${agentName} Agent`,
    message: fullMessage,
    voice_enabled: true,
    agent_type: finalAgentType,
    voice_id: AGENT_VOICE_IDS[finalAgentType] || AGENT_VOICE_IDS.default
  })
});
```

**Nachher:**
```typescript
import { execSync } from 'child_process';
import { join } from 'path';
import { homedir } from 'os';

const PAI_VOICE = join(homedir(), '.claude', 'bin', 'pai-voice', 'pai-voice.ts');

// Default: Otti (aus .env)
// Nur custom Voice wenn explizit im Agent-Output angegeben (z.B. [VOICE:xyz])
let voiceFlag = ''; // Leer = nutzt Default aus .env (Otti)

// Check ob Agent eigene Voice hat (für PAI Persona-Agents)
const voiceMatch = taskOutput.match(/\[VOICE:(\w+)\]/i);
if (voiceMatch) {
  voiceFlag = `--voice ${voiceMatch[1]}`;
}

try {
  execSync(`${PAI_VOICE} say "${fullMessage}" ${voiceFlag} --play`, {
    timeout: 10000,
    stdio: 'ignore'
  });
  console.log(`✅ Voice: [${agentName}] ${fullMessage}`);
} catch (e) {
  console.error('Voice failed:', e);
}
```

**Voice-Logik:**
- Default: Otti (aus `~/.claude/.env`)
- Custom Voice nur wenn Agent `[VOICE:id]` im Output hat (für PAI Persona-Agents)

---

### 3. Änderung: `settings.json`

**Änderung:** Neuen Hook zu PreToolUse hinzufügen

**Vorher:**
```json
"PreToolUse": [
  {
    "matcher": "*",
    "hooks": [
      {
        "type": "command",
        "command": "${PAI_DIR}/hooks/capture-all-events.ts --event-type PreToolUse"
      }
    ]
  }
],
```

**Nachher:**
```json
"PreToolUse": [
  {
    "matcher": "Task",
    "hooks": [
      {
        "type": "command",
        "command": "${PAI_DIR}/hooks/agent-start-voice.ts"
      }
    ]
  },
  {
    "matcher": "*",
    "hooks": [
      {
        "type": "command",
        "command": "${PAI_DIR}/hooks/capture-all-events.ts --event-type PreToolUse"
      }
    ]
  }
],
```

---

## Test-Plan

1. **Agent-Start testen:**
   ```
   User: "Recherchiere X"
   → Task tool wird aufgerufen
   → Voice: "Starte Recherche Agent"
   → Agent läuft
   ```

2. **Agent-Ende testen:**
   ```
   Agent beendet mit COMPLETED
   → SubagentStop Hook feuert
   → Voice: "Recherche hat X abgeschlossen"
   ```

---

## Risiken

| Risiko | Mitigation |
|--------|------------|
| Voice dauert zu lange | 5 Sek Timeout |
| pai-voice nicht gefunden | Absoluter Pfad, Fehler-tolerant |
| Doppelte Voice bei schnellen Agents | Agent-Start ist schnell, kein Problem |

---

## Voice-Konfiguration

| Situation | Voice |
|-----------|-------|
| Agent-Start | Otti (Default) |
| Agent-Ende | Otti (Default) |
| PAI Persona-Agent | Custom Voice via `[VOICE:id]` Tag |

---

## Cleanup

**Zu entfernen aus `subagent-stop-hook.ts`:**
- `AGENT_VOICE_IDS` Mapping (Zeile 6-15)
- `fetch()` zu localhost:***REMOVED*** (Zeile 278-293)

---

## Zusammenfassung

- **1 neue Datei:** `~/.claude/hooks/agent-start-voice.ts`
- **2 Änderungen:** `~/.claude/hooks/subagent-stop-hook.ts`, `~/.claude/settings.json`
- **Vereinfachung:** Alle Agents nutzen Otti, keine komplexe Voice-Mapping mehr
