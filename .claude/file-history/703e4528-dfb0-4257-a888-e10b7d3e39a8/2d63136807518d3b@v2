---
name: ImageGeneratorNanoBananaPro
description: Generate professional business visuals using Google's Nano Banana Pro visual reasoning model. USE WHEN user wants diagrams, dashboards, infographics, architecture visualizations, flowcharts, org charts, data visualizations, pitch decks OR user says "create diagram", "visualize this", "make infographic", "generate dashboard", "architecture diagram" OR converting text/data into visual formats.
---

# ImageGeneratorNanoBananaPro

Generate professional business visuals using Nano Banana Pro - a visual reasoning system (not a diffusion model) optimized for structured outputs with accurate text rendering.

## Workflow Routing

**When executing a workflow, output this notification directly:**

```
Running the **WorkflowName** workflow from the **ImageGeneratorNanoBananaPro** skill...
```

| Workflow | Trigger | File |
|----------|---------|------|
| **Generate** | General image generation request | `workflows/Generate.md` |
| **Diagram** | "architecture diagram", "flowchart", "sequence diagram" | `workflows/Diagram.md` |
| **Dashboard** | "dashboard", "KPIs", "metrics visualization" | `workflows/Dashboard.md` |
| **Infographic** | "infographic", "data visualization", "visual summary" | `workflows/Infographic.md` |

## Examples

**Example 1: Architecture Diagram**
```
User: "Create an architecture diagram for our microservices"
→ Invokes Diagram workflow
→ Uses structured prompt (TASK/STYLE/LAYOUT/COMPONENTS/CONSTRAINTS)
→ Generates clean diagram with accurate labels
```

**Example 2: KPI Dashboard**
```
User: "Visualize our Q4 metrics"
→ Invokes Dashboard workflow
→ Applies BI aesthetic, KPI blocks, charts
→ Returns executive-ready visual
```

**Example 3: Data Infographic**
```
User: "Make an infographic from this research data"
→ Invokes Infographic workflow
→ Creates multi-chart visual summary
→ Optimizes for data storytelling
```

---

## Quick Start

### Prompt Structure (Always Use)

```
TASK: [What to create]
STYLE: [Visual aesthetic]
LAYOUT: [Spatial organization]
COMPONENTS: [Elements to include]
CONSTRAINTS: [Quality requirements]
SOURCE MATERIAL: [Input data/text]
INTERPRETATION: [Target audience optimization]
```

### Domain Selection

| Domain | Prompt Library Section |
|--------|----------------------|
| Product/PM | Section 1 (Prompts 1-3) |
| Engineering | Section 2 (Prompts 4-6) |
| Data/BI | Section 3 (Prompts 7-9) |
| Strategy/Executive | Section 4 (Prompts 10-12) |
| Design | Section 5 (Prompts 13-15) |
| Education | Section 6 (Prompts 16-18) |
| Marketing | Section 7 (Prompts 19-20) |
| Founders/Pitch | Section 8 (Prompts 21-23) |
| Research/ML | Section 9 (Prompts 24-25) |
| Operations/SOP | Section 10 (Prompts 26-27) |
| HR/People | Section 11 (Prompts 28-30) |

---

## Key Capabilities

- **Accurate text rendering** at small sizes
- **Structured diagrams** (architecture, flowcharts, org charts)
- **Data visualizations** (dashboards, KPIs, charts)
- **Multi-panel compositions** with consistent styling
- **Long, structured prompts** (not limited to short descriptions)

---

## Image Generation

**Model:** Nano Banana Pro (Gemini-based visual reasoning)

```bash
bun run ${PAI_DIR}/skills/ImageGeneratorNanoBananaPro/tools/GenerateImage.ts \
  --prompt "[STRUCTURED PROMPT]" \
  --output /path/to/output.png
```

**API Key:** `GOOGLE_API_KEY` in `${PAI_DIR}/.env`

---

## Reference Files

| Need | Reference File |
|------|----------------|
| Ready-to-use prompts by domain | `references/PromptLibrary.md` |
| Build custom prompts | `references/PromptingGuide.md` |
| Understand model capabilities | `references/SevenEngines.md` |
| Check if task is suitable | `references/Limitations.md` |
| API access setup | `references/ApiReference.md` |

---

## Critical Prompting Rules

1. **Always define layout explicitly** - "Left-to-right", "3x3 grid", "top-down hierarchy"
2. **Always include constraints** - "No overlapping labels", "sharp text at small sizes"
3. **Use structured input** - Lists, tables, CSV, hierarchies work best
4. **Specify components** - Icons, charts, callouts, arrows, labels

---

## When NOT to Use

- Pixel-perfect brand replication → Use Figma
- Scientific precision diagrams → Use CAD tools
- Multi-page documents → Generate pages separately
- Real-time dashboards → Use Tableau/Looker
- Photo-realistic images → Use Midjourney/DALL-E

**Full limitations:** `references/Limitations.md`
