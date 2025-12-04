---
name: BrandBuilder
description: Comprehensive brand development system with CIS agent interviews. USE WHEN user wants to build brand, create brand guide, develop brand identity, find brand purpose, define positioning, OR mentions branding, rebrand, brand strategy.
---

# BrandBuilder - Brand Development System

A comprehensive brand development skill that uses CIS agents for interactive discovery sessions. Creates milestone documents at each phase for a complete brand guide.

## Workflow Routing

**When executing a workflow, call the notification script via Bash:**

```bash
${PAI_DIR}/tools/skill-workflow-notification WorkflowName BrandBuilder
```

| Workflow | Trigger | CIS-Agent | File |
|----------|---------|-----------|------|
| **StatusAssessment** | "build brand", "start branding", "brand builder" | - | `workflows/StatusAssessment.md` |
| **PurposeDiscovery** | "find my why", "brand purpose", "mission statement" | Dr. Quinn | `workflows/PurposeDiscovery.md` |
| **CustomerDiscovery** | "customer personas", "target audience", "empathy map" | Maya | `workflows/CustomerDiscovery.md` |
| **StrategicPositioning** | "positioning", "differentiation", "blue ocean" | Victor | `workflows/StrategicPositioning.md` |
| **CreativeIdentity** | "naming", "tagline", "visual brainstorm" | Carson | `workflows/CreativeIdentity.md` |
| **BrandStory** | "brand story", "narrative", "storybrand" | Sophia | `workflows/BrandStory.md` |

## Examples

**Example 1: New brand from scratch**
```
User: "Ich möchte eine Marke für mein neues Business aufbauen"
→ Invokes StatusAssessment workflow
→ Agent fragt nach Situation, bestehendem Material
→ Empfiehlt: Start mit PurposeDiscovery (Dr. Quinn)
→ Dr. Quinn führt Five Whys Interview
→ Speichert: milestones/{brand}/01-Purpose-Discovery.md
```

**Example 2: Find brand positioning**
```
User: "Ich brauche Hilfe bei meiner Positionierung"
→ Invokes StrategicPositioning workflow
→ Victor analysiert Wettbewerber
→ Führt Blue Ocean Strategy Canvas durch
→ Entwickelt Positioning Statement
→ Speichert: milestones/{brand}/02-Positioning-Statement.md
```

**Example 3: Develop brand story**
```
User: "Hilf mir, die Geschichte meiner Marke zu erzählen"
→ Invokes BrandStory workflow
→ Sophia führt StoryBrand Framework durch
→ User = Guide, Kunde = Hero
→ Entwickelt Brand Narrative
→ Voice: "Jede Marke hat eine Geschichte, die erzählt werden will..."
```

---

## The Five Phases

### Phase 1: Discovery (2-3 Wochen)
**Agents:** Dr. Quinn (Purpose), Maya (Customers)

**Deliverables:**
- 01-Discovery-Document.md
- 01-Competitor-Analysis.md
- 01-Customer-Personas.md
- 01-SWOT-Analysis.md

**Quality Gate 1:**
- [ ] 60+ Discovery-Fragen beantwortet
- [ ] 5-10 Wettbewerber analysiert
- [ ] 2-3 Personas erstellt

### Phase 2: Strategy (2-3 Wochen)
**Agents:** Victor (Positioning), Carson (Creative), Sophia (Story)

**Deliverables:**
- 02-Mission-Vision-Values.md
- 02-Positioning-Statement.md
- 02-Brand-Archetype.md
- 02-Tone-of-Voice.md
- 02-Brand-Story.md

**Quality Gate 2:**
- [ ] Mission max. 2 Sätze
- [ ] Positioning Statement validiert
- [ ] Archetype ausgewählt
- [ ] Tone of Voice mit 5-7 Adjektiven

### Phase 3: Visual Identity (3-4 Wochen)
**Agents:** Carson (Visual Brainstorm)

**Deliverables:**
- 03-Visual-Identity.md
- 03-Color-Palette.md
- 03-Typography-System.md
- 03-Logo-Guidelines.md

**Quality Gate 3:**
- [ ] Logo funktioniert in S/W
- [ ] Alle Farbcodes (HEX, RGB, CMYK)
- [ ] Fonts lizenziert

### Phase 4: Documentation (1-2 Wochen)
**Agents:** Sophia (Narrative Sections)

**Deliverables:**
- 04-Brand-Guide-Draft.md
- 04-Asset-Library-Index.md

### Phase 5: Implementation
**Deliverables:**
- 05-Implementation-Checklist.md
- 05-Templates/ (Business Card, Social, Email)

---

## CIS Agent Roles in BrandBuilder

| Agent | Role | Interview Style | Key Questions |
|-------|------|-----------------|---------------|
| **Dr. Quinn** | Brand Purpose | Analytical, Five Whys | "WARUM existiert eure Marke?" |
| **Maya** | Customer Empathy | Warm, explorativ | "Was FÜHLT dein Kunde?" |
| **Victor** | Strategic Position | Strategisch, scharf | "Was macht euch WIRKLICH anders?" |
| **Carson** | Creative Identity | Energetisch, YES AND | "Was wäre wenn wir...?" |
| **Sophia** | Brand Narrative | Poetisch, tiefgründig | "Welche Geschichte erzählt ihr?" |

---

## Voice Integration

**Use CISSpeak for agent voice output:**

```bash
bun ${PAI_DIR}/skills/CIS/tools/CISSpeak.ts quinn "Warum existiert eure Marke? Das ist die entscheidende Frage."
bun ${PAI_DIR}/skills/CIS/tools/CISSpeak.ts maya "Stell dir deinen idealen Kunden vor..."
bun ${PAI_DIR}/skills/CIS/tools/CISSpeak.ts victor "Wer sind eure Konkurrenten? Zeigt mir die Landschaft."
bun ${PAI_DIR}/skills/CIS/tools/CISSpeak.ts carson "YES! Lass uns 20 verrückte Ideen generieren!"
bun ${PAI_DIR}/skills/CIS/tools/CISSpeak.ts sophia "Jede Marke hat eine Geschichte, die erzählt werden will."
```

---

## Milestone Storage

All milestone documents are saved to:

```
${PAI_DIR}/history/brand-projects/{brand-slug}/
├── phase-1/
│   ├── 01-discovery-document.md
│   ├── 01-competitor-analysis.md
│   └── 01-customer-personas.md
├── phase-2/
│   ├── 02-positioning-statement.md
│   └── 02-brand-story.md
├── phase-3/
│   └── 03-visual-identity.md
└── phase-4/
    └── 04-brand-guide.md
```

---

## Frameworks & Templates

| Resource | Description | File |
|----------|-------------|------|
| Discovery Questions | 80+ brand discovery questions | `frameworks/discovery-questions.csv` |
| Brand Archetypes | 12 Jungian archetypes | `frameworks/brand-archetypes.csv` |
| Positioning Canvas | 9-element canvas template | `frameworks/positioning-canvas.md` |
| Persona Template | Customer persona structure | `templates/persona-template.md` |
| Brand Guide Outline | Complete guide structure | `templates/brand-guide-outline.md` |

---

## Quick Start Commands

```
# Start brand building process
"BrandBuilder starten" → StatusAssessment

# Specific phase entry
"Finde mein Brand Purpose" → PurposeDiscovery mit Dr. Quinn
"Wer ist meine Zielgruppe?" → CustomerDiscovery mit Maya
"Wie positioniere ich mich?" → StrategicPositioning mit Victor
"Brainstorm Markennamen" → CreativeIdentity mit Carson
"Erzähle meine Brand Story" → BrandStory mit Sophia
```

---

## Directory Structure

```
BrandBuilder/
├── SKILL.md                      # This file
├── CONCEPT.md                    # Detailed concept documentation
├── workflows/
│   ├── StatusAssessment.md       # Entry point, situation analysis
│   ├── PurposeDiscovery.md       # Five Whys with Dr. Quinn
│   ├── CustomerDiscovery.md      # Empathy mapping with Maya
│   ├── StrategicPositioning.md   # Blue Ocean with Victor
│   ├── CreativeIdentity.md       # Naming/Visual with Carson
│   └── BrandStory.md             # StoryBrand with Sophia
├── frameworks/
│   ├── discovery-questions.csv   # 80+ questions
│   ├── brand-archetypes.csv      # 12 archetypes with traits
│   └── positioning-canvas.md     # 9-element canvas
└── templates/
    ├── persona-template.md
    ├── positioning-template.md
    └── brand-guide-outline.md
```
