# Von Checkpoint wiederherstellen

Stelle den Session-Kontext nach einem Crash wieder her.

## Aufgaben

1. **Session-Status lesen** - Lies `${PAI_DIR}/SESSION_STATUS.md` und fasse zusammen:
   - Wann war der letzte Checkpoint
   - Was wurde bereits erledigt
   - Was sind die nächsten Schritte

2. **Git-Historie prüfen**:
   ```bash
   cd ~/.claude
   git log --oneline -5
   git status
   ```
   - Zeige die letzten Checkpoints
   - Prüfe ob es uncommittete Änderungen gibt

3. **Kontext wiederherstellen**:
   - Lies relevante Projektdateien die im Status erwähnt werden
   - Erstelle eine Todo-Liste mit den offenen Tasks
   - Frage den User ob er fortfahren möchte

4. **Ausgabe formatieren**:
   ```
   ## Recovery von Checkpoint [HASH] - [DATUM]

   ### Letzter Stand
   [Zusammenfassung]

   ### Offene Tasks
   - [ ] Task 1
   - [ ] Task 2

   ### Bereit zum Fortfahren?
   [Frage an User]
   ```

## Falls keine SESSION_STATUS.md existiert

- Analysiere die Git-Historie
- Finde kürzlich geänderte Dateien
- Versuche den Kontext aus Dateinamen/Inhalten zu rekonstruieren
- Frage den User nach dem letzten Arbeitsstand
