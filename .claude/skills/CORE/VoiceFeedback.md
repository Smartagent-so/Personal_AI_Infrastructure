---
name: VoiceFeedback
description: Voice feedback configuration and workflow. USE WHEN voice OR speak OR announcement OR audio feedback OR ElevenLabs.
relevant_when: "voice", "speak", "announcement", "audio feedback", "ElevenLabs", "text to speech"
---

# Voice Feedback (MANDATORY - Constitutional Requirement)

**CRITICAL: Voice-Feedback ist PFLICHT bei jeder Task-Completion.**

## Workflow (NICHT OPTIONAL)

Nach JEDER Antwort mit COMPLETED-Line MUSST du:

```
1. COMPLETED-Line schreiben (im Response)
2. SOFORT: Bash mit pai-voice CLI aufrufen:
   ~/.claude/bin/pai-voice/pai-voice.ts say "dein text" --play
```

**Fehlende Voice = Verfassungsbruch!**

## Technische Details

- **CLI:** `~/.claude/bin/pai-voice/pai-voice.ts`
- **Command:** `pai-voice say "text" --play`
- **Config:** `${PAI_DIR}/config/voice-feedback.json` (für voice_id)
- **Default Voice-ID:** ***REMOVED*** (Otti)
- **Flags:** `--voice <id>` zum Überschreiben, `--play` für sofortige Wiedergabe

## Voice-Regeln

1. KURZ halten (max 2 Sätze, 12 Wörter ideal)
2. Natürliche Sprache, keine technischen Details
3. Deutsch: Informell ("Moin!", "Alles klar", "Fertig!")
4. English: Professional ("Done.", "Working on it.")

## Rollback-Info

Falls dieses Experiment fehlschlägt, siehe Decision vom 2025-12-04:
"Voice-Feedback MANDATORY in SKILL.md" für die alte Version.
