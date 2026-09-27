"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { InspectionResult } from "@/components/inspection-result";
import { TurbineModel, InspectionTest } from "@/config/inspection-tests";
import { InspectionInspectionResponse } from "@/lib/gemini";
import { Loader2 } from "lucide-react";

interface ActiveInspectionData {
  model: TurbineModel;
  test: InspectionTest;
  image: string;
  result: InspectionInspectionResponse;
}

export default function InspectionResultPage() {
  const router = useRouter();
  const [data, setData] = useState<ActiveInspectionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const userStr = localStorage.getItem("turbine_qc_user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    // Retrieve active inspection from sessionStorage
    const stored = sessionStorage.getItem("active_inspection");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse active inspection:", e);
        router.push("/inspection");
      }
    } else {
      router.push("/inspection");
    }
    setLoading(false);
  }, [router]);

  const handleRetakeImage = () => {
    router.push("/inspection");
  };

  const handleNewInspection = () => {
    sessionStorage.removeItem("active_inspection");
    router.push("/inspection?step=model");
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#006F78]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#006F78]">
            Quality Assurance Report &bull; AI Visual Analysis
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Inspection Conclusion
          </h2>
        </div>

        <InspectionResult
          model={data.model}
          test={data.test}
          image={data.image}
          result={data.result}
          onRetakeImage={handleRetakeImage}
          onNewInspection={handleNewInspection}
        />
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
