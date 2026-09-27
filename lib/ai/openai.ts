import { InspectionRequest, InspectionResponse } from "./provider";

export async function inspectWithOpenAI(
  request: InspectionRequest,
  apiKey: string
): Promise<InspectionResponse> {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const systemPrompt = `You are a certified industrial wind turbine quality inspection AI.
Your sole job is to evaluate components against standard technical criteria.
Return ONLY valid JSON matching the exact schema requested without markdown code blocks.`;

  const userPrompt = `Wind Turbine Model:
${request.model}

Inspection:
${request.test}

Expected Condition:
${request.expectedCondition}

You are inspecting a wind turbine component using the provided image.
Evaluate ONLY the selected inspection requirement.
Determine whether the image satisfies the expected condition.

Respond with valid JSON containing:
{
  "result": "OK" | "NOT_OK" | "REVIEW",
  "confidence": <number between 0.50 and 0.99>,
  "conclusion": "<concise summary of finding>",
  "reason": "<if NOT_OK: explain what is wrong and what appears different. If REVIEW: explain why visual inspection cannot be confirmed. If OK: ''>",
  "whatShouldBe": "<if NOT_OK: describe what the component is supposed to look like according to the expected condition>"
}

Rules:
1. If the condition is met, return "OK".
2. If NOT_OK, clearly explain:
   - What is wrong.
   - What the component is supposed to look like.
   - What appears different in the image.
3. If the image is unclear, blurry, obstructed, poorly illuminated, or insufficient to determine the result, return "REVIEW".
4. Do not invent defects that cannot reasonably be observed.
5. "result" MUST be exactly one of: "OK", "NOT_OK", "REVIEW".`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: request.image,
                detail: "high"
              }
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error("No response content from OpenAI Vision");
  }

  const parsed = JSON.parse(rawContent);

  // Validate status
  let result: "OK" | "NOT_OK" | "REVIEW" = "REVIEW";
  if (parsed.result === "OK" || parsed.result === "NOT_OK" || parsed.result === "REVIEW") {
    result = parsed.result;
  }

  const confidence = typeof parsed.confidence === "number"
    ? Math.min(Math.max(parsed.confidence, 0.4), 0.99)
    : 0.92;

  return {
    result,
    confidence: Number(confidence.toFixed(2)),
    conclusion: parsed.conclusion || (result === "OK" ? "Component conforms to specification." : "Discrepancy detected."),
    reason: parsed.reason || "",
    whatShouldBe: parsed.whatShouldBe || "",
    isDemoMode: false,
    provider: "openai",
    modelUsed: model,
    timestamp: new Date().toISOString()
  };
}
