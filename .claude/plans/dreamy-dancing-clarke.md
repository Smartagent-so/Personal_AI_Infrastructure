# Plan: PAI Self-Improvement Loop (Lean Version)

## Design-Prinzipien

**WICHTIG:** Dieser Plan folgt PAI-Grundsätzen:
- **Progressive Disclosure** - Richtiger Context zur richtigen Zeit
- **Lean & Flexibel** - Minimale Komplexität, maximale Wirkung
- **Intent-basiert** - Wie PAI Skills (RELEVANT WHEN statt Keywords)
- **Datei-basiert** - Kein Over-Engineering mit komplexen Systemen

---

## Problem-Zusammenfassung

**Symptom:** Bei jeder neuen Session geht Wissen verloren.

**NICHT die Lösung:** Alles in den Context laden (skaliert nicht!)

**DIE Lösung:** Smartes Retrieval - relevante Decisions zur richtigen Zeit erinnern.

```
FALSCH (Over-Engineering):          RICHTIG (PAI-Prinzip):
┌─────────────────────────┐         ┌─────────────────────────┐
│ SessionStart            │         │ SessionStart            │
│ ├── Lade ALLE Decisions │         │ └── Nur SKILL.md        │
│ ├── Lade ALLE Learnings │         │                         │
│ └── Context voll!       │         │ Bei Bedarf:             │
│                         │         │ └── Relevante Decision  │
│ Nach 100 Sessions:      │         │     wird "gepingt"      │
│ └── System unbenutzbar  │         │                         │
└─────────────────────────┘         └─────────────────────────┘
```

---

## Der Self-Improvement Loop (Lean Version)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                PAI SELF-IMPROVEMENT LOOP (LEAN)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. CAPTURE (✅ existiert)                                             │
│      └── Protokollierung während Session                                │
│          • capture-decision.ts → history/decisions/                     │
│          • capture-session-summary.ts → history/sessions/               │
│                          ↓                                              │
│   2. STORAGE (✅ existiert)                                             │
│      └── Datei-basiertes History System                                 │
│          • history/decisions/ (mit RELEVANT WHEN)                       │
│          • history/sessions/                                            │
│                          ↓                                              │
│   3. SMART RETRIEVAL (🔧 neu)                                           │
│      └── Intent-basiertes Erinnern                                      │
│          • RELEVANT WHEN Clause pro Decision                            │
│          • Pinging-Mechanismus bei Themen-Match                         │
│          • KEIN Bulk-Loading!                                           │
│                          ↓                                              │
│   4. REVIEW & IMPROVE (🔧 später)                                       │
│      └── Periodische Analyse                                            │
│          • Manuell oder nach X Sessions                                 │
│          • Extrahiere Patterns, verbessere System                       │
│                          ↓                                              │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    LOOP ZURÜCK ZU 1.                            │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Lösung: 3-Phasen-Implementation (Lean)

### Phase 1: RELEVANT WHEN Pattern + Pinging

**Ziel:** Decisions werden zur richtigen Zeit erinnert, nicht bulk-geladen.

#### 1.1 Decision-Format mit RELEVANT WHEN

**Datei-Format für Decisions:**

```markdown
---
capture_type: DECISION
timestamp: 2025-12-04T07:51:20.891Z
title: "11labs MCP Tools statt Voice-Server"
tags: ["voice", "architecture"]
---

# Decision: 11labs MCP Tools statt Voice-Server

**RELEVANT WHEN:** discussing voice feedback, audio output, speech synthesis,
                   troubleshooting voice issues, OR choosing between voice implementations

## Context
Voice-Server hatte Streaming-Bug

## Decision
Direkte Nutzung der ElevenLabs MCP Tools

## Rationale
MCP Tools funktionieren zuverlässig, weniger Komplexität
```

**Warum RELEVANT WHEN:**
- Wie PAI Skills: Intent-basiert, nicht Keyword-basiert
- Claude versteht semantischen Match
- Skaliert unbegrenzt (keine Context-Explosion)

#### 1.2 Pinging-Mechanismus

**Konzept:** Ein leichtgewichtiger Hook der bei Themen-Match "pingt".

**Datei:** `/Users/pretor/.claude/hooks/decision-ping.ts`

```
Workflow:
1. Hook läuft bei Stop (nach jeder Antwort)
2. Liest aktuellen Konversations-Kontext (letzte User-Message)
3. Scannt history/decisions/ Dateien nach RELEVANT WHEN
4. Bei semantischem Match → Output: "💡 Reminder: Decision vom [date]: [title]"
5. Lädt NICHT die ganze Decision, nur den Reminder
```

**Beispiel-Output:**
```
💡 Reminder: Decision vom 04.12.2025: "11labs MCP Tools statt Voice-Server"
   → Relevant weil: Voice-Thema erkannt
   → Details: rg "11labs" ~/.claude/history/decisions/
```

#### 1.3 capture-decision.ts anpassen

**Datei:** `/Users/pretor/.claude/hooks/capture-decision.ts`

Änderung: RELEVANT WHEN Feld hinzufügen beim Capture.

**Input-Format erweitern:**
```json
{
  "decision": {
    "title": "...",
    "context": "...",
    "decision": "...",
    "relevant_when": "discussing X, troubleshooting Y, OR choosing between Z"
  }
}
```

---

### Phase 2: load-core-context.ts zurückbauen

**Ziel:** Kein Bulk-Loading mehr. Nur SKILL.md beim Start.

#### 2.1 Dynamic Context Loader vereinfachen

**Datei:** `/Users/pretor/.claude/hooks/load-core-context.ts`

**ENTFERNEN:**
- loadRecentLearnings()
- loadRecentDecisions()
- formatDynamicContext()

**BEHALTEN:**
- SKILL.md laden
- Variable Substitution ({{ENGINEER_NAME}}, etc.)
- Voice-Awareness in SKILL.md (nicht Details)

#### 2.2 SKILL.md Voice-Section anpassen

**Aktuell (zu detailliert):**
```markdown
## Voice Feedback (Always Active)
- Konfiguration: ${PAI_DIR}/config/voice-feedback.json
- Aktive Stimme: Ottie (Deutsch) / Jarvis (English)
- Tools: mcp__elevenlabs__text_to_speech + play_audio
```

**Besser (Awareness only):**
```markdown
## Voice Feedback

Voice-Feedback ist aktiviert. Nutze ElevenLabs MCP Tools.
Details werden von Hooks aus config/voice-feedback.json geladen.
```

---

### Phase 3: Review-Skill (Optional, Später)

**Ziel:** Periodische Analyse der History.

**Trigger:** Manuell (`/review`) oder Reminder nach X Sessions.

**Workflow:**
1. Lade Session-Summaries der letzten Woche
2. Identifiziere Patterns, wiederkehrende Probleme
3. Schlage System-Verbesserungen vor
4. User entscheidet: implementieren oder nicht

**Dateien:**
- `/Users/pretor/.claude/skills/Review/SKILL.md`
- Kein komplexes Queue-System nötig

---

## Implementierungs-Reihenfolge

```
PHASE 1: RELEVANT WHEN + Pinging (JETZT)
├── 1.1 capture-decision.ts: RELEVANT WHEN Feld hinzufügen
├── 1.2 decision-ping.ts: Neuer Hook für Erinnerungen
└── 1.3 Bestehende Decision aktualisieren (RELEVANT WHEN ergänzen)

PHASE 2: Context-Loader vereinfachen (DANACH)
├── 2.1 load-core-context.ts: Dynamic Loading entfernen
└── 2.2 SKILL.md: Voice-Section auf Awareness reduzieren

PHASE 3: Review-Skill (SPÄTER/OPTIONAL)
└── 3.1 Review/SKILL.md erstellen
```

---

## Kritische Dateien

| Datei | Aktion | Phase |
|-------|--------|-------|
| `hooks/capture-decision.ts` | ERWEITERN (relevant_when) | 1 |
| `hooks/decision-ping.ts` | NEU | 1 |
| `history/decisions/*.md` | FORMAT ANPASSEN | 1 |
| `hooks/load-core-context.ts` | VEREINFACHEN | 2 |
| `skills/CORE/SKILL.md` | VEREINFACHEN | 2 |
| `skills/Review/SKILL.md` | NEU (optional) | 3 |

---

## Erfolgs-Kriterien

**Nach Phase 1:**
- ✅ Decisions haben RELEVANT WHEN Clause
- ✅ Bei Themen-Match: Reminder wird gepingt
- ✅ Kein Bulk-Loading von Decisions

**Nach Phase 2:**
- ✅ SessionStart lädt NUR SKILL.md
- ✅ Voice-Awareness vorhanden, Details in Hooks
- ✅ Context Window bleibt schlank

**Nach Phase 3:**
- ✅ Periodische Reviews möglich
- ✅ System-Verbesserungen werden vorgeschlagen

---

## Was sich ändert (Korrektur von Phase 1 alt)

**VORHER (falsch - Over-Engineering):**
```
SessionStart → Lade alle Decisions → Lade alle Learnings → Context voll
```

**NACHHER (richtig - PAI-Prinzip):**
```
SessionStart → Nur SKILL.md
Bei Bedarf → Pinging erinnert an relevante Decisions
On-Demand → Ich kann jederzeit History durchsuchen
```

---

## Pinging-Implementierung: UserPromptSubmit Hook

**Analogie zu PAI Skills:**
```
Skills:     User-Input → Claude Code parsed Intent → Skill geladen → Antwort
Decisions:  User-Input → Hook prüft Relevanz → Reminder injected → Antwort
```

**Der richtige Hook: UserPromptSubmit**

```typescript
// Hook läuft BEVOR Claude antwortet
// Basierend auf User-Input wird geprüft ob relevante Decisions existieren

UserPromptSubmit Hook:
1. Lese User-Message aus stdin
2. Scanne history/decisions/ nach RELEVANT WHEN Matches
3. Bei Match: Output Reminder als system-reminder
4. Claude hat den Context BEVOR er antwortet
```

**Warum UserPromptSubmit statt Stop:**
- Stop = nach der Antwort (zu spät!)
- UserPromptSubmit = vor der Antwort (wie Skills)
- Context ist verfügbar wenn Claude nachdenkt

**Hook-Config in settings.json:**
```json
"UserPromptSubmit": [
  {
    "command": "${PAI_DIR}/hooks/decision-ping.ts"
  }
]
```
