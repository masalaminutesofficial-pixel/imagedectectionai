"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { LoginScreen } from "@/components/LoginScreen";
import { ModelSelector } from "@/components/ModelSelector";
import { TestSelector } from "@/components/TestSelector";
import { ImageUploader } from "@/components/ImageUploader";
import { InspectionResult } from "@/components/InspectionResult";
import { InspectionHistoryModal, InspectionRecord } from "@/components/InspectionHistoryModal";
import { TurbineModelConfig, InspectionTestConfig, TURBINE_MODELS } from "@/config/inspectionTests";
import { InspectionResponse, InspectionStatus } from "@/lib/ai/provider";
import { Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";

type InspectionStep = "model-selection" | "test-selection" | "image-upload" | "result";

export default function Home() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    employeeId: string;
    role: string;
  } | null>(null);

  // Workflow state
  const [step, setStep] = useState<InspectionStep>("model-selection");
  const [selectedModel, setSelectedModel] = useState<TurbineModelConfig | null>(null);
  const [selectedTest, setSelectedTest] = useState<InspectionTestConfig | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [inspectionResult, setInspectionResult] = useState<InspectionResponse | null>(null);

  // Processing state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  // System mode & history
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [history, setHistory] = useState<InspectionRecord[]>([]);

  // Check live API status & load history from localStorage on mount
  useEffect(() => {
    // Check if live AI mode is available
    fetch("/api/inspect")
      .then((res) => res.json())
      .then((data) => {
        if (data?.isLiveMode) {
          setIsLiveMode(true);
        }
      })
      .catch((err) => {
        console.log("Status check note:", err);
      });

    // Load saved user session or default to null for clean demo
    const savedUser = localStorage.getItem("suzlon_qc_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        // ignore
      }
    }

    // Load inspection history
    const savedHistory = localStorage.getItem("suzlon_qc_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        // fallback
      }
    } else {
      // Seed with initial realistic demo history records
      const initialHistory: InspectionRecord[] = [
        {
          id: "hist-01",
          timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
          user: "TECH-8492",
          model: "S175",
          test: "Cable Connection Check",
          result: "OK",
          confidence: 0.94,
          conclusion: "The cable appears properly connected to the designated terminal."
        },
        {
          id: "hist-02",
          timestamp: new Date(Date.now() - 1000 * 60 * 128).toISOString(),
          user: "TECH-8492",
          model: "S144",
          test: "Bolt Installation Check",
          result: "NOT_OK",
          confidence: 0.91,
          conclusion: "Flange position #3 bolt missing from bracket flange."
        }
      ];
      setHistory(initialHistory);
      localStorage.setItem("suzlon_qc_history", JSON.stringify(initialHistory));
    }
  }, []);

  const handleLogin = (user: { name: string; employeeId: string; role: string }) => {
    setCurrentUser(user);
    localStorage.setItem("suzlon_qc_user", JSON.stringify(user));
    // Default to first model S175 for smooth demo experience
    setSelectedModel(TURBINE_MODELS[0]);
    setStep("model-selection");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("suzlon_qc_user");
    setStep("model-selection");
    setSelectedModel(null);
    setSelectedTest(null);
    setUploadedImage(null);
    setInspectionResult(null);
  };

  const handleSelectModel = (model: TurbineModelConfig) => {
    setSelectedModel(model);
    setSelectedTest(null);
    setStep("test-selection");
  };

  const handleSelectTest = (test: InspectionTestConfig) => {
    setSelectedTest(test);
    setStep("image-upload");
  };

  const handleImageSelected = async (
    imageDataUrl: string,
    imageName: string,
    demoScenario?: "OK" | "NOT_OK" | "REVIEW"
  ) => {
    if (!selectedModel || !selectedTest) return;

    setUploadedImage(imageDataUrl);
    setIsAnalyzing(true);
    setAnalyzeError(null);

    try {
      const response = await fetch("/api/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel.name,
          test: selectedTest.name,
          image: imageDataUrl,
          expectedCondition: selectedTest.expectedCondition,
          imageName: imageName,
          demoScenario: demoScenario
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data: InspectionResponse = await response.json();
      setInspectionResult(data);
      setStep("result");

      // Save to inspection history
      const newRecord: InspectionRecord = {
        id: `insp-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: currentUser?.employeeId || "TECH-8492",
        model: selectedModel.name,
        test: selectedTest.name,
        result: data.result,
        confidence: data.confidence,
        conclusion: data.conclusion,
        imageThumbnail: imageDataUrl
      };

      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("suzlon_qc_history", JSON.stringify(updatedHistory));
    } catch (err) {
      console.error("Analysis error:", err);
      setAnalyzeError(
        err instanceof Error
          ? err.message
          : "An error occurred during AI analysis. Please retry."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetakeImage = () => {
    setUploadedImage(null);
    setInspectionResult(null);
    setStep("image-upload");
  };

  const handleNewInspection = () => {
    setSelectedTest(null);
    setUploadedImage(null);
    setInspectionResult(null);
    setStep("model-selection");
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("suzlon_qc_history");
  };

  // If not logged in, show simple professional login screen
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans">
      {/* Top Industrial Navbar */}
      <Header
        user={currentUser}
        isLiveMode={isLiveMode}
        onNewInspection={handleNewInspection}
        onOpenHistory={() => setHistoryModalOpen(true)}
        onLogout={handleLogout}
        historyCount={history.length}
      />

      {/* Main Workflow Viewport */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Simple Step Breadcrumb Indicator */}
        <div className="mb-6 flex items-center justify-between text-xs font-semibold text-slate-500 overflow-x-auto pb-2">
          <div className="flex items-center gap-2">
            <span
              onClick={() => setStep("model-selection")}
              className={`cursor-pointer transition-colors ${
                step === "model-selection"
                  ? "text-[#006F78] font-bold"
                  : selectedModel
                  ? "text-slate-800 hover:text-[#006F78]"
                  : "text-slate-400"
              }`}
            >
              1. Turbine Model {selectedModel && `(${selectedModel.name})`}
            </span>
            <span className="text-slate-300">&gt;</span>
            <span
              onClick={() => selectedModel && setStep("test-selection")}
              className={`transition-colors ${
                selectedModel ? "cursor-pointer" : "cursor-not-allowed"
              } ${
                step === "test-selection"
                  ? "text-[#006F78] font-bold"
                  : selectedTest
                  ? "text-slate-800 hover:text-[#006F78]"
                  : "text-slate-400"
              }`}
            >
              2. Test Selection {selectedTest && `(${selectedTest.name})`}
            </span>
            <span className="text-slate-300">&gt;</span>
            <span
              onClick={() => selectedModel && selectedTest && setStep("image-upload")}
              className={`transition-colors ${
                selectedModel && selectedTest ? "cursor-pointer" : "cursor-not-allowed"
              } ${
                step === "image-upload"
                  ? "text-[#006F78] font-bold"
                  : uploadedImage
                  ? "text-slate-800"
                  : "text-slate-400"
              }`}
            >
              3. Image Capture
            </span>
            <span className="text-slate-300">&gt;</span>
            <span
              className={`${
                step === "result" ? "text-[#006F78] font-bold" : "text-slate-400"
              }`}
            >
              4. AI Conclusion
            </span>
          </div>
        </div>

        {/* Loading Overlay during AI Analysis */}
        {isAnalyzing && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs flex flex-col items-center justify-center min-h-[380px]">
            <div className="w-14 h-14 rounded-full bg-[#006F78]/10 text-[#006F78] flex items-center justify-center mb-4">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Analyzing Inspection Image
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mb-4">
              Evaluating component against criteria:
              <br />
              <strong className="text-slate-800 font-medium">
                &ldquo;{selectedTest?.expectedCondition}&rdquo;
              </strong>
            </p>
            <div className="w-48 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#006F78] h-full w-2/3 animate-pulse rounded-full" />
            </div>
          </div>
        )}

        {/* Error Message if API fails */}
        {analyzeError && !isAnalyzing && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
            <p className="font-bold mb-1">Analysis Request Failed:</p>
            <p>{analyzeError}</p>
            <button
              onClick={() => setStep("image-upload")}
              className="mt-3 px-3 py-1 bg-red-600 text-white rounded font-medium hover:bg-red-700"
            >
              Retry Image Upload
            </button>
          </div>
        )}

        {/* Step 1: Model Selection */}
        {!isAnalyzing && step === "model-selection" && (
          <ModelSelector
            selectedModelId={selectedModel?.id || null}
            onSelectModel={handleSelectModel}
          />
        )}

        {/* Step 2: Test Selection */}
        {!isAnalyzing && step === "test-selection" && selectedModel && (
          <TestSelector
            model={selectedModel}
            selectedTestName={selectedTest?.name || null}
            onSelectTest={handleSelectTest}
            onBack={() => setStep("model-selection")}
          />
        )}

        {/* Step 3: Image Upload & Preview */}
        {!isAnalyzing && step === "image-upload" && selectedModel && selectedTest && (
          <ImageUploader
            model={selectedModel}
            test={selectedTest}
            onImageSelected={handleImageSelected}
            onBack={() => setStep("test-selection")}
          />
        )}

        {/* Step 4: AI Inspection Result */}
        {!isAnalyzing && step === "result" && selectedModel && selectedTest && uploadedImage && inspectionResult && (
          <InspectionResult
            model={selectedModel}
            test={selectedTest}
            image={uploadedImage}
            result={inspectionResult}
            onRetakeImage={handleRetakeImage}
            onNewInspection={handleNewInspection}
          />
        )}
      </main>

      {/* History Modal */}
      <InspectionHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        records={history}
        onClearHistory={handleClearHistory}
      />

      {/* Industrial Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Suzlon Wind Energy &bull; AI Quality Inspection Station</span>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px]">System Status: Nominal</span>
            <span>&bull;</span>
            <span>ISO 9001 Compliance Demo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
