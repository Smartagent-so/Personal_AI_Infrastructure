# Dashboard Workflow

**Trigger:** "dashboard", "KPI visualization", "metrics display", "BI visual"

## Steps

1. **Identify Dashboard Type**
   - KPI Dashboard → Prompt 7 (Data/BI)
   - Multi-Chart Infographic → Prompt 8 (Data/BI)
   - Research Summary → Prompt 9 (Data/BI)
   - Hiring Funnel → Prompt 28 (HR)
   - Skills Heatmap → Prompt 29 (HR)

2. **Gather Metrics Data**
   - Request: Numbers, percentages, deltas, time series
   - Accept: CSV, tables, lists, or plain text with metrics

3. **Apply Dashboard Template**

   ### KPI Dashboard
   ```
   TASK: Build a KPI dashboard.
   STYLE: Enterprise BI aesthetic, cool tones, minimal gradients.
   LAYOUT: Four-panel grid (Revenue, Growth, Segments, Alerts).
   COMPONENTS:
   - KPI blocks with large numbers
   - Mini bar/line charts for trends
   - Icons for each metric category
   - Color-coded deltas (+green/-red)
   - Summary panel at bottom
   CONSTRAINTS:
   - Keep KPIs readable at small sizes
   - Align charts and legends
   - Avoid chart distortion
   - Consistent number formatting
   SOURCE MATERIAL:
   [User's metrics data]
   INTERPRETATION: Optimize for rapid executive scanning.
   ```

   ### Multi-Chart Infographic
   ```
   TASK: Produce a one-page infographic summarizing the data.
   STYLE: Corporate infographic with consistent iconography.
   LAYOUT: 2x3 grid with equal gutters.
   COMPONENTS:
   - Bar, line, pie, and scatter charts
   - Insight callout boxes
   - Color-coded legend
   - Summary paragraph
   - Data source attribution
   CONSTRAINTS:
   - No overlapping chart labels
   - Cohesive color palette
   - Balanced panel composition
   SOURCE MATERIAL:
   [User's data]
   INTERPRETATION: Optimize for data storytelling.
   ```

   ### Research Summary
   ```
   TASK: Summarize this research study as a visual one-pager.
   STYLE: Academic whitepaper aesthetic.
   LAYOUT: Overview → Method → Findings → Risks → Conclusion.
   COMPONENTS:
   - Diagram of methodology
   - 2-3 charts for key findings
   - Callout boxes for insights
   - Metric table
   CONSTRAINTS:
   - Avoid clutter
   - Keep labels readable
   - Maintain hierarchy
   SOURCE MATERIAL:
   [User's study data]
   INTERPRETATION: Optimize for research comprehension.
   ```

4. **Generate and Return**
   - Execute with structured prompt
   - Ensure metrics are accurately represented

## Input Format Best Practices

**Preferred:**
```
Q4 Performance:
- Revenue: $2.4M (+15% QoQ)
- Users: 45,000 (+8%)
- Churn: 3.2% (-0.5%)
- NPS: 72 (+5 points)
```

**Also works:**
```csv
Metric,Value,Change
Revenue,$2.4M,+15%
Users,45000,+8%
Churn,3.2%,-0.5%
```
