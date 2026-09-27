# Suzlon Wind Turbine AI Visual Inspection Demo

A functional, industrial quality assurance web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

Designed specifically for wind turbine manufacturing and assembly verification, following an intuitive workflow:

```text
Select Wind Turbine Model → Select Test → Upload Image → AI Analysis → Simple Conclusion
```

---

## Key Features

1. **Inspector Authorization (Login)**
   - Clean, professional login screen with mock authentication (`TECH-8492` / `inspect2026`).
   - Quick "Fill Credentials" button for instant demo access.

2. **Wind Turbine Model Selection**
   - **S175**: 175m rotor diameter, 3.15 MW platform
   - **S144**: 144m rotor diameter, 3.15 MW platform
   - **S120**: 120m rotor diameter, 2.1 MW platform
   - **S133**: 133m rotor diameter, 2.6 - 3.0 MW platform

3. **Inspection Procedure Selection**
   - Cable Connection Check
   - Bolt Installation Check
   - Component Assembly Check
   - Label Check
   - Cover Installation Check
   - General Visual Inspection
   - Pre-configured `expectedCondition` specifications for each procedure.

4. **Multi-Input Image Capture**
   - Drag & drop image files (JPG, PNG, WEBP)
   - File browser
   - Live camera capture with browser viewfinder
   - **Built-in 1-Click Demo Quality Test Images** for instant demonstration of `OK`, `NOT_OK`, and `REVIEW` conditions.

5. **Server-Side AI Engine (`POST /api/inspect`)**
   - Dual-mode architecture:
     - **Live AI Mode**: Uses OpenAI Vision (`gpt-4o-mini` / `gpt-4o`) when `OPENAI_API_KEY` is provided.
     - **Demo AI Mode**: Uses deterministic edge simulation when no API key is set, enabling full offline demos.
   - Strictly validates and produces structured conclusions:
     - `✓ OK`: Criteria satisfied, clear conclusion & confidence score.
     - `✕ NOT OK`: Identifies what is wrong, what it should be, and confidence score.
     - `⚠ REVIEW REQUIRED`: Inconclusive visual data or obstructed inspection.

6. **Inspection History Log**
   - Archived records with timestamp, operator ID, turbine model, test name, result status, and confidence.
   - Persisted across browser sessions using `localStorage`.

7. **Industrial Visual Design**
   - Suzlon turbine teal primary color (`#006F78`)
   - Light gray background (`#f8fafc`), dark high-contrast text (`#0f172a`)
   - ISO 9001 quality assurance workstation look & feel

---

## Architecture

```text
app/
  api/
    inspect/
      route.ts         # Secure server-side AI evaluation endpoint
  page.tsx             # Main inspection orchestration
  layout.tsx           # Industrial layout & typography
  globals.css          # Tailwind CSS & theme tokens

lib/
  ai/
    provider.ts        # Abstract AI inspection interface
    openai.ts          # OpenAI Vision API integration
    mock.ts            # Deterministic simulation engine

config/
  inspectionTests.ts   # Turbine models & expected conditions
  sampleImages.ts      # Inline demo inspection graphics

components/
  LoginScreen.tsx              # Authentication view
  Header.tsx                   # Navbar with Live/Demo badge
  ModelSelector.tsx            # Model selection cards
  TestSelector.tsx             # Inspection procedure cards
  ImageUploader.tsx            # Camera, dropzone & preview
  InspectionResult.tsx         # Clean OK / NOT OK / REVIEW layout
  InspectionHistoryModal.tsx   # Historical inspection log
```

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional)

Create a `.env.local` file to enable Live OpenAI Vision mode:

```bash
OPENAI_API_KEY=your_openai_api_key_here
# Optional model override (default: gpt-4o-mini)
OPENAI_MODEL=gpt-4o-mini
```

*Note: If no API key is provided, the application automatically runs in **Demo AI Mode**.*

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production / Vercel

```bash
npm run build
npm run start
```
