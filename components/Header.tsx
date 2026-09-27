"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wind, History, PlusCircle, LogOut, Sparkles, Cpu } from "lucide-react";
import { InspectionHistoryModal, InspectionRecord } from "@/components/InspectionHistoryModal";

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; employeeId: string } | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<InspectionRecord[]>([]);

  useEffect(() => {
    // Check user session
    const savedUser = localStorage.getItem("turbine_qc_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // ignore
      }
    }

    // Check Gemini API live status
    fetch("/api/inspect")
      .then((res) => res.json())
      .then((data) => {
        if (data?.isLiveMode) {
          setIsLiveMode(true);
        }
      })
      .catch(() => {});

    // Check history
    const savedHistory = localStorage.getItem("turbine_qc_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("turbine_qc_user");
    setUser(null);
    router.push("/login");
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("turbine_qc_history");
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/inspection" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-[#006F78] flex items-center justify-center text-white shrink-0 shadow-xs group-hover:bg-[#005a62] transition-colors">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                  Wind Turbine Visual Inspection
                </span>
                {isLiveMode ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Gemini Live Mode
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                    <Cpu className="w-3 h-3 text-[#006F78]" />
                    Demo AI Mode
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Industrial Quality Control &bull; Gemini 2.5 Flash
              </p>
            </div>
          </Link>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              id="header-new-inspection-btn"
              onClick={() => router.push("/inspection?step=model")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#006F78] hover:bg-[#005a62] text-white transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Inspection</span>
            </button>

            <button
              type="button"
              id="header-history-btn"
              onClick={() => {
                const refreshed = localStorage.getItem("turbine_qc_history");
                if (refreshed) {
                  try {
                    setHistory(JSON.parse(refreshed));
                  } catch {}
                }
                setHistoryOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
            >
              <History className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">History</span>
              {history.length > 0 && (
                <span className="bg-slate-700 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {history.length}
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
                  id="header-logout-btn"
                  onClick={handleLogout}
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

      {/* History Modal */}
      <InspectionHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        records={history}
        onClearHistory={handleClearHistory}
      />
    </>
  );
}
