export interface SampleImage {
  id: string;
  label: string;
  description: string;
  expectedResult: "OK" | "NOT_OK" | "REVIEW";
  model: string;
  test: string;
  dataUrl: string;
}

// Crisp inline SVGs encoded as Data URLs simulating realistic industrial inspection viewpoints
function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: "cable-ok",
    label: "Cable: Fully Inserted (OK)",
    description: "Main 3-phase high-voltage power terminal connector fully seated and locked.",
    expectedResult: "OK",
    model: "S175",
    test: "Cable Connection Check",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
        <rect width="100%" height="100%" fill="#1e293b"/>
        <!-- Background panel grid -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.4"/>
        
        <!-- Inspection Overlay Header -->
        <rect x="20" y="20" width="560" height="35" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>
        <text x="35" y="43" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">SUZLON QA CAM 04 - S175 NACELLE TERMINAL BLOCK A2</text>
        <circle cx="560" cy="37" r="5" fill="#22c55e"/>

        <!-- Terminal Backplate -->
        <rect x="120" y="80" width="360" height="260" rx="8" fill="#334155" stroke="#64748b" stroke-width="2"/>
        
        <!-- Copper Busbar / Receptacle -->
        <rect x="180" y="120" width="240" height="50" rx="4" fill="#b45309" stroke="#d97706" stroke-width="2"/>
        <text x="210" y="152" fill="#fef3c7" font-family="sans-serif" font-size="14" font-weight="bold">BUSBAR TERMINAL T1-3A</text>
        
        <!-- Receptacle Socket -->
        <rect x="220" y="170" width="160" height="30" fill="#0f172a" stroke="#475569" stroke-width="2"/>
        
        <!-- Heavy Gauge Cable & Lug (FULLY INSERTED) -->
        <path d="M 300 370 L 300 240" stroke="#0284c7" stroke-width="36" stroke-linecap="round"/>
        <path d="M 300 370 L 300 240" stroke="#38bdf8" stroke-width="28" stroke-linecap="round"/>
        
        <!-- Connector Housing & Locking Clamp -->
        <rect x="240" y="185" width="120" height="55" rx="6" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
        <!-- Dual Safety Latch ENGAGED -->
        <rect x="230" y="195" width="14" height="25" rx="2" fill="#22c55e" stroke="#16a34a" stroke-width="1.5"/>
        <rect x="356" y="195" width="14" height="25" rx="2" fill="#22c55e" stroke="#16a34a" stroke-width="1.5"/>
        <text x="250" y="218" fill="#ffffff" font-family="monospace" font-size="11" font-weight="bold">LATCH LOCKED</text>

        <!-- Torqued Nut with Green Seal Marker -->
        <circle cx="300" cy="145" r="14" fill="#64748b" stroke="#cbd5e1" stroke-width="2"/>
        <line x1="286" y1="145" x2="314" y2="145" stroke="#22c55e" stroke-width="3"/>

        <!-- Grounding Tag -->
        <rect x="400" y="270" width="60" height="24" rx="3" fill="#eab308"/>
        <text x="408" y="286" fill="#713f12" font-family="sans-serif" font-size="10" font-weight="bold">PE GND</text>

        <!-- Visual Targeting Reticle -->
        <circle cx="300" cy="205" r="45" fill="none" stroke="#22c55e" stroke-width="2" stroke-dasharray="6,4"/>
        <text x="355" y="210" fill="#22c55e" font-family="monospace" font-size="11">✓ SEATED 0mm</text>
      </svg>
    `)
  },
  {
    id: "cable-not-ok",
    label: "Cable: Disconnected / Loose (NOT OK)",
    description: "Connector pulled back by 18mm, safety latch unlocked, copper pin exposed.",
    expectedResult: "NOT_OK",
    model: "S175",
    test: "Cable Connection Check",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
        <rect width="100%" height="100%" fill="#1e293b"/>
        <defs>
          <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid2)" opacity="0.4"/>
        
        <!-- Inspection Overlay Header -->
        <rect x="20" y="20" width="560" height="35" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>
        <text x="35" y="43" fill="#f87171" font-family="monospace" font-size="13" font-weight="bold">SUZLON QA CAM 04 - S175 NACELLE TERMINAL BLOCK A2</text>
        <circle cx="560" cy="37" r="5" fill="#ef4444"/>

        <!-- Terminal Backplate -->
        <rect x="120" y="80" width="360" height="260" rx="8" fill="#334155" stroke="#64748b" stroke-width="2"/>
        
        <!-- Copper Busbar / Receptacle -->
        <rect x="180" y="120" width="240" height="50" rx="4" fill="#b45309" stroke="#d97706" stroke-width="2"/>
        <text x="210" y="152" fill="#fef3c7" font-family="sans-serif" font-size="14" font-weight="bold">BUSBAR TERMINAL T1-3A</text>
        
        <!-- Receptacle Socket -->
        <rect x="220" y="170" width="160" height="30" fill="#0f172a" stroke="#475569" stroke-width="2"/>
        
        <!-- EXPOSED GAP / DISCONNECTION AREA -->
        <rect x="235" y="200" width="130" height="32" fill="#ef4444" opacity="0.25"/>
        <!-- Exposed copper pins -->
        <rect x="260" y="200" width="12" height="28" fill="#d97706"/>
        <rect x="294" y="200" width="12" height="28" fill="#d97706"/>
        <rect x="328" y="200" width="12" height="28" fill="#d97706"/>

        <!-- Heavy Gauge Cable & Lug (PARTIALLY DISCONNECTED & TILTED) -->
        <path d="M 305 375 L 302 265" stroke="#0284c7" stroke-width="36" stroke-linecap="round"/>
        <path d="M 305 375 L 302 265" stroke="#38bdf8" stroke-width="28" stroke-linecap="round"/>
        
        <!-- Connector Housing (TILTED / UNSEATED) -->
        <g transform="rotate(4 300 240)">
          <rect x="240" y="228" width="120" height="55" rx="6" fill="#475569" stroke="#ef4444" stroke-width="2"/>
          <!-- Safety Latch DISENGAGED (RED) -->
          <rect x="226" y="235" width="14" height="25" rx="2" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5" transform="rotate(-25 226 235)"/>
          <rect x="360" y="235" width="14" height="25" rx="2" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5" transform="rotate(25 360 235)"/>
          <text x="247" y="260" fill="#fca5a5" font-family="monospace" font-size="10" font-weight="bold">UNLATCHED GAP</text>
        </g>

        <!-- Torqued Nut -->
        <circle cx="300" cy="145" r="14" fill="#64748b" stroke="#cbd5e1" stroke-width="2"/>

        <!-- Disconnection Callout -->
        <circle cx="300" cy="216" r="48" fill="none" stroke="#ef4444" stroke-width="3"/>
        <line x1="348" y1="216" x2="430" y2="216" stroke="#ef4444" stroke-width="2"/>
        <rect x="430" y="202" width="140" height="28" rx="4" fill="#450a0a" stroke="#ef4444"/>
        <text x="440" y="221" fill="#fca5a5" font-family="monospace" font-size="11" font-weight="bold">✕ 18mm AIR GAP</text>
      </svg>
    `)
  },
  {
    id: "bolt-ok",
    label: "Bolts: All Installed & Torqued (OK)",
    description: "Main nacelle yaw ring flange showing 6/6 bolts securely seated with torque witness lines.",
    expectedResult: "OK",
    model: "S175",
    test: "Bolt Installation Check",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
        <rect width="100%" height="100%" fill="#1e293b"/>
        <!-- Flange Circle -->
        <circle cx="300" cy="200" r="150" fill="#334155" stroke="#64748b" stroke-width="4"/>
        <circle cx="300" cy="200" r="85" fill="#0f172a" stroke="#475569" stroke-width="3"/>
        
        <text x="235" y="195" fill="#94a3b8" font-family="sans-serif" font-size="12" font-weight="bold">YAW BEARING</text>
        <text x="245" y="215" fill="#64748b" font-family="sans-serif" font-size="11">FLANGE B</text>

        <!-- 6 Bolts fully installed around circle with green witness lines -->
        <!-- Bolt 1 (Top) -->
        <circle cx="300" cy="85" r="16" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
        <line x1="284" y1="85" x2="316" y2="85" stroke="#22c55e" stroke-width="3"/>

        <!-- Bolt 2 (Top Right) -->
        <circle cx="400" cy="142" r="16" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
        <line x1="389" y1="130" x2="411" y2="154" stroke="#22c55e" stroke-width="3"/>

        <!-- Bolt 3 (Bottom Right) -->
        <circle cx="400" cy="258" r="16" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
        <line x1="389" y1="270" x2="411" y2="246" stroke="#22c55e" stroke-width="3"/>

        <!-- Bolt 4 (Bottom) -->
        <circle cx="300" cy="315" r="16" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
        <line x1="284" y1="315" x2="316" y2="315" stroke="#22c55e" stroke-width="3"/>

        <!-- Bolt 5 (Bottom Left) -->
        <circle cx="200" cy="258" r="16" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
        <line x1="189" y1="246" x2="211" y2="270" stroke="#22c55e" stroke-width="3"/>

        <!-- Bolt 6 (Top Left) -->
        <circle cx="200" cy="142" r="16" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
        <line x1="189" y1="154" x2="211" y2="130" stroke="#22c55e" stroke-width="3"/>

        <rect x="20" y="20" width="560" height="35" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>
        <text x="35" y="43" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">BEARING FLANGE QC: 6/6 BOLTS TORQUED &amp; SEALED</text>
        <circle cx="560" cy="37" r="5" fill="#22c55e"/>
      </svg>
    `)
  },
  {
    id: "bolt-missing",
    label: "Bolts: Missing Bolt #3 (NOT OK)",
    description: "Flange position #3 bolt hole is empty with no fastener installed.",
    expectedResult: "NOT_OK",
    model: "S175",
    test: "Bolt Installation Check",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
        <rect width="100%" height="100%" fill="#1e293b"/>
        <!-- Flange Circle -->
        <circle cx="300" cy="200" r="150" fill="#334155" stroke="#64748b" stroke-width="4"/>
        <circle cx="300" cy="200" r="85" fill="#0f172a" stroke="#475569" stroke-width="3"/>
        
        <text x="235" y="195" fill="#94a3b8" font-family="sans-serif" font-size="12" font-weight="bold">YAW BEARING</text>
        <text x="245" y="215" fill="#64748b" font-family="sans-serif" font-size="11">FLANGE B</text>

        <!-- Bolt 1 (Top) -->
        <circle cx="300" cy="85" r="16" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
        <line x1="284" y1="85" x2="316" y2="85" stroke="#22c55e" stroke-width="3"/>

        <!-- Bolt 2 (Top Right) -->
        <circle cx="400" cy="142" r="16" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
        <line x1="389" y1="130" x2="411" y2="154" stroke="#22c55e" stroke-width="3"/>

        <!-- Bolt 3 (Bottom Right) - MISSING / EMPTY HOLE -->
        <circle cx="400" cy="258" r="16" fill="#090d16" stroke="#ef4444" stroke-width="3"/>
        <circle cx="400" cy="258" r="28" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4"/>
        <text x="435" y="262" fill="#ef4444" font-family="monospace" font-size="12" font-weight="bold">MISSING BOLT</text>

        <!-- Bolt 4 (Bottom) -->
        <circle cx="300" cy="315" r="16" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
        <line x1="284" y1="315" x2="316" y2="315" stroke="#22c55e" stroke-width="3"/>

        <!-- Bolt 5 (Bottom Left) -->
        <circle cx="200" cy="258" r="16" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
        <line x1="189" y1="246" x2="211" y2="270" stroke="#22c55e" stroke-width="3"/>

        <!-- Bolt 6 (Top Left) -->
        <circle cx="200" cy="142" r="16" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
        <line x1="189" y1="154" x2="211" y2="130" stroke="#22c55e" stroke-width="3"/>

        <rect x="20" y="20" width="560" height="35" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>
        <text x="35" y="43" fill="#f87171" font-family="monospace" font-size="13" font-weight="bold">QC ALERT: BOLT #3 ABSENT FROM MOUNTING FLANGE</text>
        <circle cx="560" cy="37" r="5" fill="#ef4444"/>
      </svg>
    `)
  },
  {
    id: "cover-not-ok",
    label: "Cover: Misaligned Gap (NOT OK)",
    description: "Generator weather hood cover not seated, loose clamp and water ingress gap.",
    expectedResult: "NOT_OK",
    model: "S175",
    test: "Cover Installation Check",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
        <rect width="100%" height="100%" fill="#1e293b"/>
        <!-- Main Enclosure -->
        <rect x="100" y="90" width="400" height="240" rx="4" fill="#334155" stroke="#64748b" stroke-width="2"/>
        
        <!-- Outer Cover (Tilted / Misaligned) -->
        <g transform="rotate(-6 100 90)">
          <rect x="90" y="85" width="420" height="25" rx="3" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
          <text x="130" y="102" fill="#cbd5e1" font-family="sans-serif" font-size="12" font-weight="bold">TOP NACELLE ACCESS COWL</text>
        </g>
        
        <!-- Gap with warning indicator -->
        <rect x="360" y="105" width="130" height="35" fill="#ef4444" opacity="0.3"/>
        <line x1="360" y1="105" x2="490" y2="125" stroke="#ef4444" stroke-width="3"/>
        <text x="375" y="145" fill="#ef4444" font-family="monospace" font-size="12" font-weight="bold">24mm GAP - UNSEATED</text>

        <rect x="20" y="20" width="560" height="35" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>
        <text x="35" y="43" fill="#f87171" font-family="monospace" font-size="13" font-weight="bold">HOOD ALIGNMENT CHECK: NOT FULLY SEATED</text>
        <circle cx="560" cy="37" r="5" fill="#ef4444"/>
      </svg>
    `)
  },
  {
    id: "unclear-review",
    label: "Inspection: Obscured / Blurry (REVIEW)",
    description: "Severe optical glare, lens condensation, and partial blockage preventing verification.",
    expectedResult: "REVIEW",
    model: "S175",
    test: "General Visual Inspection",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
        <rect width="100%" height="100%" fill="#334155"/>
        <filter id="heavyBlur">
          <feGaussianBlur stdDeviation="14"/>
        </filter>
        <g filter="url(#heavyBlur)">
          <circle cx="300" cy="200" r="160" fill="#0f172a"/>
          <rect x="180" y="120" width="240" height="160" fill="#cbd5e1"/>
          <circle cx="280" cy="180" r="90" fill="#38bdf8"/>
        </g>
        
        <!-- Glare artifact -->
        <ellipse cx="250" cy="170" rx="190" ry="90" fill="#ffffff" opacity="0.4" transform="rotate(-30 250 170)"/>
        
        <rect x="20" y="20" width="560" height="35" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>
        <text x="35" y="43" fill="#fbbf24" font-family="monospace" font-size="13" font-weight="bold">LENS ADVISORY: GLARE / OUT OF FOCUS</text>
        <circle cx="560" cy="37" r="5" fill="#f59e0b"/>

        <rect x="160" y="175" width="280" height="50" rx="6" fill="#0f172a" opacity="0.85" stroke="#f59e0b"/>
        <text x="180" y="205" fill="#fbbf24" font-family="monospace" font-size="13" font-weight="bold">⚠ INSUFFICIENT VISUAL DATA</text>
      </svg>
    `)
  }
];
