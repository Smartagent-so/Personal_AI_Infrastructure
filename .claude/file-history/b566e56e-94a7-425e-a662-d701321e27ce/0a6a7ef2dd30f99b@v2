# CustomerDiscovery Workflow

**Agent:** Maya (Design Thinking Maestro)
**Voice:** Katie (Authentic, flowing)
**Methods:** Empathy Mapping, Persona Development, Jobs-to-be-Done

---

## Purpose

Develop deep understanding of target customers through empathetic exploration.

---

## Maya's Opening

```bash
bun ${PAI_DIR}/skills/CIS/tools/CISSpeak.ts maya "Hi, ich bin Maya. Heute tauchen wir tief in die Welt deiner Kunden ein. Nicht was sie kaufen, sondern wer sie SIND."
```

**Text:**
```
Willkommen zur Customer Discovery.

Ich bin Maya, und ich glaube, dass großartige Marken ihre Kunden nicht
nur kennen - sie FÜHLEN mit ihnen.

Heute werden wir:
1. Echte Menschen hinter deinen Kunden entdecken
2. Ihre tiefsten Frustrationen und Wünsche verstehen
3. Customer Personas entwickeln, die lebendig werden

Stell dir vor, dein idealer Kunde sitzt gerade neben dir.
Erzähl mir von diesem Menschen.
```

---

## Empathy Interview Flow

### Part 1: Die Person

```
Denk an einen echten Menschen - jemanden, den du kennst oder
einen idealen Kunden, den du dir vorstellst.

- Wie heißt diese Person? (Gib ihr einen Namen)
- Wie alt ist sie?
- Was macht sie beruflich?
- Wie sieht ein typischer Tag aus?
```

### Part 2: Jobs-to-be-Done

```bash
bun ${PAI_DIR}/skills/CIS/tools/CISSpeak.ts maya "Was versucht diese Person in ihrem Leben zu erreichen? Welchen Fortschritt sucht sie?"
```

```
Welchen "Job" versucht diese Person zu erledigen?
(Nicht was sie KAUFT, sondern was sie ERREICHEN will)

- Funktionaler Job: Was muss erledigt werden?
- Sozialer Job: Wie will sie von anderen gesehen werden?
- Emotionaler Job: Wie will sie sich FÜHLEN?
```

### Part 3: Pains (Frustrationen)

```bash
bun ${PAI_DIR}/skills/CIS/tools/CISSpeak.ts maya "Was frustriert diese Person? Was liegt ihr nachts wach?"
```

```
Welche Frustrationen hat diese Person?

- Was nervt sie im Alltag?
- Was kostet sie Zeit, Geld oder Energie?
- Welche Risiken oder Ängste hat sie?
- Was hat sie schon probiert, das nicht funktioniert hat?
```

### Part 4: Gains (Wünsche)

```bash
bun ${PAI_DIR}/skills/CIS/tools/CISSpeak.ts maya "Was würde diese Person glücklich machen? Was ist ihr geheimer Wunsch?"
```

```
Was wünscht sich diese Person?

- Was wäre ihr Idealzustand?
- Was würde sie überraschen und begeistern?
- Welchen Status oder welche Anerkennung sucht sie?
- Was ist ihr "geheimer Traum"?
```

---

## Empathy Map Canvas

Nach dem Interview, visualisiere:

```
┌────────────────┬────────────────┐
│     DENKT      │     FÜHLT      │
│                │                │
│ Was geht ihr   │ Was sind ihre  │
│ durch den Kopf?│ Emotionen?     │
│                │                │
├────────────────┼────────────────┤
│     SAGT       │     TUT        │
│                │                │
│ Was sagt sie   │ Wie verhält    │
│ zu anderen?    │ sie sich?      │
│                │                │
└────────────────┴────────────────┘
        │                 │
        ▼                 ▼
┌────────────────┬────────────────┐
│     PAINS      │     GAINS      │
│                │                │
│ Frustrationen  │ Wünsche und    │
│ und Ängste     │ Hoffnungen     │
│                │                │
└────────────────┴────────────────┘
```

---

## Persona Template

```markdown
# Customer Persona: {Name}

## Demografisch
- **Alter:**
- **Beruf:**
- **Einkommen:**
- **Wohnort:**
- **Familienstand:**

## Psychografisch
- **Werte:**
- **Interessen:**
- **Lifestyle:**
- **Medienkonsum:**

## Jobs-to-be-Done
- **Funktional:** {Was muss erledigt werden?}
- **Sozial:** {Wie will sie gesehen werden?}
- **Emotional:** {Wie will sie sich fühlen?}

## Pains
1. {Frustration 1}
2. {Frustration 2}
3. {Frustration 3}

## Gains
1. {Wunsch 1}
2. {Wunsch 2}
3. {Wunsch 3}

## Typischer Satz
"{Ein Satz, den diese Person sagen würde}"

## Entscheidungsprozess
- Wie findet sie Lösungen?
- Wem vertraut sie?
- Was überzeugt sie?
```

---

## Maya's Closing Synthesis

```bash
bun ${PAI_DIR}/skills/CIS/tools/CISSpeak.ts maya "Jetzt verstehe ich {Name}. Sie sucht nicht nur {Produkt}, sie sucht {tieferer Wunsch}."
```

**Beispiel:**
```
Jetzt verstehe ich Maria.

Sie sucht nicht nur eine Website.
Sie sucht Legitimität. Professionelle Anerkennung.
Sie will, dass ihre kleine Bäckerei so ernst genommen wird
wie die große Kette nebenan.

Der Schmerz ist nicht "keine Website haben" -
der Schmerz ist "nicht ernst genommen werden".

Die Lösung muss also nicht nur eine Website sein,
sondern ein Gefühl von: "Ich gehöre hierher."
```

---

## Output Document

```markdown
# Customer Discovery

**Brand:** {Name}
**Datum:** {Date}
**Agent:** Maya

---

## Persona 1: {Name}

### Demographic Profile
- Alter:
- Beruf:
- Einkommen:
- Wohnort:

### Empathy Map

**Denkt:** {Gedanken}

**Fühlt:** {Emotionen}

**Sagt:** {Aussagen}

**Tut:** {Verhalten}

### Jobs-to-be-Done
- Funktional:
- Sozial:
- Emotional:

### Pains
1.
2.
3.

### Gains
1.
2.
3.

---

## Persona 2: {Name}
{Repeat structure}

---

## Key Insights

1. {Insight 1}
2. {Insight 2}
3. {Insight 3}

---

## Implications for Brand

- Messaging sollte ansprechen: {X}
- Ton sollte sein: {Y}
- Visuals sollten zeigen: {Z}

---

## Next Steps

- [ ] Validate Personas mit echten Kunden
- [ ] Develop Positioning (Victor)
- [ ] Craft targeted messaging (Carson)
```

Speicherort: `${PAI_DIR}/history/brand-projects/{brand-slug}/phase-1/01-customer-personas.md`
