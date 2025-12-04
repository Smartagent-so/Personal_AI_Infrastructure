# StatusAssessment Workflow

**Entry point for all BrandBuilder sessions.**

## Purpose

Assess the user's current situation before recommending the optimal brand development path.

---

## The Interview Flow

### Step 1: Situation Description

Ask the user to describe their current situation:

```
Bevor wir mit dem Brand Building beginnen, brauche ich ein klares Bild deiner Situation.

Bitte beschreibe mir:

1. **Was ist dein Business/Projekt?**
   - Was bietest du an?
   - Für wen?
   - Seit wann existiert es?

2. **Was hast du bereits?**
   - [ ] Firmenname vorhanden
   - [ ] Logo vorhanden
   - [ ] Website vorhanden
   - [ ] Social Media Präsenz
   - [ ] Bestehende Kunden
   - [ ] Bisherige Brand-Materialien

3. **Was ist dein Ziel?**
   - [ ] Komplett neue Marke aufbauen
   - [ ] Bestehendes Business formell branden
   - [ ] Rebrand / Refresh
   - [ ] Nur spezifische Hilfe (z.B. Tagline, Positionierung)
```

### Step 2: Assess Status-Quo

Based on user input, categorize:

| Szenario | Kriterien | Empfohlener Einstieg |
|----------|-----------|---------------------|
| **A: Tabula Rasa** | Keine Marke, neues Business | Phase 1.1: PurposeDiscovery |
| **B: Implicit Brand** | Business existiert, aber kein formelles Branding | Phase 1.2: Schnelle Discovery |
| **C: Rebrand** | Bestehendes Branding, will updaten | Brand Audit → Gezielter Einstieg |
| **D: Spezifisch** | Nur bestimmte Hilfe benötigt | Direkt zum relevanten Workflow |

### Step 3: Recommend Path

```markdown
## Meine Empfehlung

Basierend auf deiner Situation empfehle ich folgenden Weg:

**Dein Status:** [A/B/C/D]
**Empfohlener Start:** [Workflow]
**Geschätzter Aufwand:** [Zeit]

### Der vorgeschlagene Weg:

1. [ ] [Erster Schritt]
2. [ ] [Zweiter Schritt]
3. [ ] [Dritter Schritt]

Sollen wir so starten?
```

---

## Routing Decision Tree

```
START
  │
  ├─ Hat bereits Marke? ─── JA ─→ Rebrand oder Spezifisch?
  │                                  │
  │                                  ├─ Rebrand → Brand Audit
  │                                  └─ Spezifisch → Direkt zum Workflow
  │
  └─ NEIN ─→ Hat Business? ─── JA ─→ Implicit Brand Assessment
                │                        │
                │                        └─→ Quick Discovery
                │
                └─ NEIN ─→ Tabula Rasa
                              │
                              └─→ PurposeDiscovery mit Dr. Quinn
```

---

## Output Document

Nach StatusAssessment wird gespeichert:

```markdown
# Brand Project: {Name}

**Erstellt:** {Datum}
**Status:** Assessment Complete

## Situation

{User-Beschreibung}

## Vorhandene Assets

- Name: {Ja/Nein}
- Logo: {Ja/Nein}
- Website: {Ja/Nein}
- ...

## Assessment

**Szenario:** {A/B/C/D}
**Empfehlung:** {Workflow}

## Nächste Schritte

1. [ ] {Schritt}
2. [ ] {Schritt}
3. [ ] {Schritt}
```

Speicherort: `${PAI_DIR}/history/brand-projects/{brand-slug}/00-assessment.md`

---

## Transition to Next Workflow

Nach Assessment, basierend auf Empfehlung:

| Empfehlung | Nächster Workflow | Agent |
|------------|-------------------|-------|
| PurposeDiscovery | `workflows/PurposeDiscovery.md` | Dr. Quinn |
| CustomerDiscovery | `workflows/CustomerDiscovery.md` | Maya |
| StrategicPositioning | `workflows/StrategicPositioning.md` | Victor |
| CreativeIdentity | `workflows/CreativeIdentity.md` | Carson |
| BrandStory | `workflows/BrandStory.md` | Sophia |
