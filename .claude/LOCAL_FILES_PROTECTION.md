# Lokale Dateien Schutz-Strategie

## Problem
Beim `git pull` vom Upstream (danielmiessler/Personal_AI_Infrastructure) werden lokale Konfigurationen überschrieben.

## Lösung: git skip-worktree

Folgende Dateien sind mit `git update-index --skip-worktree` geschützt:

| Datei | Zweck |
|-------|-------|
| `.mcp.json` | Deine persönlichen MCP-Server |
| `settings.json` | Deine Berechtigungen, Hooks, Plugins |

## Wie es funktioniert

```bash
# Schutz aktivieren (bereits gesetzt)
git update-index --skip-worktree .mcp.json
git update-index --skip-worktree settings.json

# Schutz-Status prüfen
git ls-files -v | grep "^S"
# Output: S = skip-worktree aktiv

# Schutz temporär aufheben (für manuelle Updates)
git update-index --no-skip-worktree settings.json
```

## Bei PAI-Updates (git pull upstream)

1. **VOR dem Pull** - Prüfen ob Schutz aktiv:
   ```bash
   git ls-files -v | grep "^S"
   ```

2. **Nach dem Pull** - Falls Dateien fehlen:
   ```bash
   # Dependencies installieren
   cd ~/.claude/bin/pai-voice && bun install

   # Commands aus History wiederherstellen falls nötig
   git show COMMIT^:commands/DATEI.md > commands/DATEI.md
   ```

## Weitere Schutz-Optionen

### Option A: .gitignore (für neue Dateien)
```bash
echo ".mcp.json" >> .gitignore
echo "settings.local.json" >> .gitignore
```

### Option B: Separate lokale Config
Erstelle `settings.local.json` für deine Anpassungen (wird von Claude Code gemerged).

## Backup-Strategie

Vor jedem Update:
```bash
/create-checkpoint
```

Nach Problemen:
```bash
/recover-from-checkpoint
```

## Wichtige Commits

- `cdaac6d` - Checkpoint commands wiederhergestellt
- `63ae18f` - pai-voice CLI hinzugefügt

---
Erstellt: 2025-12-09
Letzte Aktualisierung: 2025-12-09
