#!/usr/bin/env bun

/**
 * voice-reminder.ts
 *
 * UserPromptSubmit Hook - Erinnert Claude an Voice-Feedback
 *
 * Wird bei jeder User-Nachricht ausgeführt und injiziert einen Reminder
 * für situationsgerechtes Voice-Feedback.
 *
 * Voice-Feedback ist angebracht bei:
 * - Zwischenergebnissen (Progress Updates)
 * - Endergebnissen (Task Completion)
 * - Fragen an den User
 *
 * NICHT bei:
 * - Reinen Tool-Aufrufen ohne Kommentar
 * - Kurzen Bestätigungen
 * - Rein technischen Outputs
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const PAI_DIR = process.env.PAI_DIR || join(process.env.HOME || '', '.claude');

async function main() {
  try {
    // Voice-Config lesen für voice_id
    const configPath = join(PAI_DIR, 'config/voice-feedback.json');
    let voiceId = '***REMOVED***'; // Fallback

    if (existsSync(configPath)) {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      if (config.enabled && config.voice?.id) {
        voiceId = config.voice.id;
      } else if (!config.enabled) {
        // Voice ist deaktiviert - kein Reminder nötig
        process.exit(0);
      }
    }

    // Reminder ausgeben
    const reminder = `<system-reminder>
VOICE-FEEDBACK REMINDER

Nutze Voice-Feedback via Bash CLI bei:
- Zwischenergebnissen: "Bin noch dran, habe X gefunden..."
- Endergebnissen: COMPLETED-Line vorlesen
- Fragen an User: Die Frage kurz vorlesen

NICHT bei: Reinen Tool-Outputs, kurzen Bestätigungen, technischen Details

COMMAND: ~/.claude/bin/pai-voice/pai-voice.ts say "dein text" --play
Voice-ID (bereits default): ${voiceId}
Sprache: Deutsch informal ("Moin!", "Fertig!", "Kurze Frage...")
</system-reminder>`;

    console.log(reminder);
    process.exit(0);
  } catch (error) {
    // Bei Fehlern still beenden - Reminder ist nice-to-have
    console.error('Voice-reminder hook error:', error);
    process.exit(0);
  }
}

main();
