# The Seven Engines of Nano Banana Pro

Nano Banana Pro combines seven specialized engines into one visual reasoning system. Understanding these engines helps you craft better prompts.

---

## 1. Layout Engine — Structured Documents

**What it does:** Understands grids, margins, columns, and spatial hierarchy.

**Capabilities:**
- Creates one-pagers, dashboards, and magazine layouts
- Maintains consistent alignment across elements
- Handles multi-column and multi-panel compositions

**Prompt keywords:** grid, columns, margins, panels, gutters, alignment, spacing, hierarchy

**Example use:**
```
LAYOUT: 2x3 grid with equal gutters, header spanning full width
```

**Output types:** One-pagers, dashboards, editorial spreads, fact sheets

---

## 2. Diagram Engine — Structure to Diagrams

**What it does:** Converts structured specifications into clean diagrams.

**Capabilities:**
- Processes Graphviz specifications
- Handles nodes, edges, routing, swimlanes, grouping
- Knows architecture conventions and UX flow patterns
- Produces diagram-correct output (not just visually similar)

**Prompt keywords:** nodes, edges, swimlanes, clusters, routing, flow, arrows, connections

**Example use:**
```
LAYOUT: Left-to-right flow with three swimlanes:
- User Actions
- System Processes
- Data Flows
```

**Output types:** Architecture diagrams, flowcharts, sequence diagrams, org charts, data pipelines

---

## 3. Typography Engine — Text as Design Element

**What it does:** Renders sharp, readable text at any size.

**Capabilities:**
- Sharp text even at small sizes
- Multi-line paragraphs and labels
- Works for diagram labels, annotations, sticky notes
- Text is a first-class design element

**Prompt keywords:** labels, annotations, captions, headlines, body text, callouts

**Constraint to include:**
```
CONSTRAINTS:
- All text must be sharp at small sizes
- No label collisions
```

**Why this matters:** Previous models struggled with readable text. This engine makes text-heavy visuals possible.

---

## 4. Data Visualization Engine — Numbers to Charts

**What it does:** Generates BI-quality visualizations from data.

**Capabilities:**
- KPI blocks, bar/line/pie charts, legends
- Understands chart grammar and data-to-visual mapping
- Creates executive dashboards and earnings infographics
- Eliminates the analyst + designer workflow

**Prompt keywords:** KPIs, charts, metrics, deltas, trends, legends, data tables

**Example use:**
```
COMPONENTS:
- KPI blocks with color-coded deltas
- Mini bar charts for trends
- Pie chart for segment breakdown
- Summary metrics panel
```

**Output types:** KPI dashboards, financial infographics, performance reports, analytics summaries

---

## 5. Style Universe Engine — Consistent Visuals

**What it does:** Maintains consistent style across multi-panel compositions.

**Capabilities:**
- Consistent aesthetic over 8+ storyboard panels
- Creates themed worlds: LEGO, blueprint, retro sci-fi, mechanical cutaway
- Maintains lighting, color, and treatment consistency

**Prompt keywords:** style consistency, aesthetic, theme, panels, storyboard, series

**Example use:**
```
STYLE: LEGO brick aesthetic with consistent lighting
LAYOUT: Four-panel storyboard
```

**Output types:** Storyboards, multi-panel narratives, style explorations, lookbooks

---

## 6. Brand & Identity Engine — Visual Grammar

**What it does:** Recognizes and applies brand elements.

**Capabilities:**
- Applies brand color palettes
- Maintains logo proportions
- Creates brand-consistent materials
- Follows visual identity guidelines

**Prompt keywords:** brand colors, palette, logo, identity, brand guidelines

**Constraint to include:**
```
CONSTRAINTS:
- Maintain brand color palette
- Preserve logo proportions
- Follow brand typography
```

**Output types:** Brand materials, marketing assets, pitch decks, social graphics

---

## 7. Representation Transformer Engine — The Breakthrough

**What it does:** Renders the same concept in multiple visual representations.

**This is revolutionary:** The same concept can be output as:
- Blueprint
- Infographic
- Magazine spread
- Storyboard
- LEGO scenery
- Mechanical cutaway

All representations maintain semantic integrity. **Representation becomes a parameter.**

**Example use:**
```
TASK: Render this concept in four styles:
1) Minimalist vector
2) Retro sci-fi
3) Blueprint
4) LEGO

LAYOUT: Four quadrants, same concept in each style
```

**Why this matters:** You can explore how information looks in different formats without recreating from scratch.

---

## Engine Activation by Prompt Type

| Visual Type | Primary Engines |
|-------------|-----------------|
| Architecture Diagram | Diagram + Typography + Layout |
| KPI Dashboard | Data Viz + Layout + Typography |
| Infographic | Layout + Data Viz + Typography + Style |
| Storyboard | Style Universe + Layout + Typography |
| Brand Materials | Brand + Layout + Typography |
| Multi-Style Exploration | Representation Transformer + Style |
| Mechanical Explainer | Representation Transformer + Typography |

---

## Combining Engines Effectively

**For maximum quality, activate multiple engines:**

```
TASK: Create a product architecture diagram
[Activates: Diagram Engine]

STYLE: Modern cloud diagramming, enterprise aesthetic
[Activates: Style Universe Engine]

LAYOUT: Three-tier horizontal layers
[Activates: Layout Engine]

COMPONENTS:
- Cloud provider logos (AWS)
- Service boxes with labels
- Data flow arrows
[Activates: Diagram + Typography Engines]

CONSTRAINTS:
- Preserve logo proportions
- All labels sharp at small sizes
[Activates: Brand + Typography Engines]
```

This prompt activates 5 of 7 engines for a high-quality result.
