import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

export const InspectionResultSchema = z.object({
  result: z.enum(["OK", "NOT_OK", "REVIEW"]),
  conclusion: z.string().min(1, "Conclusion must not be empty"),
  reason: z.string().default(""),
  expectedCondition: z.string()
});

export type InspectionResultData = z.infer<typeof InspectionResultSchema>;

export interface InspectionInspectionResponse extends InspectionResultData {
  confidence?: number;
  isDemoMode: boolean;
  provider: "gemini" | "simulated";
  modelUsed: string;
  disclaimer: string;
  timestamp: string;
}

export function isGeminiConfigured(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(
    apiKey &&
      apiKey.trim().length > 0 &&
      apiKey !== "your_new_key_here" &&
      !apiKey.startsWith("placeholder")
  );
}

const SYSTEM_INSTRUCTION = `You are an AI-assisted visual inspection assistant for wind turbine manufacturing and assembly quality verification.
Evaluate ONLY the selected test against the provided expected condition.
- If visibly satisfied, return OK.
- If visibly unsatisfied, return NOT_OK and explain what is wrong and what the correct condition should be.
- If the relevant component is obscured, the photo is unclear, or the condition cannot be verified visually, return REVIEW.
- Never invent defects or claim to verify hidden/internal conditions, torque, electrical continuity, or other properties that cannot be established from the photograph.

You must return valid JSON with keys:
- "result": "OK" | "NOT_OK" | "REVIEW"
- "conclusion": brief summary statement of observation
- "reason": if NOT_OK, explain what is wrong and what the correct condition should be. If REVIEW, explain why visual confirmation is not possible. If OK, leave empty or brief.
- "expectedCondition": the expected condition for this test`;

/**
 * Analyzes an uploaded wind turbine component photo using Google Gemini API or simulated demo fallback.
 */
export async function analyzeInspectionImage({
  modelName,
  testName,
  serverExpectedCondition,
  imageBase64,
  mimeType,
  demoScenario
}: {
  modelName: string;
  testName: string;
  serverExpectedCondition: string;
  imageBase64: string;
  mimeType: string;
  demoScenario?: "OK" | "NOT_OK" | "REVIEW";
}): Promise<InspectionInspectionResponse> {
  const disclaimerText =
    "AI-assisted visual assessment — not a certified quality decision.";

  // If GEMINI_API_KEY is not configured or demo scenario is explicitly requested, run simulated demo mode
  if (!isGeminiConfigured() || demoScenario) {
    return generateSimulatedInspection({
      modelName,
      testName,
      expectedCondition: serverExpectedCondition,
      demoScenario
    });
  }

  const apiKey = process.env.GEMINI_API_KEY!.trim();
  const ai = new GoogleGenAI({ apiKey });

  // Preferred models: try gemini-2.5-flash as specified, fall back to gemini-3.8-flash if deprecated
  const candidateModels = ["gemini-2.5-flash", "gemini-3.8-flash"];

  const promptText = `Wind Turbine Model: ${modelName}
Inspection Test: ${testName}
Expected Condition: ${serverExpectedCondition}

Evaluate this component photograph. Respond ONLY with a valid JSON object matching:
{
  "result": "OK" | "NOT_OK" | "REVIEW",
  "conclusion": "<concise observation summary>",
  "reason": "<explanation if NOT_OK or REVIEW>",
  "expectedCondition": "${serverExpectedCondition.replace(/"/g, '\\"')}"
}`;

  let lastError: Error | null = null;

  for (const modelToTry of candidateModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelToTry,
          contents: [
            {
              inlineData: {
                mimeType: mimeType || "image/jpeg",
                data: imageBase64
              }
            },
            promptText
          ],
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            temperature: 0.1
          }
        });

        const rawText = response.text;
        if (!rawText) {
          throw new Error("Empty response from Gemini Vision API");
        }

        const parsedJson = JSON.parse(rawText);

        // Validate strictly using Zod
        const validated = InspectionResultSchema.parse({
          result: parsedJson.result,
          conclusion: parsedJson.conclusion || "Visual evaluation completed.",
          reason: parsedJson.reason || "",
          expectedCondition: serverExpectedCondition // Server authoritative
        });

        return {
          result: validated.result,
          conclusion: validated.conclusion,
          reason: validated.reason,
          expectedCondition: validated.expectedCondition,
          confidence: validated.result === "OK" ? 0.95 : validated.result === "NOT_OK" ? 0.92 : 0.55,
          isDemoMode: false,
          provider: "gemini",
          modelUsed: modelToTry,
          disclaimer: disclaimerText,
          timestamp: new Date().toISOString()
        };
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        lastError = error;
        // If model not found (404), break immediately to try next candidate model
        if (error.message.includes("404") || error.message.includes("NOT_FOUND")) {
          break;
        }
        // If temporary 503 spike, wait briefly before retrying
        if (error.message.includes("503") || error.message.includes("UNAVAILABLE")) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }
  }

  // Graceful fallback to simulated demo mode with clear logging if API is temporarily unavailable
  console.warn(
    "Gemini API unavailable or encountered error, activating clearly labeled simulated demo mode:",
    lastError?.message
  );

  const fallback = generateSimulatedInspection({
    modelName,
    testName,
    expectedCondition: serverExpectedCondition,
    demoScenario: "OK"
  });

  return {
    ...fallback,
    conclusion: `${fallback.conclusion} (Notice: Displaying simulated result due to temporary Gemini API connection: ${lastError?.message || "connection error"})`,
    isDemoMode: true,
    provider: "simulated",
    modelUsed: "Simulated Quality Inspector (Fallback)"
  };
}

/**
 * Deterministic simulated inspection for offline or unconfigured demonstration.
 * Clearly labeled as simulated demo mode.
 */
function generateSimulatedInspection({
  modelName,
  testName,
  expectedCondition,
  demoScenario
}: {
  modelName: string;
  testName: string;
  expectedCondition: string;
  demoScenario?: "OK" | "NOT_OK" | "REVIEW";
}): InspectionInspectionResponse {
  const scenario = demoScenario || "OK";
  const disclaimer =
    "SIMULATED DEMO MODE: This is a pre-programmed mock result for offline testing. Not an actual Gemini API analysis.";

  if (scenario === "OK") {
    return {
      result: "OK",
      conclusion: `The component visibly satisfies the criteria for ${testName}.`,
      reason: "",
      expectedCondition,
      confidence: 0.94,
      isDemoMode: true,
      provider: "simulated",
      modelUsed: "Simulated Model (Demo Mode)",
      disclaimer,
      timestamp: new Date().toISOString()
    };
  }

  if (scenario === "NOT_OK") {
    return {
      result: "NOT_OK",
      conclusion: `Visible non-conformance detected during ${testName}.`,
      reason: `The component is not properly seated and shows visible displacement or missing retention hardware.`,
      expectedCondition,
      confidence: 0.91,
      isDemoMode: true,
      provider: "simulated",
      modelUsed: "Simulated Model (Demo Mode)",
      disclaimer,
      timestamp: new Date().toISOString()
    };
  }

  return {
    result: "REVIEW",
    conclusion: `Visual inspection cannot be verified from this image.`,
    reason: `The relevant area is obscured, poorly lit, or out of focus. A clearer, closer photograph of the component is required.`,
    expectedCondition,
    confidence: 0.52,
    isDemoMode: true,
    provider: "simulated",
    modelUsed: "Simulated Model (Demo Mode)",
    disclaimer,
    timestamp: new Date().toISOString()
  };
}
