import { NextRequest, NextResponse } from "next/server";
import { runInspection, isLiveModeAvailable } from "@/lib/ai/provider";
import { getExpectedCondition } from "@/config/inspectionTests";

export async function GET() {
  return NextResponse.json({
    status: "ready",
    service: "Wind Turbine AI Visual Inspection Service",
    isLiveMode: isLiveModeAvailable()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { model, test, image, expectedCondition, imageName, demoScenario } = body;

    if (!model || typeof model !== "string") {
      return NextResponse.json(
        { error: "Wind turbine model is required." },
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
        { error: "Inspection image (base64 data URL or URL) is required." },
        { status: 400 }
      );
    }

    // Resolve expected condition if not provided
    const resolvedExpectedCondition =
      expectedCondition || getExpectedCondition(model, test);

    const result = await runInspection({
      model,
      test,
      image,
      expectedCondition: resolvedExpectedCondition,
      imageName,
      demoScenario
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("API /api/inspect error:", error);
    return NextResponse.json(
      {
        result: "REVIEW",
        confidence: 0.5,
        conclusion: "Inspection analysis could not be completed.",
        reason:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during inspection processing.",
        isDemoMode: !isLiveModeAvailable(),
        provider: "mock",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
