"use client";

import React from "react";
import { TurbineModelConfig, InspectionTestConfig } from "@/config/inspectionTests";
import { InspectionResponse } from "@/lib/ai/provider";
import {
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  Cpu,
  Clock
} from "lucide-react";

interface InspectionResultProps {
  model: TurbineModelConfig;
  test: InspectionTestConfig;
  image: string;
  result: InspectionResponse;
  onRetakeImage: () => void;
  onNewInspection: () => void;
}

export function InspectionResult({
  model,
  test,
  image,
  result,
  onRetakeImage,
  onNewInspection
}: InspectionResultProps) {
  const isOk = result.result === "OK";
  const isNotOk = result.result === "NOT_OK";
  const isReview = result.result === "REVIEW";

  const confidencePercentage = Math.round((result.confidence || 0.9) * 100);

  return (
    <div className="space-y-6">
      {/* Container Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Card Header Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              AI Visual Inspection
            </span>
            <div className="flex items-center gap-4 mt-0.5 text-xs text-slate-700">
              <span>
                <strong className="text-slate-500">Model:</strong>{" "}
                <span className="font-mono font-bold text-slate-900">{model.name}</span>
              </span>
              <span>
                <strong className="text-slate-500">Test:</strong>{" "}
                <span className="font-semibold text-slate-900">{test.name}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {new Date(result.timestamp || Date.now()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              })}
            </span>
          </div>
        </div>

        {/* 2-Column Split: Image on left, Structured Evaluation on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Image */}
          <div className="lg:col-span-6 bg-slate-950 p-4 sm:p-6 flex flex-col justify-center items-center border-b lg:border-b-0 lg:border-r border-slate-200">
            <div className="relative w-full max-h-[460px] flex items-center justify-center rounded-lg overflow-hidden">
              <img
                src={image}
                alt="Captured turbine inspection"
                className="max-h-[440px] w-auto object-contain rounded-md"
              />

              {/* Status Badge overlay in corner of image */}
              <div className="absolute top-3 left-3">
                {isOk && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-600 text-white shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    PASS
                  </span>
                )}
                {isNotOk && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-md">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                    DEFECT
                  </span>
                )}
                {isReview && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
                    <AlertTriangle className="w-3.5 h-3.5 stroke-[3]" />
                    REVIEW
                  </span>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-3">
              Inspection Frame &bull; {test.name}
            </p>
          </div>

          {/* Right Column: AI Analysis Result */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* 1. OK RESULT VIEW */}
              {isOk && (
                <div className="space-y-6">
                  {/* Large Green Status */}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-600 shrink-0">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-extrabold text-green-600 tracking-tight">
                        ✓ OK
                      </h3>
                      <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">
                        Criteria Satisfied
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Conclusion
                    </h4>
                    <p className="text-base font-medium text-slate-900 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                      &ldquo;{result.conclusion}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Confidence:
                    </span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      {confidencePercentage}%
                    </span>
                  </div>
                </div>
              )}

              {/* 2. NOT OK RESULT VIEW */}
              {isNotOk && (
                <div className="space-y-5">
                  {/* Large Red Status */}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                      <X className="w-8 h-8 stroke-[3]" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-extrabold text-red-600 tracking-tight">
                        ✕ NOT OK
                      </h3>
                      <p className="text-xs font-semibold text-red-700 uppercase tracking-wider">
                        Non-Conformance Found
                      </p>
                    </div>
                  </div>

                  {/* What is wrong? */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 mb-1.5">
                      What is wrong?
                    </h4>
                    <p className="text-sm font-medium text-slate-900 leading-relaxed bg-red-50/60 p-3.5 rounded-lg border border-red-200">
                      {result.reason || result.conclusion}
                    </p>
                  </div>

                  {/* What should it be? */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      What should it be?
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      {result.whatShouldBe || test.expectedCondition}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      AI Confidence:
                    </span>
                    <span className="text-base font-bold text-red-600 font-mono">
                      {confidencePercentage}%
                    </span>
                  </div>
                </div>
              )}

              {/* 3. REVIEW RESULT VIEW */}
              {isReview && (
                <div className="space-y-5">
                  {/* Large Amber Status */}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                      <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">
                        ⚠ REVIEW REQUIRED
                      </h3>
                      <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                        Inconclusive Visual Sample
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Message:
                    </h4>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed bg-amber-50/60 p-4 rounded-lg border border-amber-200">
                      {result.reason ||
                        "The image does not provide enough visual information to determine whether the component meets the inspection requirement."}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Confidence Score:
                    </span>
                    <span className="text-base font-bold text-amber-600 font-mono">
                      {confidencePercentage}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Model & Source Note */}
            <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="inline-flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                {result.isDemoMode
                  ? "Demonstration Mode (Simulated AI)"
                  : `OpenAI Vision (${result.modelUsed || "gpt-4o-mini"})`}
              </span>
              <span>Suzlon QC Protocol</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons as requested: [Retake Image] [New Inspection] */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {(isNotOk || isReview) && (
          <button
            type="button"
            id="retake-image-btn"
            onClick={onRetakeImage}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Retake Image</span>
          </button>
        )}

        <button
          type="button"
          id="result-new-inspection-btn"
          onClick={onNewInspection}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-[#006F78] hover:bg-[#005a62] shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Inspection</span>
        </button>
      </div>
    </div>
  );
}
