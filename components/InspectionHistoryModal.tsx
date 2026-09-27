"use client";

import React from "react";
import { InspectionStatus } from "@/lib/ai/provider";
import { X, Check, AlertTriangle, Trash2, Calendar, User, Gauge } from "lucide-react";

export interface InspectionRecord {
  id: string;
  timestamp: string;
  user: string;
  model: string;
  test: string;
  result: InspectionStatus;
  confidence: number;
  conclusion: string;
  imageThumbnail?: string;
}

interface InspectionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: InspectionRecord[];
  onClearHistory: () => void;
  onSelectRecord?: (record: InspectionRecord) => void;
}

export function InspectionHistoryModal({
  isOpen,
  onClose,
  records,
  onClearHistory
}: InspectionHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Inspection History Log
            </h3>
            <p className="text-xs text-slate-500">
              Recent quality evaluations conducted on this workstation
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto flex-1 divide-y divide-slate-100">
          {records.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium text-slate-600">No inspections recorded yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Completed inspections will automatically be archived here.
              </p>
            </div>
          ) : (
            records.map((record) => {
              const isOk = record.result === "OK";
              const isNotOk = record.result === "NOT_OK";

              return (
                <div key={record.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Status Icon */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isOk
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : isNotOk
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-amber-100 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {isOk ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : isNotOk ? (
                        <X className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {record.test}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-100 text-slate-700">
                          {record.model}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                        {record.conclusion}
                      </p>

                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-mono">
                        <span className="inline-flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {record.user}
                        </span>
                        <span>&bull;</span>
                        <span>{new Date(record.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${
                        isOk
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : isNotOk
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {record.result}
                    </span>
                    <p className="text-[11px] text-slate-500 font-mono mt-1">
                      {Math.round(record.confidence * 100)}% Conf.
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClearHistory}
            disabled={records.length === 0}
            className="text-xs text-slate-500 hover:text-red-600 disabled:opacity-40 disabled:hover:text-slate-500 inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
