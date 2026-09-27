import { inspectWithOpenAI } from "./openai";
import { inspectWithMock } from "./mock";

export type InspectionStatus = "OK" | "NOT_OK" | "REVIEW";

export interface InspectionRequest {
  model: string;
  test: string;
  image: string; // base64 data URL or URL
  expectedCondition: string;
  imageName?: string;
  demoScenario?: InspectionStatus;
}

export interface InspectionResponse {
  result: InspectionStatus;
  confidence: number;
  conclusion: string;
  reason?: string;
  whatShouldBe?: string;
  isDemoMode: boolean;
  provider: "openai" | "mock";
  modelUsed?: string;
  timestamp: string;
}

/**
 * Universal inspection provider.
 * Routes to OpenAI Vision API when OPENAI_API_KEY is present,
 * or gracefully falls back to the deterministic mock provider.
 */
export async function runInspection(
  request: InspectionRequest
): Promise<InspectionResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey.trim().length > 0 && !apiKey.startsWith("sk-placeholder")) {
    try {
      return await inspectWithOpenAI(request, apiKey);
    } catch (error) {
      console.warn(
        "OpenAI API call failed, falling back to Mock Inspection Provider:",
        error instanceof Error ? error.message : error
      );
      // Fallback to mock with error note
      const fallback = await inspectWithMock(request);
      return {
        ...fallback,
        reason: fallback.reason
          ? `${fallback.reason} (Notice: Switched to Demo Mode due to upstream API error)`
          : undefined
      };
    }
  }

  // Demo mode
  return await inspectWithMock(request);
}

export function isLiveModeAvailable(): boolean {
  const apiKey = process.env.OPENAI_API_KEY;
  return Boolean(apiKey && apiKey.trim().length > 0 && !apiKey.startsWith("sk-placeholder"));
}
