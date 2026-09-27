"use client";

import React, { useState } from "react";
import { ShieldCheck, Wind, ArrowRight, Lock, User, AlertCircle } from "lucide-react";

interface LoginScreenProps {
  onLogin: (user: { name: string; employeeId: string; role: string }) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [employeeId, setEmployeeId] = useState("TECH-8492");
  const [password, setPassword] = useState("suzlon2026");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId.trim()) {
      setError("Please enter your Employee ID or Email.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    // Mock successful authentication
    onLogin({
      name: employeeId.includes("@") ? employeeId.split("@")[0] : "Quality Inspector",
      employeeId: employeeId.trim(),
      role: "Certified QC Specialist"
    });
  };

  const handleDemoFill = () => {
    setEmployeeId("QA-TECH-8492");
    setPassword("inspect2026");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 text-slate-900">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#006F78] text-white shadow-sm mb-4">
            <Wind className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Turbine Visual Inspection
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manufacturing &amp; Quality Control Division
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2 pb-4 mb-5 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-[#006F78]" />
            <h2 className="text-base font-semibold text-slate-800">
              Inspector Authorization
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="employeeId"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Employee ID / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="employeeId"
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. QA-TECH-8492"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006F78] focus:bg-white text-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006F78] focus:bg-white text-slate-900"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              className="w-full mt-2 py-2.5 px-4 bg-[#006F78] hover:bg-[#005a62] text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo helper */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Demo authentication enabled</span>
            <button
              type="button"
              id="fill-demo-credentials-btn"
              onClick={handleDemoFill}
              className="text-[#006F78] hover:underline font-medium cursor-pointer"
            >
              Fill Credentials
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Suzlon Industrial AI Visual Inspection Demo &bull; v1.0
        </p>
      </div>
    </div>
  );
}
