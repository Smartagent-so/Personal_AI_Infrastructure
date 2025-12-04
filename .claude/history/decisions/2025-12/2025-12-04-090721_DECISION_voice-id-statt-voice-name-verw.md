---
capture_type: DECISION
timestamp: 2025-12-04T09:07:21.906Z
session_id: d6a37ffc
title: "Voice-ID statt Voice-Name verwenden"
source: session
tags: ["voice", "elevenlabs", "config", "bugfix"]
relevant_when: "configuring voice feedback, troubleshooting ElevenLabs, voice not working, OR setting up TTS"
---

# Decision: Voice-ID statt Voice-Name verwenden

**Date:** 2025-12-04
**Session:** d6a37ffc
**Tags:** `voice` `elevenlabs` `config` `bugfix`

**RELEVANT WHEN:** configuring voice feedback, troubleshooting ElevenLabs, voice not working, OR setting up TTS

---

## Context

Voice-Feedback funktionierte nicht mehr. Diagnose zeigte: Config hatte voice.name=Ottie, aber in ElevenLabs heißt die Voice Ostfriesicher Nerd (gleiche ID).

---

## Decision

Bei ElevenLabs MCP Tools immer voice_id verwenden, nicht voice_name. Namen können sich ändern, IDs bleiben stabil.

---

## Alternatives Considered

1. Voice umbenennen in ElevenLabs
2. Config-Name anpassen

---

## Rationale

IDs sind unveränderlich, Namen nicht. Zuverlässigere Lösung.

---

## Implications

None documented

---

**Captured:** 2025-12-04T09:07:21.906Z
