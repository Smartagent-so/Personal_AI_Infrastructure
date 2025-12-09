# Checkpoint erstellen

Erstelle einen Git-Checkpoint mit Session-Status für Crash-Recovery.

## Aufgaben

1. **Session-Status dokumentieren** - Schreibe/aktualisiere `${PAI_DIR}/SESSION_STATUS.md`:
   - Aktueller Timestamp
   - Zusammenfassung was gerade bearbeitet wird
   - Liste der erledigten Tasks dieser Session
   - Nächste geplante Schritte
   - Offene Fragen/Entscheidungen

2. **Git Checkpoint erstellen** mit Conventional Commits:
   ```bash
   cd ~/.claude
   git add -A
   git commit -m "chore(checkpoint): [KURZE BESCHREIBUNG]

   Session checkpoint - manuell erstellt.

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

3. **Voice-Feedback** via CLI:
   ```bash
   ~/.claude/bin/pai-voice/pai-voice.ts say "Checkpoint erstellt" --play
   ```

4. **Bestätigung ausgeben** mit:
   - Commit-Hash (kurz)
   - Anzahl geänderter Dateien
   - Hinweis: "Recovery mit /recover-from-checkpoint"

## Format SESSION_STATUS.md

```markdown
# Session Status - Crash Recovery

**Checkpoint**: [TIMESTAMP]
**Commit**: [SHORT HASH]

## Aktueller Kontext
[Was wird gerade gemacht, welches Ziel]

## Diese Session erledigt
- [x] Task 1
- [x] Task 2

## Nächste Schritte
- [ ] Nächster Task
- [ ] Weiterer Task

## Offene Fragen
- Frage 1?

## Wichtige Dateien
- `pfad/zur/datei.md` - Beschreibung
```
