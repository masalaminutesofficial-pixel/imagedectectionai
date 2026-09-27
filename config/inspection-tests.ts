export interface InspectionTest {
  id: string;
  name: string;
  category: "Electrical" | "Mechanical" | "Enclosure" | "Assembly" | "Compliance" | "General";
  expectedCondition: string;
  description: string;
}

export interface TurbineModel {
  id: string;
  name: string;
  series: string;
  rating: string;
  rotorDiameter: string;
  description: string;
  isPrimaryDemo?: boolean;
  tests: InspectionTest[];
}

/**
 * Standard inspection configurations for wind turbine models.
 * 
 * IMPORTANT ENGINEERING DISCLAIMER:
 * The expected conditions below are illustrative template placeholders for this demo application.
 * In a production deployment, these must be replaced with certified manufacturer specifications,
 * engineering drawings, and officially approved Quality Assurance (QA) inspection work instructions.
 */
export const TURBINE_MODELS: TurbineModel[] = [
  {
    id: "S175",
    name: "S175",
    series: "3.15 MW Series",
    rating: "3.15 MW",
    rotorDiameter: "175 m",
    description: "Wind turbine model S175 - Primary demo platform (Utility-scale onshore).",
    isPrimaryDemo: true,
    tests: [
      {
        id: "cable-check",
        name: "Cable Connection Check",
        category: "Electrical",
        expectedCondition:
          "The cable must be fully seated in its designated connector terminal with retention clip locked and no exposed conductor gap.",
        description: "Verify power/signal cable seating, connector retention, and absence of displacement."
      },
      {
        id: "bolt-check",
        name: "Bolt Installation Check",
        category: "Mechanical",
        expectedCondition:
          "All designated bolts must be present, seated flush against the flange, with torque witness marks visible and aligned.",
        description: "Inspect flange and bracket bolt assemblies for completeness, seating, and witness marks."
      },
      {
        id: "cover-check",
        name: "Cover Installation Check",
        category: "Enclosure",
        expectedCondition:
          "The protective cover must be installed flush against the frame with all latches/fasteners engaged and no visible seal gap.",
        description: "Check protective weather/dust covers and access hatch closures for proper seating."
      },
      {
        id: "assembly-check",
        name: "Component Assembly Check",
        category: "Assembly",
        expectedCondition:
          "Components must be securely mounted in designated brackets without visible tilt, misalignment, or missing fasteners.",
        description: "Verify structural component alignment, bracket attachment, and mechanical orientation."
      },
      {
        id: "label-check",
        name: "Label Presence Check",
        category: "Compliance",
        expectedCondition:
          "Safety warning, phase identification, or serialization label must be present, legible, correctly positioned, and free from peeling.",
        description: "Confirm mandatory safety notices, equipment placards, and wire tags are in place."
      },
      {
        id: "general-visual",
        name: "General Visual Inspection",
        category: "General",
        expectedCondition:
          "The visible area must be clean and free of foreign object debris (FOD), obvious cracks, fluid leaks, or unseated components.",
        description: "General visual survey of the turbine compartment for cleanliness and obvious physical defects."
      }
    ]
  },
  {
    id: "S144",
    name: "S144",
    series: "3.15 MW Series",
    rating: "3.15 MW",
    rotorDiameter: "144 m",
    description: "Wind turbine model S144 - Low wind site specialist platform.",
    tests: [
      {
        id: "cable-check",
        name: "Cable Connection Check",
        category: "Electrical",
        expectedCondition:
          "The cable must be fully seated in its designated connector terminal with retention clip locked and no exposed conductor gap.",
        description: "Inspect slip ring and converter power terminal connections."
      },
      {
        id: "bolt-check",
        name: "Bolt Installation Check",
        category: "Mechanical",
        expectedCondition:
          "All designated bolts must be present and fully seated in their designated positions.",
        description: "Verify yaw drive and bearing attachment bolt completeness."
      },
      {
        id: "cover-check",
        name: "Cover Installation Check",
        category: "Enclosure",
        expectedCondition:
          "The protective cover must be installed correctly, fully seated, and securely latched.",
        description: "Inspect generator end cover and cable gland seals."
      },
      {
        id: "assembly-check",
        name: "Component Assembly Check",
        category: "Assembly",
        expectedCondition:
          "Components must be secured in guide rails without physical distortion or misalignment.",
        description: "Verify cooler and heat exchanger mounting bracket assemblies."
      },
      {
        id: "label-check",
        name: "Label Presence Check",
        category: "Compliance",
        expectedCondition:
          "Placards and rating plates must be firmly affixed, legible, and unblemished.",
        description: "Verify equipment serial tags and high voltage hazard labels."
      },
      {
        id: "general-visual",
        name: "General Visual Inspection",
        category: "General",
        expectedCondition:
          "Inspection area must show no oil misting, foreign material, or structural cracks.",
        description: "Standard visual inspection prior to compartment sign-off."
      }
    ]
  },
  {
    id: "S120",
    name: "S120",
    series: "2.1 MW Series",
    rating: "2.1 MW",
    rotorDiameter: "120 m",
    description: "Wind turbine model S120 - High reliability workhorse platform.",
    tests: [
      {
        id: "cable-check",
        name: "Cable Connection Check",
        category: "Electrical",
        expectedCondition:
          "The cable must be fully seated in its designated connector terminal with retention clip locked.",
        description: "Inspect main grounding conductor and transformer terminations."
      },
      {
        id: "bolt-check",
        name: "Bolt Installation Check",
        category: "Mechanical",
        expectedCondition:
          "All designated bolts must be present and seated flush with visible witness marks.",
        description: "Inspect mainframe and gearbox mounting bolts."
      },
      {
        id: "cover-check",
        name: "Cover Installation Check",
        category: "Enclosure",
        expectedCondition:
          "The protective cover must be installed correctly and securely positioned.",
        description: "Inspect brake disc guard and yaw motor weather shields."
      },
      {
        id: "assembly-check",
        name: "Component Assembly Check",
        category: "Assembly",
        expectedCondition:
          "Hydraulic and electrical assemblies must be mounted securely without loose hardware.",
        description: "Inspect hydraulic pack brackets and damping mounts."
      },
      {
        id: "label-check",
        name: "Label Presence Check",
        category: "Compliance",
        expectedCondition:
          "Warning labels and electrical schematic tags must be clearly visible.",
        description: "Check electrical warning labels and phase marks."
      },
      {
        id: "general-visual",
        name: "General Visual Inspection",
        category: "General",
        expectedCondition:
          "No visible cracks, foreign debris, or hydraulic fluid leaks.",
        description: "General visual inspection of the nacelle interior."
      }
    ]
  },
  {
    id: "S133",
    name: "S133",
    series: "2.6 - 3.0 MW Series",
    rating: "2.6 - 3.0 MW",
    rotorDiameter: "133 m",
    description: "Wind turbine model S133 - Modular next-generation platform.",
    tests: [
      {
        id: "cable-check",
        name: "Cable Connection Check",
        category: "Electrical",
        expectedCondition:
          "The cable must be fully seated in its designated connector terminal with retention clip locked.",
        description: "Inspect busbar joints and high-voltage feed lines."
      },
      {
        id: "bolt-check",
        name: "Bolt Installation Check",
        category: "Mechanical",
        expectedCondition:
          "All designated bolts must be present and properly seated.",
        description: "Inspect tower-top flange and suspension bolts."
      },
      {
        id: "cover-check",
        name: "Cover Installation Check",
        category: "Enclosure",
        expectedCondition:
          "The protective cover must be installed flush and latched.",
        description: "Inspect nose cone and electrical cubicle covers."
      },
      {
        id: "assembly-check",
        name: "Component Assembly Check",
        category: "Assembly",
        expectedCondition:
          "Modular cabinets must be seated squarely and latched.",
        description: "Inspect control unit rack assemblies."
      },
      {
        id: "label-check",
        name: "Label Presence Check",
        category: "Compliance",
        expectedCondition:
          "Serial numbers, barcode tags, and warning decals must be legible.",
        description: "Inspect compliance marking and QA serial stamps."
      },
      {
        id: "general-visual",
        name: "General Visual Inspection",
        category: "General",
        expectedCondition:
          "Surface must be free of damage, oil leaks, or debris.",
        description: "General visual scan of the turbine unit."
      }
    ]
  }
];

/**
 * Server-authoritative lookup for expected condition.
 * Client-supplied expected conditions are NEVER trusted over this server configuration.
 */
export function getServerExpectedCondition(modelName: string, testName: string): string {
  const model = TURBINE_MODELS.find(
    (m) => m.name.toLowerCase() === modelName.trim().toLowerCase() || m.id.toLowerCase() === modelName.trim().toLowerCase()
  );

  if (!model) {
    return "The component must be installed properly according to manufacturer engineering standards.";
  }

  const test = model.tests.find(
    (t) => t.name.toLowerCase() === testName.trim().toLowerCase() || t.id.toLowerCase() === testName.trim().toLowerCase()
  );

  if (!test) {
    return "The component must be installed properly according to manufacturer engineering standards.";
  }

  return test.expectedCondition;
}

export function getTurbineModel(modelName: string): TurbineModel | undefined {
  return TURBINE_MODELS.find(
    (m) => m.name.toLowerCase() === modelName.trim().toLowerCase() || m.id.toLowerCase() === modelName.trim().toLowerCase()
  );
}
