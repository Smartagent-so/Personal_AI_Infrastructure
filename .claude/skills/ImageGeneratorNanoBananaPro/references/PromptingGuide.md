# Nano Banana Pro Prompting Guide

## The 6 Core Principles

Nano Banana Pro works best with **longer, structured prompts**. Follow these principles for optimal results.

---

## Principle 1: Define the Work Surface Explicitly

The model needs to know exactly what type of visual artifact to create.

**Bad:**
```
Make a diagram of this.
```

**Good:**
```
Create a left-to-right architecture diagram with grouped clusters,
swimlanes, labeled nodes, and consistent spacing.
```

### Work Surface Types

| Surface | Examples |
|---------|----------|
| Designed Document | Editorial spreads, one-pagers, research summaries, investor fact sheets |
| Diagrammatic | UX flows, architecture diagrams, org charts, data pipelines |
| Analytical/BI | KPI boards, dashboards, multi-chart infographics |
| Brand & Storytelling | Launch graphics, lookbooks, messaging boards, social carousels |
| Educational | Mechanical metaphors, cutaways, step-by-step explainers, timelines |
| Multi-Representation | Blueprint, infographic, storyboard variations of same concept |

---

## Principle 2: Use Component Lists

Component lists activate multiple engines simultaneously. Always specify what elements to include.

```
COMPONENTS:
- KPI blocks
- Mini bar/pie charts
- Icons
- Color-coded deltas
- Summary panel
```

### Common Components by Domain

**Diagrams:** Nodes, edges, swimlanes, decision diamonds, arrows, labels
**Dashboards:** KPI blocks, charts, legends, trend indicators, alerts
**Infographics:** Icons, callout boxes, data tables, summary panels
**Architecture:** Cloud logos, service boxes, API gateways, data flows

---

## Principle 3: Use Constraints

Constraints dramatically improve output consistency. The model respects these well.

```
CONSTRAINTS:
- No overlapping labels
- All text must be sharp at small sizes
- Even spacing between nodes
- Preserve logo proportions
```

### Essential Constraints Checklist

- [ ] Label collision prevention
- [ ] Text sharpness requirement
- [ ] Spacing consistency
- [ ] Logo/icon proportions
- [ ] Arrow/line routing rules
- [ ] Color palette adherence

---

## Principle 4: Feed Structured Input

The model excels with structured data. Provide input in these formats:

### Preferred Input Formats

1. **Lists and Tables**
```
Features:
- Authentication: OAuth 2.0, MFA support
- Storage: S3, CloudFront CDN
- Database: PostgreSQL, Redis cache
```

2. **Hierarchies**
```
Organization:
├── Engineering
│   ├── Frontend Team
│   └── Backend Team
├── Product
└── Design
```

3. **Metrics**
```
Q4 Performance:
- Revenue: $2.4M (+15% QoQ)
- Users: 45,000 (+8%)
- Churn: 3.2% (-0.5%)
```

4. **Graphviz Specs**
```
digraph G {
  A -> B -> C;
  B -> D;
}
```

5. **CSV Data**
```
Month,Revenue,Users
Jan,120000,5000
Feb,135000,5500
Mar,142000,6200
```

---

## Principle 5: Use WHAT / HOW / WHY Structure

Structure every prompt with these three blocks:

```
TASK: [WHAT - Task definition]
Define exactly what visual artifact to create.

STYLE: [HOW - Style + Layout + Components + Constraints]
Specify the visual treatment, spatial organization,
elements to include, and quality requirements.

INTERPRETATION: [WHY - Intended audience]
Describe who will view this and what they need to understand.
```

---

## Principle 6: Include Source Material

Always provide the raw data or text to visualize. The model transforms structured input into visuals.

```
SOURCE MATERIAL:
[Paste your PRD, CSV, architecture spec, strategy memo,
org chart data, or any structured content here]
```

---

## Complete Prompt Template

```
TASK: [Describe the visual artifact to create]

STYLE: [Visual aesthetic - e.g., "Modern cloud diagramming",
"McKinsey-style strategy diagram", "Enterprise BI aesthetic"]

LAYOUT: [Spatial organization - e.g., "Left-to-right flow",
"3x3 grid", "Top-down hierarchy with 4 levels"]

COMPONENTS:
- [Component 1]
- [Component 2]
- [Component 3]
- [Component 4]

CONSTRAINTS:
- [Constraint 1 - e.g., "No overlapping connection lines"]
- [Constraint 2 - e.g., "All text sharp at small sizes"]
- [Constraint 3 - e.g., "Equal spacing between elements"]
- [Constraint 4 - e.g., "Logo proportions preserved"]

SOURCE MATERIAL:
[Paste structured input: lists, tables, CSV, hierarchies, specs]

INTERPRETATION: [Target audience and optimization goal -
e.g., "Optimize for executive scanning",
"Optimize for engineering review"]
```

---

## Common Prompting Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Under-specifying layout | "Make it look good" | Specify exact layout: "3x3 grid with equal gutters" |
| Forgetting constraints | Output varies wildly | Add 3-5 specific constraints |
| Vague style definition | "Clean modern style" | Be specific: "Enterprise BI aesthetic, cool tones, minimal gradients" |
| No structured input | Model guesses structure | Provide CSV, lists, or hierarchies |
| Too short prompts | Missed potential | Nano Banana Pro handles long, detailed prompts well |

---

## Style Vocabulary

Use these terms for precise style definition:

**Aesthetics:** Corporate, editorial, academic, startup, enterprise, minimal, bold
**Tones:** Cool, warm, neutral, monochrome, vibrant
**Treatments:** Gradient, flat, shadowed, outlined, filled
**Typography:** Sans-serif, serif, monospace, display
**Density:** Spacious, compact, balanced, airy, dense
