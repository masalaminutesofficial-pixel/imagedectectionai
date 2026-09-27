"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { ModelSelector } from "@/components/model-selector";
import { TestSelector } from "@/components/test-selector";
import { ImageUploader } from "@/components/image-uploader";
import { TurbineModel, InspectionTest, TURBINE_MODELS } from "@/config/inspection-tests";
import { InspectionInspectionResponse } from "@/lib/gemini";
import { InspectionRecord } from "@/components/InspectionHistoryModal";
import { Loader2, AlertCircle } from "lucide-react";

type Step = "model" | "test" | "upload";

function InspectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>("model");
  const [selectedModel, setSelectedModel] = useState<TurbineModel | null>(TURBINE_MODELS[0]); // default to primary demo S175
  const [selectedTest, setSelectedTest] = useState<InspectionTest | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check login authentication
  useEffect(() => {
    const userStr = localStorage.getItem("turbine_qc_user");
    if (!userStr) {
      router.push("/login");
    }
  }, [router]);

  // Handle URL step parameter e.g. /inspection?step=model
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam === "model") {
      setStep("model");
      setSelectedTest(null);
    }
  }, [searchParams]);

  const handleSelectModel = (model: TurbineModel) => {
    setSelectedModel(model);
    setSelectedTest(null);
    setStep("test");
  };

  const handleSelectTest = (test: InspectionTest) => {
    setSelectedTest(test);
    setStep("upload");
  };

  const handleImageAnalysis = async (
    imageDataUrl: string,
    imageName: string,
    demoScenario?: "OK" | "NOT_OK" | "REVIEW"
  ) => {
    if (!selectedModel || !selectedTest) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel.name,
          test: selectedTest.name,
          image: imageDataUrl,
          demoScenario: demoScenario
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const resultData: InspectionInspectionResponse = await response.json();

      // Store in sessionStorage for /inspection/result
      sessionStorage.setItem(
        "active_inspection",
        JSON.stringify({
          model: selectedModel,
          test: selectedTest,
          image: imageDataUrl,
          result: resultData
        })
      );

      // Append to inspection history in localStorage
      const userStr = localStorage.getItem("turbine_qc_user");
      const userObj = userStr ? JSON.parse(userStr) : { employeeId: "TECH-8492" };

      const newRecord: InspectionRecord = {
        id: `insp-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: userObj.employeeId,
        model: selectedModel.name,
        test: selectedTest.name,
        result: resultData.result,
        confidence: resultData.confidence || (resultData.result === "OK" ? 0.95 : 0.91),
        conclusion: resultData.conclusion,
        imageThumbnail: imageDataUrl
      };

      const existingHistoryStr = localStorage.getItem("turbine_qc_history");
      const existingHistory: InspectionRecord[] = existingHistoryStr
        ? JSON.parse(existingHistoryStr)
        : [];
      const updatedHistory = [newRecord, ...existingHistory];
      localStorage.setItem("turbine_qc_history", JSON.stringify(updatedHistory));

      // Navigate to the result page
      router.push("/inspection/result");
    } catch (err) {
      console.error("Analysis failure:", err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while communicating with the inspection API."
      );
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb Flow Bar */}
        <div className="mb-6 flex items-center justify-between text-xs font-semibold text-slate-500 overflow-x-auto pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setStep("model");
              }}
              className={`transition-colors cursor-pointer ${
                step === "model"
                  ? "text-[#006F78] font-bold"
                  : selectedModel
                  ? "text-slate-800 hover:text-[#006F78]"
                  : "text-slate-400"
              }`}
            >
              1. Turbine Model {selectedModel && `(${selectedModel.name})`}
            </button>
            <span className="text-slate-300">&gt;</span>
            <button
              type="button"
              disabled={!selectedModel}
              onClick={() => {
                if (selectedModel) setStep("test");
              }}
              className={`transition-colors ${
                selectedModel ? "cursor-pointer" : "cursor-not-allowed text-slate-400"
              } ${
                step === "test"
                  ? "text-[#006F78] font-bold"
                  : selectedTest
                  ? "text-slate-800 hover:text-[#006F78]"
                  : "text-slate-400"
              }`}
            >
              2. Inspection Test {selectedTest && `(${selectedTest.name})`}
            </button>
            <span className="text-slate-300">&gt;</span>
            <span
              className={`${
                step === "upload" ? "text-[#006F78] font-bold" : "text-slate-400"
              }`}
            >
              3. Image Analysis
            </span>
          </div>
        </div>

        {/* Loading State during Gemini Inference */}
        {isAnalyzing && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs flex flex-col items-center justify-center min-h-[380px]">
            <div className="w-14 h-14 rounded-full bg-[#006F78]/10 text-[#006F78] flex items-center justify-center mb-4">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Gemini Visual Evaluation in Progress
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mb-4">
              Analyzing component photograph with Google Gemini 2.5 Flash against:
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

        {/* Error notification */}
        {errorMessage && !isAnalyzing && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Inspection Request Failed</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Step 1: Model Selection */}
        {!isAnalyzing && step === "model" && (
          <ModelSelector
            selectedModelId={selectedModel?.id || null}
            onSelectModel={handleSelectModel}
          />
        )}

        {/* Step 2: Test Selection */}
        {!isAnalyzing && step === "test" && selectedModel && (
          <TestSelector
            model={selectedModel}
            selectedTestName={selectedTest?.name || null}
            onSelectTest={handleSelectTest}
            onBack={() => setStep("model")}
          />
        )}

        {/* Step 3: Image Upload & Preview */}
        {!isAnalyzing && step === "upload" && selectedModel && selectedTest && (
          <ImageUploader
            model={selectedModel}
            test={selectedTest}
            onImageSelected={handleImageAnalysis}
            onBack={() => setStep("test")}
            isLoading={isAnalyzing}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>AI-Powered Wind Turbine Quality Inspection &bull; Google Gemini Vision</span>
          <span>ISO 9001 QA Demonstration Tool</span>
        </div>
      </footer>
    </div>
  );
}

export default function InspectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-[#006F78]" />
        </div>
      }
    >
      <InspectionContent />
    </Suspense>
  );
}
