# Jarvis Voice Toggle

Toggle Jarvis voice feedback on or off. When enabled, Jarvis speaks the COMPLETED line at the end of each task.

**Command:** `/jarvisOn`

## Instructions

1. Read the current state from `${PAI_DIR}/config/voice-feedback.json`
2. Toggle the `enabled` field (true → false, false → true)
3. Update `lastToggled` with current timestamp
4. Save the file
5. Confirm the new state to the user with voice feedback (if now enabled)

## Expected Output

**If toggling ON:**
- Update config: `enabled: true`
- Say via TTS: "Voice feedback enabled, sir."
- Confirm: "Voice-Feedback ist jetzt **aktiviert**."

**If toggling OFF:**
- Update config: `enabled: false`
- Confirm: "Voice-Feedback ist jetzt **deaktiviert**."
- (No TTS since it's now off)

## Config Location

`~/.claude/config/voice-feedback.json`

## Voice Settings (Jarvis)

```json
{
  "voice_id": "pxQ5J1NTCCuhK7jrRa1d",
  "stability": 0.5,
  "similarity_boost": 0.8,
  "speed": 0.95
}
```
