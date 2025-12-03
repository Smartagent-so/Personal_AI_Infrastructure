# Diagram Workflow

**Trigger:** "architecture diagram", "flowchart", "sequence diagram", "org chart", "data pipeline"

## Steps

1. **Identify Diagram Type**
   - Architecture Diagram → Prompt 4 (Engineering)
   - Sequence Diagram → Prompt 5 (Engineering)
   - Data Pipeline → Prompt 6 (Engineering)
   - Org Chart → Prompt 12 (Strategy)
   - Product Flow → Prompt 1 (Product/PM)
   - User Journey → Prompt 2 (Product/PM)

2. **Gather Source Material**
   - Request architecture description, system components, or org data
   - Accept: Lists, hierarchies, Graphviz specs, or plain text

3. **Apply Diagram Template**

   ### Architecture Diagram
   ```
   TASK: Generate a cloud architecture diagram from this description.
   STYLE: Modern cloud diagramming conventions.
   LAYOUT: Layered architecture (Frontend → API → Services → Data → Infra).
   COMPONENTS:
   - Cloud provider logos (AWS/GCP/Azure)
   - Compute clusters, DB nodes, cache layers
   - API gateways
   - Data-flow arrows with direction
   CONSTRAINTS:
   - No overlapping lines
   - Keep equal spacing between layers
   - Logo proportions must be preserved
   SOURCE MATERIAL:
   [User's architecture description]
   INTERPRETATION: Optimize for architecture review readability.
   ```

   ### Sequence Diagram
   ```
   TASK: Create a system sequence diagram.
   STYLE: UML-like but modernized; clean sans-serif labels.
   LAYOUT: Horizontal actors → vertical timelines → message arrows.
   COMPONENTS:
   - Actor icons
   - Sequence arrows with labels
   - Activation bars
   - Error paths
   CONSTRAINTS:
   - Maintain UML sequence correctness
   - Even vertical spacing
   - No label collisions
   SOURCE MATERIAL:
   [User's sequence text]
   INTERPRETATION: Optimize for engineering onboarding.
   ```

   ### Data Pipeline
   ```
   TASK: Visualize the data pipeline.
   STYLE: Technical schematic with clear transformations.
   LAYOUT: Left-to-right: Ingestion → Processing → Storage → Analytics.
   COMPONENTS:
   - Connectors and nodes
   - Icons for batch/streaming
   - Labels for transforms
   - Metrics (latency, throughput)
   CONSTRAINTS:
   - No ambiguous connections
   - All labels sharp
   - Consistent icon style
   SOURCE MATERIAL:
   [User's pipeline details]
   INTERPRETATION: Optimize for data engineering clarity.
   ```

4. **Generate and Return**
   - Execute GenerateImage.ts with structured prompt
   - Display result and offer iterations

## Best Practices

- **Always specify layout direction** (left-to-right, top-down, etc.)
- **List all components explicitly** (logos, boxes, arrows)
- **Include routing constraints** (no overlapping lines)
- **Provide structured input** (hierarchies work best)
