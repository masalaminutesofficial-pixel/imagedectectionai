import { InspectionRequest, InspectionResponse } from "./provider";

export async function inspectWithMock(
  request: InspectionRequest
): Promise<InspectionResponse> {
  // Simulate industrial edge processing / model inference delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const imageNameLower = (request.imageName || "").toLowerCase();
  const testLower = request.test.toLowerCase();
  const explicitScenario = request.demoScenario;

  // 1. Check for explicit demo scenario
  if (explicitScenario) {
    return generateScenarioResponse(request, explicitScenario);
  }

  // 2. Check for filename hints in demo sample images
  if (
    imageNameLower.includes("not_ok") ||
    imageNameLower.includes("fail") ||
    imageNameLower.includes("defect") ||
    imageNameLower.includes("disconnected") ||
    imageNameLower.includes("missing")
  ) {
    return generateScenarioResponse(request, "NOT_OK");
  }

  if (
    imageNameLower.includes("review") ||
    imageNameLower.includes("blur") ||
    imageNameLower.includes("unclear") ||
    imageNameLower.includes("dark")
  ) {
    return generateScenarioResponse(request, "REVIEW");
  }

  if (imageNameLower.includes("ok") || imageNameLower.includes("pass")) {
    return generateScenarioResponse(request, "OK");
  }

  // 3. Realistic heuristic based on test type for random user images
  if (testLower.includes("cable")) {
    return {
      result: "OK",
      confidence: 0.94,
      conclusion: "The cable appears properly connected to the designated terminal.",
      reason: "",
      whatShouldBe:
        "The cable must be properly connected to the designated terminal. The connector should be fully inserted and securely positioned.",
      isDemoMode: true,
      provider: "mock",
      modelUsed: "WindTurbine-EdgeVision-v2.4 (Simulated)",
      timestamp: new Date().toISOString()
    };
  }

  if (testLower.includes("bolt")) {
    return {
      result: "OK",
      confidence: 0.96,
      conclusion: "All required bolts are installed in their designated positions and seated correctly.",
      reason: "",
      whatShouldBe:
        "All required bolts must be installed in their designated positions and appear properly seated.",
      isDemoMode: true,
      provider: "mock",
      modelUsed: "WindTurbine-EdgeVision-v2.4 (Simulated)",
      timestamp: new Date().toISOString()
    };
  }

  if (testLower.includes("cover")) {
    return {
      result: "OK",
      confidence: 0.92,
      conclusion: "The protective enclosure cover is fully seated and securely positioned.",
      reason: "",
      whatShouldBe:
        "The required cover must be installed correctly, fully seated, and securely positioned.",
      isDemoMode: true,
      provider: "mock",
      modelUsed: "WindTurbine-EdgeVision-v2.4 (Simulated)",
      timestamp: new Date().toISOString()
    };
  }

  // Default OK response for generic tests
  return {
    result: "OK",
    confidence: 0.93,
    conclusion: `Visual inspection verifies compliance with ${request.model} ${request.test} standard.`,
    reason: "",
    whatShouldBe: request.expectedCondition,
    isDemoMode: true,
    provider: "mock",
    modelUsed: "WindTurbine-EdgeVision-v2.4 (Simulated)",
    timestamp: new Date().toISOString()
  };
}

function generateScenarioResponse(
  request: InspectionRequest,
  scenario: "OK" | "NOT_OK" | "REVIEW"
): InspectionResponse {
  const testLower = request.test.toLowerCase();

  if (scenario === "OK") {
    if (testLower.includes("cable")) {
      return {
        result: "OK",
        confidence: 0.94,
        conclusion: "The cable appears properly connected to the designated terminal.",
        reason: "",
        whatShouldBe:
          "The cable must be properly connected to the designated terminal. The connector should be fully inserted and securely positioned.",
        isDemoMode: true,
        provider: "mock",
        modelUsed: "WindTurbine-EdgeVision-v2.4 (Simulated)",
        timestamp: new Date().toISOString()
      };
    }

    if (testLower.includes("bolt")) {
      return {
        result: "OK",
        confidence: 0.96,
        conclusion: "All required flange bolts are verified present and properly torqued with witness marks aligned.",
        reason: "",
        whatShouldBe:
          "All required bolts must be installed in their designated positions and appear properly seated.",
        isDemoMode: true,
        provider: "mock",
        modelUsed: "WindTurbine-EdgeVision-v2.4 (Simulated)",
        timestamp: new Date().toISOString()
      };
    }

    if (testLower.includes("label")) {
      return {
        result: "OK",
        confidence: 0.97,
        conclusion: "Safety warning decals and phase identification tags are present, legible, and properly affixed.",
        reason: "",
        whatShouldBe:
          "Safety warning, phase identification, and component part number labels must be present, legible, and correctly positioned.",
        isDemoMode: true,
        provider: "mock",
        modelUsed: "WindTurbine-EdgeVision-v2.4 (Simulated)",
        timestamp: new Date().toISOString()
      };
    }

    return {
      result: "OK",
      confidence: 0.95,
      conclusion: `The component meets all visual criteria for ${request.test}.`,
      reason: "",
      whatShouldBe: request.expectedCondition,
      isDemoMode: true,
      provider: "mock",
      modelUsed: "WindTurbine-EdgeVision-v2.4 (Simulated)",
      timestamp: new Date().toISOString()
    };
  }

  if (scenario === "NOT_OK") {
    if (testLower.includes("cable")) {
      return {
        result: "NOT_OK",
        confidence: 0.91,
        conclusion: "The cable is not properly connected.",
        reason:
          "The connector appears partially disconnected from the terminal. The secondary safety locking clamp is disengaged and pin seating is incomplete.",
        whatShouldBe:
          "The cable should be fully inserted and securely connected to the designated terminal with secondary retention clip closed.",
        isDemoMode: true,
        provider: "mock",
        modelUsed: "WindTurbine-EdgeVision-v2.4 (Simulated)",
        timestamp: new Date().toISOString()
      };
    }

    if (testLower.includes("bolt")) {
      return {
        result: "NOT_OK",
        confidence: 0.93,
        conclusion: "Missing and unseated fastening hardware detected on bracket.",
        reason:
          "Position #3 mounting bolt is missing from the bracket flange, and position #4 shows insufficient thread engagement.",
        whatShouldBe:
          "All required bolts must be installed in their designated positions, tightened to specified torque, and properly seated.",
        isDemoMode: true,
        provider: "mock",
        modelUsed: "WindTurbine-EdgeVision-v2.4 (Simulated)",
        timestamp: new Date().toISOString()
      };
    }

    if (testLower.includes("cover")) {
      return {
        result: "NOT_OK",
        confidence: 0.89,
        conclusion: "Protective cover is misaligned with an unlatched seal gap.",
        reason:
          "The enclosure cover is not fully seated on the bottom flange. A visible 12mm gap exists allowing moisture and dust ingress.",
        whatShouldBe:
          "The required protective cover must be installed flush, fully seated, and securely fastened on all latches.",
        isDemoMode: true,
        provider: "mock",
        modelUsed: "WindTurbine-EdgeVision-v2.4 (Simulated)",
        timestamp: new Date().toISOString()
      };
    }

    if (testLower.includes("label")) {
      return {
        result: "NOT_OK",
        confidence: 0.95,
        conclusion: "Mandatory hazard warning decal is missing or illegible.",
        reason:
          "High Voltage arc-flash warning label is missing from the terminal junction access panel.",
        whatShouldBe:
          "Safety warning, phase identification, and component part number labels must be present, legible, and correctly positioned.",
        isDemoMode: true,
        provider: "mock",
        modelUsed: "WindTurbine-EdgeVision-v2.4 (Simulated)",
        timestamp: new Date().toISOString()
      };
    }

    return {
      result: "NOT_OK",
      confidence: 0.90,
      conclusion: "Non-conformance detected during visual inspection.",
      reason:
        "The component assembly shows visible physical deviation and does not satisfy the installation tolerance.",
      whatShouldBe: request.expectedCondition,
      isDemoMode: true,
      provider: "mock",
      modelUsed: "WindTurbine-EdgeVision-v2.4 (Simulated)",
      timestamp: new Date().toISOString()
    };
  }

  // REVIEW scenario
  return {
    result: "REVIEW",
    confidence: 0.52,
    conclusion: "The inspection cannot be confirmed from this image.",
    reason:
      "The connection and seating area is partially obscured by glare or motion blur, and the component position cannot be determined reliably.",
    whatShouldBe: request.expectedCondition,
    isDemoMode: true,
    provider: "mock",
    modelUsed: "WindTurbine-EdgeVision-v2.4 (Simulated)",
    timestamp: new Date().toISOString()
  };
}
