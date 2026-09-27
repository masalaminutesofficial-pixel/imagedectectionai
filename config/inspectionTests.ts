export interface InspectionTestConfig {
  id: string;
  name: string;
  category: string;
  expectedCondition: string;
  description: string;
}

export interface TurbineModelConfig {
  id: string;
  name: string;
  series: string;
  rating: string;
  rotorDiameter: string;
  description: string;
  tests: InspectionTestConfig[];
}

export const TURBINE_MODELS: TurbineModelConfig[] = [
  {
    id: "S175",
    name: "S175",
    series: "3.15 MW Series",
    rating: "3.15 MW",
    rotorDiameter: "175 m",
    description: "Wind turbine model S175 - 175m rotor diameter utility-scale onshore platform.",
    tests: [
      {
        id: "cable-check",
        name: "Cable Connection Check",
        category: "Electrical",
        expectedCondition:
          "The cable must be properly connected to the designated terminal. The connector should be fully inserted and securely positioned with locking clips engaged.",
        description: "Verify main busbar & power cable terminal insertion, latching, and cable gland tightness."
      },
      {
        id: "bolt-check",
        name: "Bolt Installation Check",
        category: "Mechanical",
        expectedCondition:
          "All required bolts must be installed in their designated positions, properly torqued, and appear fully seated with visible torque seal marks aligned.",
        description: "Inspect flange, hub, and bracket bolt assemblies for completeness, seating, and torque witness marks."
      },
      {
        id: "assembly-check",
        name: "Component Assembly Check",
        category: "Assembly",
        expectedCondition:
          "All components must be mounted in their designated brackets, aligned properly without tilt or deformation, with no missing fasteners or loose hardware.",
        description: "Confirm physical sub-assembly alignment, structural bracket mounting, and hardware seating."
      },
      {
        id: "label-check",
        name: "Label Check",
        category: "Compliance",
        expectedCondition:
          "Safety warning, phase identification, and component part number labels must be present, legible, correctly positioned, and free from peeling or damage.",
        description: "Check for required regulatory, warning, and wire identification tags and serialization labels."
      },
      {
        id: "cover-check",
        name: "Cover Installation Check",
        category: "Enclosure",
        expectedCondition:
          "The required protective cover or shroud must be installed correctly, fully seated, securely positioned, and fastened with all latches or bolts engaged.",
        description: "Ensure electrical cabinet, nacelle hatch, or terminal box protective covers are flush and secured."
      },
      {
        id: "general-visual",
        name: "General Visual Inspection",
        category: "Quality Assurance",
        expectedCondition:
          "The inspection area must be clean, free of foreign object debris (FOD), oil leaks, surface corrosion, physical scratches, or cracked components.",
        description: "Comprehensive visual scan of the turbine component for cleanliness, structural integrity, and no contamination."
      }
    ]
  },
  {
    id: "S144",
    name: "S144",
    series: "3.15 MW Series",
    rating: "3.15 MW",
    rotorDiameter: "144 m",
    description: "Wind turbine model S144 - High yield, low wind site specialist with optimized nacelle design.",
    tests: [
      {
        id: "cable-check",
        name: "Cable Connection Check",
        category: "Electrical",
        expectedCondition:
          "The cable must be properly connected to the designated terminal. The connector should be fully inserted and securely positioned.",
        description: "Verify power cables and slip ring lead terminations."
      },
      {
        id: "bolt-check",
        name: "Bolt Installation Check",
        category: "Mechanical",
        expectedCondition:
          "All required bolts must be installed in their designated positions and appear properly seated.",
        description: "Verify pitch bearing and yaw drive bolt presence and seating."
      },
      {
        id: "assembly-check",
        name: "Component Assembly Check",
        category: "Assembly",
        expectedCondition:
          "All sub-assemblies must be secured in their exact guide rails without misalignment.",
        description: "Inspect converter module and cooler assembly mounting."
      },
      {
        id: "label-check",
        name: "Label Check",
        category: "Compliance",
        expectedCondition:
          "All safety and equipment identification placards must be clearly visible and undamaged.",
        description: "Inspect nacelle interior warning labels and schema tags."
      },
      {
        id: "cover-check",
        name: "Cover Installation Check",
        category: "Enclosure",
        expectedCondition:
          "The required cover must be installed correctly, fully seated, and securely positioned.",
        description: "Verify generator end-cover and terminal seal."
      },
      {
        id: "general-visual",
        name: "General Visual Inspection",
        category: "Quality Assurance",
        expectedCondition:
          "The component must show no evidence of heat discoloration, foreign debris, or cracking.",
        description: "Overall visual cleanliness and surface condition check."
      }
    ]
  },
  {
    id: "S120",
    name: "S120",
    series: "2.1 MW Series",
    rating: "2.1 MW",
    rotorDiameter: "120 m",
    description: "Wind turbine model S120 - Proven workhorse engineered for diverse climatic terrains.",
    tests: [
      {
        id: "cable-check",
        name: "Cable Connection Check",
        category: "Electrical",
        expectedCondition:
          "The cable must be properly connected to the designated terminal. The connector should be fully inserted and securely positioned.",
        description: "Check grounding lugs and transformer primary/secondary leads."
      },
      {
        id: "bolt-check",
        name: "Bolt Installation Check",
        category: "Mechanical",
        expectedCondition:
          "All required bolts must be installed in their designated positions and appear properly seated.",
        description: "Check mainframe and generator foot mounting bolts."
      },
      {
        id: "assembly-check",
        name: "Component Assembly Check",
        category: "Assembly",
        expectedCondition:
          "Components must be correctly fastened to structural brackets with lock washers.",
        description: "Check hydraulic power unit mounting and hose clamping."
      },
      {
        id: "label-check",
        name: "Label Check",
        category: "Compliance",
        expectedCondition:
          "High voltage warning signs and component serial numbers must be clearly legible.",
        description: "Verify presence of HV hazard symbols and wire harness markers."
      },
      {
        id: "cover-check",
        name: "Cover Installation Check",
        category: "Enclosure",
        expectedCondition:
          "The required cover must be installed correctly, fully seated, and securely positioned.",
        description: "Check brake disc guard and yaw motor weather shields."
      },
      {
        id: "general-visual",
        name: "General Visual Inspection",
        category: "Quality Assurance",
        expectedCondition:
          "Area must be free of oil misting, water ingress, and surface paint blistering.",
        description: "Visual inspection for mechanical wear and fluid integrity."
      }
    ]
  },
  {
    id: "S133",
    name: "S133",
    series: "2.6 - 3.0 MW Series",
    rating: "2.6 - 3.0 MW",
    rotorDiameter: "133 m",
    description: "Wind turbine model S133 - High efficiency next-generation modular turbine system.",
    tests: [
      {
        id: "cable-check",
        name: "Cable Connection Check",
        category: "Electrical",
        expectedCondition:
          "The cable must be properly connected to the designated terminal. The connector should be fully inserted and securely positioned.",
        description: "Inspect converter busbar joints and fiber optic communication cables."
      },
      {
        id: "bolt-check",
        name: "Bolt Installation Check",
        category: "Mechanical",
        expectedCondition:
          "All required bolts must be installed in their designated positions and appear properly seated.",
        description: "Inspect tower-top flange and gearbox suspension bolts."
      },
      {
        id: "assembly-check",
        name: "Component Assembly Check",
        category: "Assembly",
        expectedCondition:
          "All modular control boxes must be firmly latched in place with anti-vibration dampers.",
        description: "Verify control cabinet internal module seatings."
      },
      {
        id: "label-check",
        name: "Label Check",
        category: "Compliance",
        expectedCondition:
          "Barcode tags, model plates, and earth connection markings must be readable.",
        description: "Validate equipment QA inspection stamp and rating plate."
      },
      {
        id: "cover-check",
        name: "Cover Installation Check",
        category: "Enclosure",
        expectedCondition:
          "The required cover must be installed correctly, fully seated, and securely positioned.",
        description: "Verify front nose-cone hatch and nacelle roof panels."
      },
      {
        id: "general-visual",
        name: "General Visual Inspection",
        category: "Quality Assurance",
        expectedCondition:
          "No visible cracks, metal shavings, unclipped cables, or unsealed penetrations.",
        description: "General visual survey before sign-off."
      }
    ]
  }
];

export function getExpectedCondition(modelId: string, testName: string): string {
  const model = TURBINE_MODELS.find((m) => m.id === modelId || m.name === modelId);
  if (!model) {
    return "The component must be properly installed and assembled according to manufacturer specifications.";
  }
  const test = model.tests.find((t) => t.name === testName || t.id === testName);
  if (!test) {
    return "The component must be properly installed and assembled according to manufacturer specifications.";
  }
  return test.expectedCondition;
}
