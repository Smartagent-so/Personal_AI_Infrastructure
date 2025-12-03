#!/usr/bin/env bun

/**
 * GenerateImage - Nano Banana Pro Image Generator CLI
 *
 * Generate professional business visuals (diagrams, dashboards, infographics)
 * using Google's Nano Banana Pro visual reasoning model.
 *
 * Optimized for structured prompts with accurate text rendering.
 *
 * Usage:
 *   GenerateImage --prompt "TASK: Create a diagram..." --output /tmp/diagram.png
 *
 * @see ${PAI_DIR}/skills/ImageGeneratorNanoBananaPro/SKILL.md
 */

import { GoogleGenAI } from "@google/genai";
import { writeFile, readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

// ============================================================================
// Environment Loading
// ============================================================================

/**
 * Load environment variables from ${PAI_DIR}/.env
 */
async function loadEnv(): Promise<void> {
  const envPath = resolve(process.env.HOME!, ".claude/.env");
  try {
    const envContent = await readFile(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // Silently continue if .env doesn't exist
  }
}

// ============================================================================
// Types
// ============================================================================

type AspectRatio =
  | "1:1"
  | "2:3"
  | "3:2"
  | "3:4"
  | "4:3"
  | "4:5"
  | "5:4"
  | "9:16"
  | "16:9"
  | "21:9";
type ImageSize = "1K" | "2K" | "4K";

interface CLIArgs {
  prompt: string;
  output: string;
  size: ImageSize;
  aspectRatio: AspectRatio;
  referenceImage?: string;
  variations?: number;
}

// ============================================================================
// Configuration
// ============================================================================

const DEFAULTS = {
  size: "2K" as ImageSize,
  aspectRatio: "16:9" as AspectRatio,
  output: "/tmp/business-visual.png",
};

const VALID_ASPECT_RATIOS: AspectRatio[] = [
  "1:1",
  "2:3",
  "3:2",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "9:16",
  "16:9",
  "21:9",
];
const VALID_SIZES: ImageSize[] = ["1K", "2K", "4K"];

// ============================================================================
// Error Handling
// ============================================================================

class CLIError extends Error {
  constructor(
    message: string,
    public exitCode: number = 1
  ) {
    super(message);
    this.name = "CLIError";
  }
}

function handleError(error: unknown): never {
  if (error instanceof CLIError) {
    console.error(`Error: ${error.message}`);
    process.exit(error.exitCode);
  }
  if (error instanceof Error) {
    console.error(`Unexpected error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
  console.error(`Unknown error:`, error);
  process.exit(1);
}

// ============================================================================
// Help Text
// ============================================================================

function showHelp(): void {
  console.log(`
GenerateImage - Nano Banana Pro Business Visual Generator

Generate professional business visuals using Google's Nano Banana Pro
visual reasoning model. Optimized for diagrams, dashboards, and infographics
with accurate text rendering.

USAGE:
  GenerateImage --prompt "<structured-prompt>" [OPTIONS]

REQUIRED:
  --prompt <text>      Structured prompt (TASK/STYLE/LAYOUT/COMPONENTS/CONSTRAINTS format)

OPTIONS:
  --size <size>              Resolution: 1K, 2K, 4K (default: 2K)
  --aspect-ratio <ratio>     Aspect ratio (default: 16:9)
                             Options: 1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9
  --output <path>            Output file path (default: /tmp/business-visual.png)
  --reference-image <path>   Reference image for style guidance
  --variations <n>           Generate N variations (1-5)
  --help, -h                 Show this help message

PROMPT STRUCTURE (Recommended):
  TASK: [What to create]
  STYLE: [Visual aesthetic]
  LAYOUT: [Spatial organization]
  COMPONENTS:
  - [Element 1]
  - [Element 2]
  CONSTRAINTS:
  - No overlapping labels
  - Sharp text at small sizes
  SOURCE MATERIAL:
  [Your data/text]
  INTERPRETATION: [Target audience]

EXAMPLES:
  # Architecture Diagram
  GenerateImage --prompt "TASK: Create cloud architecture diagram.
    STYLE: Modern cloud diagramming.
    LAYOUT: Three horizontal layers.
    COMPONENTS: AWS logos, service boxes, data flow arrows.
    CONSTRAINTS: No overlapping lines, sharp text.
    SOURCE MATERIAL: Frontend (React) -> API (Node) -> DB (PostgreSQL)" \\
    --size 2K --aspect-ratio 16:9 --output /tmp/architecture.png

  # KPI Dashboard
  GenerateImage --prompt "TASK: Build KPI dashboard.
    STYLE: Enterprise BI aesthetic.
    LAYOUT: Four-panel grid.
    COMPONENTS: KPI blocks, mini charts, color-coded deltas.
    CONSTRAINTS: Readable at small sizes.
    SOURCE MATERIAL: Revenue: $2.4M (+15%), Users: 45K (+8%)" \\
    --size 2K --output /tmp/dashboard.png

  # With Reference Image
  GenerateImage --prompt "..." --reference-image /tmp/style-ref.png --output /tmp/styled.png

ENVIRONMENT VARIABLES:
  GOOGLE_API_KEY       Required - Google AI API key for Nano Banana Pro

DOMAIN TEMPLATES:
  See references/PromptLibrary.md for 30 ready-to-use prompts:
  - Product/PM (1-3): Flows, Journeys, Comparisons
  - Engineering (4-6): Architecture, Sequence, Pipelines
  - Data/BI (7-9): Dashboards, Infographics, Summaries
  - Strategy (10-12): Frameworks, Roadmaps, Org Charts
  - And more...

ERROR CODES:
  0  Success
  1  General error

MORE INFO:
  Skill: \${PAI_DIR}/skills/ImageGeneratorNanoBananaPro/SKILL.md
`);
  process.exit(0);
}

// ============================================================================
// Argument Parsing
// ============================================================================

function parseArgs(argv: string[]): CLIArgs {
  const args = argv.slice(2);

  if (args.includes("--help") || args.includes("-h") || args.length === 0) {
    showHelp();
  }

  const parsed: Partial<CLIArgs> = {
    size: DEFAULTS.size,
    aspectRatio: DEFAULTS.aspectRatio,
    output: DEFAULTS.output,
  };

  for (let i = 0; i < args.length; i++) {
    const flag = args[i];

    if (!flag.startsWith("--")) {
      throw new CLIError(`Invalid flag: ${flag}. Flags must start with --`);
    }

    const key = flag.slice(2);
    const value = args[i + 1];

    if (!value || value.startsWith("--")) {
      throw new CLIError(`Missing value for flag: ${flag}`);
    }

    switch (key) {
      case "prompt":
        parsed.prompt = value;
        i++;
        break;
      case "size":
        if (!VALID_SIZES.includes(value as ImageSize)) {
          throw new CLIError(
            `Invalid size: ${value}. Must be: ${VALID_SIZES.join(", ")}`
          );
        }
        parsed.size = value as ImageSize;
        i++;
        break;
      case "aspect-ratio":
        if (!VALID_ASPECT_RATIOS.includes(value as AspectRatio)) {
          throw new CLIError(
            `Invalid aspect-ratio: ${value}. Must be: ${VALID_ASPECT_RATIOS.join(", ")}`
          );
        }
        parsed.aspectRatio = value as AspectRatio;
        i++;
        break;
      case "output":
        parsed.output = value;
        i++;
        break;
      case "reference-image":
        parsed.referenceImage = value;
        i++;
        break;
      case "variations":
        const variations = parseInt(value, 10);
        if (isNaN(variations) || variations < 1 || variations > 5) {
          throw new CLIError(
            `Invalid variations: ${value}. Must be 1-5`
          );
        }
        parsed.variations = variations;
        i++;
        break;
      default:
        throw new CLIError(`Unknown flag: ${flag}`);
    }
  }

  if (!parsed.prompt) {
    throw new CLIError("Missing required argument: --prompt");
  }

  return parsed as CLIArgs;
}

// ============================================================================
// Image Generation
// ============================================================================

async function generateImage(
  prompt: string,
  size: ImageSize,
  aspectRatio: AspectRatio,
  output: string,
  referenceImage?: string
): Promise<void> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new CLIError("Missing environment variable: GOOGLE_API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });

  if (referenceImage) {
    console.log(
      `Generating with Nano Banana Pro at ${size} ${aspectRatio} with reference...`
    );
  } else {
    console.log(`Generating with Nano Banana Pro at ${size} ${aspectRatio}...`);
  }

  // Prepare content parts
  const parts: Array<{
    text?: string;
    inlineData?: { mimeType: string; data: string };
  }> = [];

  // Add reference image if provided
  if (referenceImage) {
    const imageBuffer = await readFile(referenceImage);
    const imageBase64 = imageBuffer.toString("base64");

    const ext = extname(referenceImage).toLowerCase();
    let mimeType: string;
    switch (ext) {
      case ".png":
        mimeType = "image/png";
        break;
      case ".jpg":
      case ".jpeg":
        mimeType = "image/jpeg";
        break;
      case ".webp":
        mimeType = "image/webp";
        break;
      default:
        throw new CLIError(
          `Unsupported image format: ${ext}. Supported: .png, .jpg, .jpeg, .webp`
        );
    }

    parts.push({
      inlineData: {
        mimeType,
        data: imageBase64,
      },
    });
  }

  // Add text prompt
  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: [{ parts }],
    config: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: size,
      },
    },
  });

  // Extract image data from response
  let imageData: string | undefined;

  if (response.candidates && response.candidates.length > 0) {
    const responseParts = response.candidates[0].content.parts;
    for (const part of responseParts) {
      if (part.inlineData && part.inlineData.data) {
        imageData = part.inlineData.data;
        break;
      }
    }
  }

  if (!imageData) {
    throw new CLIError("No image data returned from Gemini API");
  }

  const imageBuffer = Buffer.from(imageData, "base64");
  await writeFile(output, imageBuffer);
  console.log(`Image saved to ${output}`);
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  try {
    await loadEnv();
    const args = parseArgs(process.argv);

    // Handle variations
    if (args.variations && args.variations > 1) {
      console.log(`Generating ${args.variations} variations...`);
      const basePath = args.output.replace(/\.png$/, "");
      const promises: Promise<void>[] = [];

      for (let i = 1; i <= args.variations; i++) {
        const varOutput = `${basePath}-v${i}.png`;
        promises.push(
          generateImage(
            args.prompt,
            args.size,
            args.aspectRatio,
            varOutput,
            args.referenceImage
          )
        );
      }

      await Promise.all(promises);
      console.log(`Generated ${args.variations} variations`);
      return;
    }

    // Single image generation
    await generateImage(
      args.prompt,
      args.size,
      args.aspectRatio,
      args.output,
      args.referenceImage
    );
  } catch (error) {
    handleError(error);
  }
}

main();
