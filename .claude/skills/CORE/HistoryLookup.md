---
name: HistoryLookup
description: UOCS history system for past work lookup. USE WHEN past work OR history OR previous session OR what did we do OR search history.
relevant_when: "past work", "history", "previous session", "what did we do", "search history", "earlier", "before"
---

# History System - Past Work Lookup

**CRITICAL: When the user asks about ANYTHING done in the past, CHECK THE HISTORY SYSTEM FIRST.**

The history system at `${PAI_DIR}/history/` contains ALL past work - sessions, learnings, research, decisions.

## How to Search History

```bash
# Quick keyword search across all history
rg -i "keyword" ${PAI_DIR}/history/

# Search sessions specifically
rg -i "keyword" ${PAI_DIR}/history/sessions/

# List recent files
ls -lt ${PAI_DIR}/history/sessions/2025-12/ | head -20
```

## Directory Quick Reference

| What you're looking for | Where to search |
|------------------------|-----------------|
| Session summaries | `history/sessions/YYYY-MM/` |
| Problem-solving narratives | `history/learnings/YYYY-MM/` |
| Research & investigations | `history/research/YYYY-MM/` |
| Architecture decisions | `history/decisions/YYYY-MM/` |
| Features/bugs/refactors | `history/execution/YYYY-MM/` |
| Raw tool outputs | `history/raw-outputs/YYYY-MM/` |
