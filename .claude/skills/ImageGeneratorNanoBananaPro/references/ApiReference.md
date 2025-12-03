# Nano Banana Pro API Reference

## Access Options

### Option 1: Google AI Studio (Recommended for Full Control)

**Setup:**
1. Go to https://aistudio.google.com
2. Sign in with Google Account
3. Click "Get API key" → "Create API key"
4. Store key securely

**Python Usage:**

```python
import google.generativeai as genai
from PIL import Image
import io

# Configure API
genai.configure(api_key="YOUR_API_KEY")

# Initialize model
model = genai.GenerativeModel('gemini-2.0-flash-exp')  # or latest image model

# Generate image
response = model.generate_content(
    """
    TASK: Create a product architecture diagram.
    STYLE: Modern cloud diagramming, clean lines.
    LAYOUT: Three horizontal layers (Frontend → API → Backend).
    COMPONENTS: Service boxes, data flow arrows, cloud logos.
    CONSTRAINTS: No overlapping lines, sharp text, equal spacing.
    SOURCE MATERIAL:
    - Frontend: React, Next.js
    - API: Node.js, Express
    - Backend: PostgreSQL, Redis
    INTERPRETATION: Optimize for engineering review.
    """,
    generation_config=genai.GenerationConfig(
        response_mime_type="image/png"
    )
)

# Save image
if response.candidates[0].content.parts[0].inline_data:
    image_data = response.candidates[0].content.parts[0].inline_data.data
    image = Image.open(io.BytesIO(image_data))
    image.save("architecture_diagram.png")
```

**Key Parameters:**

| Parameter | Description |
|-----------|-------------|
| `response_mime_type` | Set to `"image/png"` or `"image/jpeg"` |
| `temperature` | Lower (0.1-0.3) for consistency, higher for variation |
| `max_output_tokens` | Not typically needed for image generation |

---

### Option 2: Gemini Mobile App (Simple Access)

**Setup:**
1. Download Gemini app (iOS/Android)
2. Sign in with Google Account
3. Use "Create Image" tool

**Limitations:**
- Less granular control
- No programmatic access
- Cannot specify exact parameters

**Best for:** Quick tests, mobile use, non-technical users

---

## API Best Practices

### Prompt Formatting

Always use the structured format:

```python
prompt = """
TASK: [Description]

STYLE: [Aesthetic]

LAYOUT: [Spatial organization]

COMPONENTS:
- [Item 1]
- [Item 2]

CONSTRAINTS:
- [Constraint 1]
- [Constraint 2]

SOURCE MATERIAL:
[Your data/text here]

INTERPRETATION: [Target audience]
"""
```

### Error Handling

```python
try:
    response = model.generate_content(prompt, ...)

    if response.candidates:
        # Process successful response
        pass
    else:
        # Handle empty response
        print("No image generated. Check prompt.")

except google.api_core.exceptions.InvalidArgument as e:
    print(f"Invalid prompt: {e}")
except google.api_core.exceptions.ResourceExhausted as e:
    print(f"Rate limited: {e}")
except Exception as e:
    print(f"Error: {e}")
```

### Rate Limits

- Free tier: Limited requests per minute
- Paid tier: Higher limits, check Google AI pricing
- Implement exponential backoff for production use

---

## Integration Patterns

### Batch Generation

```python
import asyncio

async def generate_batch(prompts: list[str]):
    """Generate multiple images concurrently."""
    tasks = [generate_single(p) for p in prompts]
    return await asyncio.gather(*tasks)

async def generate_single(prompt: str):
    # Implementation
    pass
```

### With Claude Code

When using within Claude Code sessions:

1. User provides source material (PRD, data, specs)
2. Claude selects appropriate prompt template from library
3. Claude customizes prompt with user's content
4. Image generated via API
5. Result returned to user

---

## Model Versions

| Model ID | Description |
|----------|-------------|
| `gemini-2.0-flash-exp` | Latest experimental with image generation |
| Check Google AI docs | Models update frequently |

**Note:** Model availability changes. Check https://ai.google.dev for current options.

---

## Output Formats

| Format | Use Case |
|--------|----------|
| PNG | Default, best for diagrams with text |
| JPEG | Smaller file size, slight quality loss |

**Recommended:** PNG for all business visuals (preserves text sharpness)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blurry text | Add constraint: "All text must be sharp at small sizes" |
| Overlapping elements | Add constraint: "No overlapping lines/labels" |
| Wrong layout | Be more explicit: "Left-to-right" not "horizontal" |
| Missing components | List each component explicitly |
| Inconsistent style | Add more style keywords, reference specific aesthetics |
| Rate limited | Implement backoff, check quota |
