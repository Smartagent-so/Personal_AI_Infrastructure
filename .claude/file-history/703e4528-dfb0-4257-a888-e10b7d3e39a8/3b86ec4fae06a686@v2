# Generate Workflow

**Trigger:** General image generation, "create visual", "generate image"

## Steps

1. **Analyze Request**
   - Identify domain (Product, Engineering, Data, Strategy, Design, etc.)
   - Determine output type (diagram, dashboard, infographic, etc.)
   - Check if ready-to-use prompt exists in PromptLibrary.md

2. **Build Structured Prompt**
   ```
   TASK: [What to create]
   STYLE: [Visual aesthetic]
   LAYOUT: [Spatial organization]
   COMPONENTS:
   - [Element 1]
   - [Element 2]
   CONSTRAINTS:
   - No overlapping labels
   - All text sharp at small sizes
   - Even spacing between elements
   SOURCE MATERIAL:
   [User's input data/text]
   INTERPRETATION: [Target audience]
   ```

3. **Generate Image**
   ```bash
   bun run ${PAI_DIR}/skills/ImageGeneratorNanoBananaPro/tools/GenerateImage.ts \
     --prompt "[STRUCTURED PROMPT]" \
     --output /path/to/output.png
   ```

4. **Return Result**
   - Show generated image path
   - Offer refinement if needed

## Quick Domain Selection

| Domain | Key Components |
|--------|---------------|
| Product/PM | Swimlanes, decision diamonds, screen mocks |
| Engineering | Cloud logos, service boxes, API gateways |
| Data/BI | KPI blocks, charts, legends, trend indicators |
| Strategy | Pillars, timelines, milestones |
| Design | Color palettes, typography, style variations |

## Example

**User:** "Create a visual showing our user onboarding flow"

**Generated Prompt:**
```
TASK: Create a user onboarding flow diagram.
STYLE: Modern product design, rounded boxes, light neutral colors.
LAYOUT: Left-to-right horizontal flow with 5 stages.
COMPONENTS:
- Step boxes with titles
- Progress indicators
- Decision diamonds for conditional paths
- Icons for each stage
- Completion metrics panel
CONSTRAINTS:
- No overlapping arrows
- All text sharp at small sizes
- Consistent box sizes
- Clear flow direction
SOURCE MATERIAL:
[User's onboarding steps]
INTERPRETATION: Optimize for product team review.
```
