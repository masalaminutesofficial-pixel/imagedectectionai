"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("turbine_qc_user");
    if (userStr) {
      router.replace("/inspection");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center text-slate-500 font-sans">
      <Loader2 className="w-8 h-8 animate-spin text-[#006F78] mb-2" />
      <span className="text-xs font-semibold text-slate-600">
        Initializing Wind Turbine Inspection Station...
      </span>
    </div>
  );
}
