"use client";

import React from "react";
import { Wind, History, PlusCircle, LogOut, CheckCircle2, Cpu } from "lucide-react";

interface HeaderProps {
  user: { name: string; employeeId: string } | null;
  isLiveMode: boolean;
  onNewInspection: () => void;
  onOpenHistory: () => void;
  onLogout: () => void;
  historyCount: number;
}

export function Header({
  user,
  isLiveMode,
  onNewInspection,
  onOpenHistory,
  onLogout,
  historyCount
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#006F78] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                Suzlon Visual Inspection
              </span>
              {/* AI Mode Badge */}
              {isLiveMode ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Live AI Mode
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                  <Cpu className="w-3 h-3 text-[#006F78]" />
                  Demo AI Mode
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Wind Turbine Quality Assurance System
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            id="nav-new-inspection-btn"
            onClick={onNewInspection}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#006F78] hover:bg-[#005a62] text-white transition-colors cursor-pointer"
            title="Start New Inspection"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">New Inspection</span>
          </button>

          <button
            type="button"
            id="nav-history-btn"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 cursor-pointer relative"
            title="View Inspection History"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="bg-slate-700 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {historyCount}
              </span>
            )}
          </button>

          {user && (
            <div className="flex items-center pl-2 sm:pl-3 border-l border-slate-200 gap-2">
              <div className="text-right hidden md:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {user.employeeId}
                </p>
              </div>

              <button
                type="button"
                id="nav-logout-btn"
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
