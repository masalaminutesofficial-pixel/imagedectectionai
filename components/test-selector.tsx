"use client";

import React from "react";
import { TurbineModel, InspectionTest } from "@/config/inspection-tests";
import {
  ArrowLeft,
  CheckCircle2,
  Zap,
  Wrench,
  Layers,
  Tag,
  Shield,
  Eye,
  ArrowRight,
  Info
} from "lucide-react";

interface TestSelectorProps {
  model: TurbineModel;
  selectedTestName: string | null;
  onSelectTest: (test: InspectionTest) => void;
  onBack: () => void;
}

export function TestSelector({
  model,
  selectedTestName,
  onSelectTest,
  onBack
}: TestSelectorProps) {
  const getTestIcon = (category: string) => {
    switch (category) {
      case "Electrical":
        return <Zap className="w-4 h-4 text-amber-600" />;
      case "Mechanical":
        return <Wrench className="w-4 h-4 text-blue-600" />;
      case "Assembly":
        return <Layers className="w-4 h-4 text-indigo-600" />;
      case "Compliance":
        return <Tag className="w-4 h-4 text-emerald-600" />;
      case "Enclosure":
        return <Shield className="w-4 h-4 text-cyan-600" />;
      default:
        return <Eye className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between gap-4 mb-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Turbine Model</span>
          </button>

          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Selected: {model.name}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006F78] mb-1">
          <span>Step 2 of 3</span>
          <span>&bull;</span>
          <span>Inspection Test Selection</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Select Inspection Test
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Choose the quality assurance procedure for wind turbine model {model.name}.
        </p>
      </div>

      {/* Notice */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs text-slate-600">
        <Info className="w-4 h-4 text-[#006F78] shrink-0 mt-0.5" />
        <p>
          Each test evaluates a specific visual condition. The AI assistant will verify whether the uploaded photograph satisfies the specified expected condition.
        </p>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {model.tests.map((test) => {
          const isSelected = selectedTestName === test.name;

          return (
            <div
              key={test.id}
              id={`test-card-${test.id}`}
              onClick={() => onSelectTest(test)}
              className={`p-4 rounded-xl border transition-all cursor-pointer text-left bg-white ${
                isSelected
                  ? "border-[#006F78] ring-2 ring-[#006F78]/20 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-100 shrink-0">
                    {getTestIcon(test.category)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {test.name}
                    </h3>
                    <span className="text-[11px] font-medium text-slate-500">
                      {test.category} Inspection
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-[#006F78] shrink-0" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-50 shrink-0" />
                )}
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                {test.description}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                <span className="font-bold text-slate-800">Expected Condition: </span>
                <span className="text-slate-700 italic">{test.expectedCondition}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
