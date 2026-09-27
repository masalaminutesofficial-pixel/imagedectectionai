import { NextRequest, NextResponse } from "next/server";
import { analyzeInspectionImage, isGeminiConfigured } from "@/lib/gemini";
import { getServerExpectedCondition } from "@/config/inspection-tests";

export async function GET() {
  return NextResponse.json({
    status: "ready",
    service: "Wind Turbine AI Visual Inspection API (Gemini)",
    isLiveMode: isGeminiConfigured()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { model, test, image, demoScenario } = body;

    if (!model || typeof model !== "string") {
      return NextResponse.json(
        { error: "Turbine model selection is required." },
        { status: 400 }
      );
    }

    if (!test || typeof test !== "string") {
      return NextResponse.json(
        { error: "Inspection test selection is required." },
        { status: 400 }
      );
    }

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "Photograph upload or capture is required." },
        { status: 400 }
      );
    }

    // Size check: Base64 string length should not exceed ~12MB (representing ~9MB image file)
    if (image.length > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image file exceeds maximum allowable size (10 MB). Please upload a smaller image." },
        { status: 413 }
      );
    }

    // Extract MIME type and pure base64 data
    let mimeType = "image/jpeg";
    let pureBase64 = image;

    if (image.startsWith("data:")) {
      const match = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        pureBase64 = match[2];
      } else {
        // SVG or unencoded data URL fallback
        const svgMatch = image.match(/^data:image\/svg\+xml;utf8,(.+)$/);
        if (svgMatch) {
          mimeType = "image/svg+xml";
          pureBase64 = Buffer.from(decodeURIComponent(svgMatch[1])).toString("base64");
        }
      }
    }

    // Server-authoritative expected condition. NEVER trust client-supplied condition.
    const serverExpectedCondition = getServerExpectedCondition(model, test);

    // Perform analysis with Gemini (or simulated demo if requested/unconfigured)
    const result = await analyzeInspectionImage({
      modelName: model,
      testName: test,
      serverExpectedCondition,
      imageBase64: pureBase64,
      mimeType,
      demoScenario
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("API /api/inspect error:", error);
    return NextResponse.json(
      {
        result: "REVIEW",
        conclusion: "Visual inspection could not be processed.",
        reason:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during visual inspection analysis.",
        expectedCondition: "Component must satisfy manufacturer QA specifications.",
        confidence: 0.5,
        isDemoMode: true,
        provider: "simulated",
        modelUsed: "Error Fallback",
        disclaimer: "AI-assisted visual assessment — not a certified quality decision.",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
