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
  User,
  LogOut,
  ChevronDown,
  Building2,
  Lock,
} from "lucide-react";
import { LiveGPSBadge } from "@/components/ui/LiveGPSBadge";
import { useAuth, UserRole } from "@/lib/auth/AuthContext";
import { LoginModal } from "@/components/auth/LoginModal";

export type ConsoleMode = "CONTROLLER" | "STATION_MASTER" | "PASSENGER" | "MLOPS";

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
  const { user, logout, showLoginModal, setShowLoginModal, loginAsRole } = useAuth();
  const [timeStr, setTimeStr] = useState<string>("");
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

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
    <>
      <header className="sticky top-0 z-40 bg-[#0F3875] text-white border-b border-[#1E5AA8] shadow-md font-sans">
        {/* Top Application Bar */}
        <div className="max-w-[1920px] mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-lg text-white">
              <Train className="w-5 h-5 text-[#60A5FA]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-outfit font-extrabold text-base tracking-wide text-white">
                  DTAPE <span className="font-normal text-white/70 text-sm">| Indian Railways</span>
                </h1>
                <span className="bg-[#1E5AA8] text-white/90 text-[10px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                  SRS-IR-2026
                </span>
              </div>
              <p className="text-[11px] text-blue-200/80 font-mono truncate max-w-[220px] sm:max-w-none">
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

            <LiveGPSBadge isLive={true} fixQuality="GAGAN_DIFFERENTIAL" lastSyncSec={12} />

            <span className="text-xs font-mono text-blue-200/90 hidden lg:inline">
              Active Locos: <span className="font-bold text-white">{activeLocoCount}</span>
            </span>
          </div>

          {/* Right Role Switcher & User Profile Dropdown */}
          <div className="flex items-center gap-3">
            {/* Persona Quick Mode Switcher */}
            <div className="flex items-center gap-1 bg-black/30 p-1 rounded-[6px] border border-white/10">
              <button
                onClick={() => {
                  onModeChange("PASSENGER");
                  if (user?.role !== "PASSENGER") loginAsRole("PASSENGER");
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  currentMode === "PASSENGER"
                    ? "bg-[#1E5AA8] text-white font-outfit font-bold shadow-sm"
                    : "text-blue-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span className="hidden sm:inline">Passenger</span>
              </button>

              <button
                onClick={() => {
                  onModeChange("CONTROLLER");
                  if (user?.role !== "CONTROLLER") loginAsRole("CONTROLLER");
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  currentMode === "CONTROLLER"
                    ? "bg-[#1E5AA8] text-white font-outfit font-bold shadow-sm"
                    : "text-blue-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span className="hidden sm:inline">Controller</span>
              </button>

              <button
                onClick={() => {
                  onModeChange("STATION_MASTER");
                  if (user?.role !== "STATION_MASTER") loginAsRole("STATION_MASTER");
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  currentMode === "STATION_MASTER"
                    ? "bg-[#1E5AA8] text-white font-outfit font-bold shadow-sm"
                    : "text-blue-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span className="hidden sm:inline">Station Master</span>
              </button>

              <button
                onClick={() => {
                  onModeChange("MLOPS");
                  if (user?.role !== "MLOPS") loginAsRole("MLOPS");
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  currentMode === "MLOPS"
                    ? "bg-[#1E5AA8] text-white font-outfit font-bold shadow-sm"
                    : "text-blue-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span className="hidden sm:inline">MLOps Admin</span>
              </button>
            </div>

            {/* Authenticated User Avatar Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-[6px] bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-[#1E5AA8] text-white font-bold text-xs flex items-center justify-center border border-white/40 font-mono">
                  {user?.name ? user.name.charAt(0) : "P"}
                </div>
                <div className="hidden xl:block text-left">
                  <span className="block text-xs font-outfit font-bold leading-tight text-white">
                    {user?.name || "Passenger"}
                  </span>
                  <span className="block text-[10px] font-mono text-blue-200/80 leading-none">
                    {user?.designation || "Public Portal"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-white/80" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-[8px] shadow-xl text-[#0F172A] p-2 z-50 animate-fadeIn">
                  <div className="p-2 border-b border-[#E2E8F0]">
                    <p className="font-outfit font-bold text-sm text-[#0F3875]">{user?.name}</p>
                    <p className="text-xs text-[#64748B] font-mono">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono bg-[#EFF6FF] text-[#1E40AF] px-1.5 py-0.5 rounded border border-[#BFDBFE]">
                      {user?.designation} • {user?.stationOrZone}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowLoginModal(true);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-[#334155] hover:bg-[#F1F5F9] rounded flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-[#1E5AA8]" />
                      Switch Role / Login Portal
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-[#DC2626] hover:bg-[#FEF2F2] rounded flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-[#DC2626]" />
                      Logout / Reset Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};
