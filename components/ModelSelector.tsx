"use client";

import React from "react";
import { TURBINE_MODELS, TurbineModelConfig } from "@/config/inspectionTests";
import { Wind, ArrowRight, Gauge, Check } from "lucide-react";

interface ModelSelectorProps {
  selectedModelId: string | null;
  onSelectModel: (model: TurbineModelConfig) => void;
}

export function ModelSelector({
  selectedModelId,
  onSelectModel
}: ModelSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#006F78] mb-1">
          <span>Step 1 of 4</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Select Wind Turbine Model
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Choose the turbine series undergoing quality verification.
        </p>
      </div>

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
                  ? "border-[#006F78] ring-2 ring-[#006F78]/20 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                      isSelected
                        ? "bg-[#006F78] text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {model.name}
                    </h3>
                    <span className="text-xs font-medium text-slate-500">
                      {model.series} &bull; {model.rating}
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <span className="w-6 h-6 rounded-full bg-[#006F78] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-60" />
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                {model.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="inline-flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-[#006F78]" />
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
