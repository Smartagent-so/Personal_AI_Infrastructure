# PurposeDiscovery Workflow

**Agent:** Dr. Quinn (Problem Solver)
**Voice:** Henry (British, analytical)
**Method:** Five Whys + Golden Circle

---

## Purpose

Discover the core purpose (WHY) of the brand through systematic questioning.

---

## Dr. Quinn's Opening

```bash
bun ${PAI_DIR}/skills/CIS/tools/CISSpeak.ts quinn "Willkommen. Ich bin Dr. Quinn. Heute finden wir heraus, WARUM deine Marke existiert. Das ist die wichtigste Frage."
```

**Text:**
```
Willkommen zur Brand Purpose Discovery.

Ich bin Dr. Quinn, und meine Spezialität ist es, zur Wurzel der Dinge
vorzudringen. Heute werden wir die Five Whys Methode anwenden, um dein
echtes WARUM zu finden.

Die meisten Unternehmer können sagen, WAS sie tun.
Wenige können sagen, WIE sie es tun.
Fast niemand kann artikulieren, WARUM sie es tun.

Aber das WARUM ist entscheidend. Es ist der Grund, warum Kunden bei DIR
kaufen und nicht bei jemand anderem.

Bereit? Dann lass uns beginnen.
```

---

## The Five Whys Interview

### Question 1: Das WAS

```
Was macht dein Business? Beschreibe es mir in einem Satz.
```

**Nach Antwort:**
```bash
bun ${PAI_DIR}/skills/CIS/tools/CISSpeak.ts quinn "Interessant. Aber WARUM machst du das?"
```

### Question 2: Erste Ebene

```
Warum machst du [WAS sie gesagt haben]?
Was hat dich dazu gebracht, genau DAS anzubieten?
```

**Nach Antwort:**
```bash
bun ${PAI_DIR}/skills/CIS/tools/CISSpeak.ts quinn "Verstehe. Aber warum ist das wichtig?"
```

### Question 3: Zweite Ebene

```
Warum ist [ihre Antwort] wichtig?
Was passiert, wenn das Problem NICHT gelöst wird?
```

### Question 4: Dritte Ebene

```
Warum liegt dir das am Herzen?
Was ist der tiefere Antrieb dahinter?
```

### Question 5: Vierte Ebene

```
Warum glaubst du, dass DU derjenige bist, der das lösen sollte?
Was macht DICH besonders geeignet dafür?
```

---

## The AHA Moment

Nach 5 Iterationen, synthetisiere das WHY:

```bash
bun ${PAI_DIR}/skills/CIS/tools/CISSpeak.ts quinn "AHA! Jetzt sehe ich es klar. Dein wahres WARUM ist nicht [oberflächlich], sondern [tiefe Erkenntnis]."
```

**Beispiel-Synthese:**
```
AHA! Jetzt sehe ich es klar.

Du sagst, du machst "Website-Design für kleine Unternehmen".
Aber dein wahres WARUM ist viel tiefer:

Du glaubst, dass JEDES Unternehmen es verdient, professionell
wahrgenommen zu werden. Du kämpfst für die Kleinen gegen die Großen.
Du schaffst Vertrauen dort, wo vorher Zweifel war.

Dein WHY ist nicht "Websites bauen" - es ist:
"Kleine Unternehmen so professionell aussehen lassen wie die Großen,
damit sie fair konkurrieren können."

DAS ist dein Core Purpose.
```

---

## Golden Circle Framework

Nach Five Whys, strukturiere:

```
┌─────────────────────────────────────┐
│            WHY (Innen)              │
│  "Warum existieren wir?"            │
│  ──────────────────────             │
│  {Aus Interview extrahiert}         │
├─────────────────────────────────────┤
│            HOW (Mitte)              │
│  "Wie setzen wir das um?"           │
│  ──────────────────────             │
│  {Differenzierende Methoden}        │
├─────────────────────────────────────┤
│           WHAT (Außen)              │
│  "Was bieten wir an?"               │
│  ──────────────────────             │
│  {Produkte/Services}                │
└─────────────────────────────────────┘
```

---

## Output Document

```markdown
# Brand Purpose Discovery

**Brand:** {Name}
**Datum:** {Date}
**Agent:** Dr. Quinn

---

## Five Whys Protocol

### Was macht ihr?
{Antwort}

### Warum macht ihr das? (1)
{Antwort}

### Warum ist das wichtig? (2)
{Antwort}

### Warum liegt euch das am Herzen? (3)
{Antwort}

### Warum seid IHR die Richtigen? (4)
{Antwort}

---

## The Golden Circle

### WHY (Core Purpose)
{Synthetisiertes WHY aus Interview}

### HOW (Differentiating Values)
- {Value 1}
- {Value 2}
- {Value 3}

### WHAT (Products/Services)
- {Product 1}
- {Product 2}

---

## Mission Statement Draft

"{One-sentence mission based on WHY}"

---

## Next Steps

- [ ] Validate with CustomerDiscovery (Maya)
- [ ] Develop Positioning (Victor)
- [ ] Craft Brand Story (Sophia)
```

Speicherort: `${PAI_DIR}/history/brand-projects/{brand-slug}/phase-1/01-purpose-discovery.md`

---

## Transition Options

Nach PurposeDiscovery:

| Nächster Schritt | Workflow | Agent |
|------------------|----------|-------|
| Kunden verstehen | CustomerDiscovery | Maya |
| Positionierung | StrategicPositioning | Victor |
| Story entwickeln | BrandStory | Sophia |
