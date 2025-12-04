# Plan: Context Overflow Problem lösen

## Problem

Context füllt sich zu schnell → häufige Auto-Compacts → Kontext-Verlust

**Beobachtung aus Screenshots:**
- Session-Start: bereits 75% voll (149k/200k)
- Kurz danach: 76% (151k/200k)
- Jetzt: nur noch 4% frei!

---

## Root Cause Analyse

| Komponente | Tokens | Anteil | Problem? |
|------------|--------|--------|----------|
| **MCP Tools** | **24.8k** | **12.4%** | **HAUPTPROBLEM #1** |
| **SKILL.md** | **~2.6k** | **~1.3%** | **HAUPTPROBLEM #2** |
| System Tools | 16.8k | 8.4% | Nein (Claude Core) |
| Messages | 25-27k | 13% | Normal |

---

## 3 Lösungen (nach Research)

### Lösung A: MCP Lazy Loading (HIGH IMPACT: ~15-20k Tokens)

**Anthropic Paper (Nov 2024) - 3 Vorschläge:**
1. Progressive Disclosure via Filesystem Navigation
2. Context-Efficient Data Filtering
3. Improved Control Flow with Code Patterns

**Docker's Implementation:**
- MCP Gateway mit On-Demand Container Spawning
- 6 "Primordial Tools" für Discovery statt alle Tools laden
- Ergebnis: **95-98.7% Token-Reduktion möglich**

**Für PAI - Optionen:**

| Option | Aufwand | Ersparnis | Beschreibung |
|--------|---------|-----------|--------------|
| **A1: Tool-Filtering** | Niedrig | ~15k | In MCP Config nur benötigte Tools whitelisten |
| **A2: lazy-mcp** | Mittel | ~20k | Meta-Tool Wrapper (2 Tools statt 25) |
| **A3: Eigener Wrapper** | Hoch | ~20k | Eigener MCP Server mit nur 6 Tools |

**Empfehlung: A1 zuerst, dann A2 evaluieren**

---

### Lösung B: SKILL.md 3-Tier Progressive Disclosure (MEDIUM IMPACT: ~1.3k Tokens)

**PAI hat bereits ein 3-Tier System (aus CONSTITUTION.md):**

| Tier | Was | Wann geladen | Token-Impact |
|------|-----|--------------|--------------|
| 1 | Frontmatter + Essentials | Session-Start | ~600 tokens |
| 2 | SKILL.md Body | Bei Skill-Aktivierung | ~1.3k tokens |
| 3 | Reference Files | On-Demand | Variable |

**Problem:** SKILL.md nutzt das System NICHT richtig!
- Aktuell: 325 Zeilen werden IMMER geladen
- Sollte sein: ~150 Zeilen essentiell, Rest in Tier 3

**Refactoring-Plan:**

| Aus SKILL.md verschieben | → Neue Tier-3 Datei | relevant_when |
|--------------------------|---------------------|---------------|
| Response Format (38 Zeilen) | `ResponseFormat.md` | "response format", "output structure" |
| Voice Feedback (34 Zeilen) | `VoiceFeedback.md` | "voice", "speak", "announcement" |
| Security Protocols (29 Zeilen) | `SecurityProtocols.md` | "security", "git push", "credentials" |
| Delegation Patterns (49 Zeilen) | `DelegationPatterns.md` | "parallelize", "delegate", "agents" |
| History System (30 Zeilen) | `HistoryLookup.md` | "past work", "history", "previous" |

**Ergebnis:** SKILL.md von 325 → 150 Zeilen = **52% Reduktion**

---

### Lösung C: Mehr Delegation (VERHALTENS-ÄNDERUNG)

**User-Feedback:** Ich delegiere zu wenig an Agents.

**Regeln für bessere Delegation:**

| Task-Typ | Delegieren an | Model |
|----------|---------------|-------|
| Research/Exploration | Explore Agent | haiku |
| Web Research | claude-researcher | sonnet |
| Implementation | engineer Agent | sonnet |
| Code Review | Explore Agent | haiku |
| Bug Fixes | engineer Agent | sonnet |

**Eigenes Context-Window schonen:**
- Exploration → Agent (eigenes Window)
- Implementation → Agent (eigenes Window)
- Nur Koordination im Main-Window

---

## Implementation Plan

### Phase 1: MCP Tool-Filtering (Schnellster Win)

**Wichtige Erkenntnis:**
- ElevenLabs & voice-mode sind NICHT in `.mcp.json`
- Sie sind als **globale Claude Code Plugins** installiert
- Konfiguration vermutlich in Claude Code selbst (nicht editierbar)

**Option A: lazy-mcp Wrapper** (empfohlen)
```bash
# 1. lazy-mcp installieren
bunx @voicetreelab/lazy-mcp

# 2. Als Wrapper um ElevenLabs konfigurieren
# Exposes nur 2 Meta-Tools statt 25 Tools
```

**Option B: Eigenen MCP Wrapper bauen**
- TypeScript MCP Server der nur 6 Tools forwarded
- Mehr Kontrolle, aber mehr Aufwand

**Option C: Claude Code Feature Request abwarten**
- Issue #7336 fordert native Lazy Loading
- Könnte in zukünftiger Version kommen

**Schritt-für-Schritt (Option A):**
1. lazy-mcp recherchieren und installieren
2. ElevenLabs-Integration konfigurieren
3. In `.mcp.json` als Wrapper eintragen
4. Original ElevenLabs Plugin deaktivieren (falls möglich)
5. Testen mit `/context`

### Phase 2: SKILL.md Refactoring

**Schritt 1:** 5 neue Tier-3 Dateien erstellen (mit `relevant_when`)

**Schritt 2:** SKILL.md auf Essentials kürzen (~150 Zeilen)

**Schritt 3:** `load-reference-files.ts` Hook erstellen (wie decision-ping)
- Scannt User-Message für Trigger-Keywords
- Lädt passende Tier-3 Files on-demand

**Schritt 4:** Testen

### Phase 3: Delegation-Verhalten

**Keine Code-Änderung nötig** - Verhaltensanpassung:
- Bei Exploration → Explore Agent nutzen
- Bei Implementation → engineer Agent nutzen
- Main-Window nur für Koordination

---

## Dateien zu ändern

### Phase 1 (MCP)
- `~/.claude/settings.json` oder MCP-spezifische Config
- Eventuell: lazy-mcp installieren

### Phase 2 (SKILL.md)
- `~/.claude/skills/CORE/SKILL.md` - Kürzen
- `~/.claude/skills/CORE/ResponseFormat.md` - NEU
- `~/.claude/skills/CORE/VoiceFeedback.md` - NEU
- `~/.claude/skills/CORE/SecurityProtocols.md` - NEU
- `~/.claude/skills/CORE/DelegationPatterns.md` - NEU
- `~/.claude/skills/CORE/HistoryLookup.md` - NEU
- `~/.claude/hooks/load-reference-files.ts` - NEU

---

## Erwartete Ergebnisse

| Optimierung | Token-Ersparnis | Prozent |
|-------------|-----------------|---------|
| MCP Tool-Filtering | ~15-20k | 7-10% |
| SKILL.md Refactoring | ~1.3k | 0.6% |
| Mehr Delegation | Indirekt | Weniger Messages |
| **TOTAL** | **~16-21k** | **~8-11%** |

**Neue Session-Start Token-Nutzung:**
- Vorher: 149k/200k (75%)
- Nachher: ~130k/200k (65%) - **10% mehr Headroom**

---

## Quellen

- [Anthropic: Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Docker MCP Gateway](https://docs.docker.com/ai/mcp-gateway/)
- [lazy-mcp](https://github.com/voicetreelab/lazy-mcp) - Meta-Tool Pattern
- [Claude Code Feature Request #7336](https://github.com/anthropics/claude-code/issues/7336) - Lazy Loading

---

## STATUS UPDATE (2025-12-04 14:30)

### Abgeschlossen
- [x] Phase 2: SKILL.md Refactoring (325 → 85 Zeilen, 74% Reduktion)
- [x] Phase 1: MCP Research (3 Optionen evaluiert)
- [x] Decision: TypeScript > Python (mcp-filter als Fallback gespeichert)

---

## STATUS UPDATE (2025-12-04 ~11:00)

### Phase 1b: TypeScript MCP Proxy - IMPLEMENTIERT

**Dateien erstellt:**
```
~/.claude/custom-mcps/elevenlabs-proxy/
├── package.json          # Dependencies: @modelcontextprotocol/sdk, dotenv
├── tsconfig.json         # ES2022, NodeNext
├── src/
│   ├── config.ts         # Allowlist (6 Tools)
│   ├── client.ts         # Upstream ElevenLabs connection
│   ├── server.ts         # MCP Server mit Tool-Filter
│   └── index.ts          # Entry point mit .env loading
└── dist/                 # Compiled JS
```

**Test erfolgreich:**
```
[elevenlabs-proxy] Starting...
[elevenlabs-proxy] Allowlist: text_to_speech, play_audio, search_voices, voice_clone, speech_to_text, check_subscription
[elevenlabs-proxy] Connected to upstream ElevenLabs MCP
[elevenlabs-proxy] Server started, filtering to 6 tools
```

**MCP Config aktualisiert:**
- Neuer Server `elevenlabs-proxy` in `~/.claude/.mcp.json`
- Lädt API Key automatisch aus `~/.claude/.env`

### Noch offen
- [ ] Phase 3: Delegation-Regeln dokumentieren
- [ ] Token-Messung nach Session-Neustart

### Aktivierung
Nach Claude Code Neustart wird der Proxy automatisch verwendet. Die originalen ElevenLabs Tools bleiben parallel verfügbar (falls separat konfiguriert).

**Rollback:**
```bash
cp ~/.claude/history/backups/mcp.json.backup-2025-12-04 ~/.claude/.mcp.json
```
