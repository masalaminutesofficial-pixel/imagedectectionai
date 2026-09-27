"use client";

import React from "react";
import { TURBINE_MODELS, TurbineModel } from "@/config/inspection-tests";
import { Wind, ArrowRight, Gauge, Check, Info } from "lucide-react";

interface ModelSelectorProps {
  selectedModelId: string | null;
  onSelectModel: (model: TurbineModel) => void;
}

export function ModelSelector({
  selectedModelId,
  onSelectModel
}: ModelSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006F78] mb-1">
          <span>Step 1 of 3</span>
          <span>&bull;</span>
          <span>Model Selection</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Select Wind Turbine Model
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Choose the turbine platform undergoing visual quality inspection. S175 is configured as the primary demo platform.
        </p>
      </div>

      {/* Engineering Disclaimer */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs text-slate-600">
        <Info className="w-4 h-4 text-[#006F78] shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-800">Engineering Notice:</strong> Model specifications and tests are illustrative placeholders for demonstration and are configurable to match certified manufacturer inspection work instructions.
        </p>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TURBINE_MODELS.map((model) => {
          const isSelected = selectedModelId === model.id;

          return (
            <div
              key={model.id}
              id={`model-card-${model.id}`}
              onClick={() => onSelectModel(model)}
              className={`p-5 rounded-xl border transition-all cursor-pointer relative text-left bg-white ${
                isSelected
                  ? "border-[#006F78] ring-2 ring-[#006F78]/20 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                      isSelected
                        ? "bg-[#006F78] text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        {model.name}
                      </h3>
                      {model.isPrimaryDemo && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-[#006F78] border border-[#006F78]/20">
                          Primary Demo
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {model.series} &bull; {model.rating}
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <span className="w-6 h-6 rounded-full bg-[#006F78] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                ) : (
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-60" />
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                {model.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="inline-flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-[#006F78]" />
                  Rotor: {model.rotorDiameter}
                </span>
                <span>{model.tests.length} Standard Tests</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
