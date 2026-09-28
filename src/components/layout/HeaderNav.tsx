"use client";

import React, { useState, useEffect } from "react";
import {
  Train,
  Activity,
  LayoutDashboard,
  Smartphone,
  ShieldCheck,
  Search,
  Clock,
  Radio,
} from "lucide-react";
import { LiveGPSBadge } from "@/components/ui/LiveGPSBadge";

export type ConsoleMode =
  | "CONTROLLER"
  | "STATION_MASTER"
  | "PASSENGER"
  | "MLOPS";

interface HeaderNavProps {
  currentMode: ConsoleMode;
  onModeChange: (mode: ConsoleMode) => void;
  activeCorridor?: string;
  activeLocoCount?: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentMode,
  onModeChange,
  activeCorridor = "NDLS - HWH (New Delhi - Howrah Trunk)",
  activeLocoCount = 142,
}) => {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-IN", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " IST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0F3875] text-white border-b border-[#1E5AA8] shadow-md">
      {/* Top Application Bar */}
      <div className="max-w-[1920px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          {/* Emblem Badge */}
          <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-lg text-white">
            <Train className="w-5 h-5 text-[#60A5FA]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm tracking-wide text-white font-sans">
                DTAPE <span className="font-normal text-white/70">| Indian Railways</span>
              </h1>
              <span className="bg-[#1E5AA8] text-white/90 text-[10px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider">
                SRS-IR-2026
              </span>
            </div>
            <p className="text-[11px] text-blue-200/80 font-mono truncate max-w-[280px] sm:max-w-none">
              Corridor: {activeCorridor}
            </p>
          </div>
        </div>

        {/* Center Live Telemetry & Digital Clock */}
        <div className="hidden md:flex items-center gap-4 bg-black/20 px-3 py-1 rounded-[6px] border border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-100">
            <Clock className="w-3.5 h-3.5 text-[#60A5FA]" />
            <span className="font-bold">{timeStr || "14:23:18 IST"}</span>
          </div>

          <div className="h-3 w-[1px] bg-white/20" />

          <LiveGPSBadge
            isLive={true}
            fixQuality="GAGAN_DIFFERENTIAL"
            lastSyncSec={12}
          />

          <span className="text-xs font-mono text-blue-200/90 hidden lg:inline">
            Active Locos: <span className="font-bold text-white">{activeLocoCount}</span>
          </span>
        </div>

        {/* Right Role Switcher */}
        <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-[6px] border border-white/10">
          <button
            onClick={() => onModeChange("CONTROLLER")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              currentMode === "CONTROLLER"
                ? "bg-[#1E5AA8] text-white shadow-sm font-semibold"
                : "text-blue-200 hover:text-white hover:bg-white/10"
            }`}
            title="Section Train Controller Desk"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Controller Desk</span>
          </button>

          <button
            onClick={() => onModeChange("STATION_MASTER")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              currentMode === "STATION_MASTER"
                ? "bg-[#1E5AA8] text-white shadow-sm font-semibold"
                : "text-blue-200 hover:text-white hover:bg-white/10"
            }`}
            title="Station Master & Berthing Grid"
          >
            <Train className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Station Berthing</span>
          </button>

          <button
            onClick={() => onModeChange("PASSENGER")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              currentMode === "PASSENGER"
                ? "bg-[#1E5AA8] text-white shadow-sm font-semibold"
                : "text-blue-200 hover:text-white hover:bg-white/10"
            }`}
            title="Passenger Journey Tracker"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Passenger App</span>
          </button>

          <button
            onClick={() => onModeChange("MLOPS")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              currentMode === "MLOPS"
                ? "bg-[#1E5AA8] text-white shadow-sm font-semibold"
                : "text-blue-200 hover:text-white hover:bg-white/10"
            }`}
            title="MLOps Drift & Model Diagnostics"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MLOps Health</span>
          </button>
        </div>
      </div>
    </header>
  );
};
