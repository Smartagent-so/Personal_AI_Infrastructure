---
capture_type: DECISION
timestamp: 2025-12-04T09:28:43.625Z
session_id: continued-session
title: "Voice-Reminder via UserPromptSubmit Hook"
source: session
tags: ["voice", "hook", "experiment"]
relevant_when: "voice feedback not working, evaluating voice experiments, OR troubleshooting voice hooks"
---

# Decision: Voice-Reminder via UserPromptSubmit Hook

**Date:** 2025-12-04
**Session:** continued-session
**Tags:** `voice` `hook` `experiment`

**RELEVANT WHEN:** voice feedback not working, evaluating voice experiments, OR troubleshooting voice hooks

---

## Context

Prompt-Verstärkung in SKILL.md reichte nicht - Voice-Feedback wurde trotzdem vergessen. Stop-Hook nicht möglich da kein Zugang zur Claude-Antwort.

---

## Decision

UserPromptSubmit Hook (voice-reminder.ts) der bei jeder User-Nachricht einen Reminder injiziert. Reminder erklärt WANN Voice angebracht ist: Zwischenergebnisse, Endergebnisse, Fragen - NICHT bei reinen Tool-Outputs.

---

## Alternatives Considered

1. MANDATORY in SKILL.md (gescheitert)
2. Stop-Hook (technisch nicht möglich)
3. Manuell disziplinierter sein

---

## Rationale

UserPromptSubmit ist der einzige Hook der VOR der Claude-Antwort läuft und Context injizieren kann.

---

## Implications

None documented

---

**Captured:** 2025-12-04T09:28:43.625Z
