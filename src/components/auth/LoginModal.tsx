"use client";

import React from "react";
import { useAuth, UserRole, PRESET_USERS } from "@/lib/auth/AuthContext";
import {
  Train,
  LayoutDashboard,
  Smartphone,
  Activity,
  ShieldCheck,
  X,
  Lock,
  User,
  ArrowRight,
} from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAsRole, user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-[16px] shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#0F3875] text-white p-5 flex items-center justify-between border-b border-[#1E5AA8]">
          <div className="flex items-center gap-3">
            <img
              src="/railvista-logo.svg"
              alt="RAILVISTA Logo"
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 p-0.5 object-contain shadow-sm shrink-0"
            />
            <div>
              <h2 className="font-outfit font-bold text-lg text-white">
                Select Operational Role / Login Portal
              </h2>
              <p className="text-xs text-blue-200/90 font-mono">
                Indian Railways RAILVISTA Unified Access System (SRS-IR-ETA-2026)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:bg-white/10 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Cards List */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto bg-[#F8FAFC]">
          <div className="text-xs text-[#64748B] font-mono">
            Select a verified credential profile below to switch your dashboard context and view role-tailored features:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Role 1: Passenger */}
            <div
              onClick={() => {
                loginAsRole("PASSENGER");
                onClose();
              }}
              className={`p-4 rounded-[12px] border transition-all cursor-pointer bg-white hover:shadow-md hover:border-[#1E5AA8] group ${
                user?.role === "PASSENGER" ? "border-2 border-[#1E5AA8] bg-[#EFF6FF]" : "border-[#E2E8F0]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-[8px] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-[#1E5AA8]" />
                </div>
                <span className="text-[11px] font-mono font-bold bg-[#ECFDF5] text-[#065F46] px-2 py-0.5 rounded border border-[#A7F3D0]">
                  Public Access
                </span>
              </div>
              <h3 className="font-outfit font-bold text-sm text-[#0F172A] group-hover:text-[#0F3875] flex items-center justify-between">
                Public Passenger Portal
                <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1E5AA8] group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Ultra-clean journey tracker, arrival windows, platform numbers, and friendly delay explanations. Hides raw system logs.
              </p>
            </div>

            {/* Role 2: Section Controller */}
            <div
              onClick={() => {
                loginAsRole("CONTROLLER");
                onClose();
              }}
              className={`p-4 rounded-[12px] border transition-all cursor-pointer bg-white hover:shadow-md hover:border-[#0F3875] group ${
                user?.role === "CONTROLLER" ? "border-2 border-[#0F3875] bg-[#EFF6FF]" : "border-[#E2E8F0]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-[8px] bg-[#0F3875] text-white flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-[#60A5FA]" />
                </div>
                <span className="text-[11px] font-mono font-bold bg-[#0F3875] text-white px-2 py-0.5 rounded">
                  Auth Required
                </span>
              </div>
              <h3 className="font-outfit font-bold text-sm text-[#0F172A] group-hover:text-[#0F3875] flex items-center justify-between">
                Section Train Controller
                <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0F3875] group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                3-Pane 60 FPS Canvas Time-Distance Control Chart, signal aspects, What-If simulator, and telemetry inspector.
              </p>
              <div className="mt-2 text-[11px] font-mono text-[#475569] bg-[#F1F5F9] px-2 py-1 rounded">
                Account: controller.delhi@railways.gov.in
              </div>
            </div>

            {/* Role 3: Station Master */}
            <div
              onClick={() => {
                loginAsRole("STATION_MASTER");
                onClose();
              }}
              className={`p-4 rounded-[12px] border transition-all cursor-pointer bg-white hover:shadow-md hover:border-[#1E5AA8] group ${
                user?.role === "STATION_MASTER" ? "border-2 border-[#1E5AA8] bg-[#EFF6FF]" : "border-[#E2E8F0]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-[8px] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
                  <Train className="w-4 h-4 text-[#0F3875]" />
                </div>
                <span className="text-[11px] font-mono font-bold bg-[#0F3875] text-white px-2 py-0.5 rounded">
                  Auth Required
                </span>
              </div>
              <h3 className="font-outfit font-bold text-sm text-[#0F172A] group-hover:text-[#0F3875] flex items-center justify-between">
                Station Master Console
                <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1E5AA8] group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                10-Platform Berthing Grid, yard throat clearance status, and 30 km station approach countdown queue.
              </p>
              <div className="mt-2 text-[11px] font-mono text-[#475569] bg-[#F1F5F9] px-2 py-1 rounded">
                Account: stationmaster.cnb@railways.gov.in
              </div>
            </div>

            {/* Role 4: MLOps Admin */}
            <div
              onClick={() => {
                loginAsRole("MLOPS");
                onClose();
              }}
              className={`p-4 rounded-[12px] border transition-all cursor-pointer bg-white hover:shadow-md hover:border-[#0F3875] group ${
                user?.role === "MLOPS" ? "border-2 border-[#0F3875] bg-[#EFF6FF]" : "border-[#E2E8F0]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-[8px] bg-[#F1F5F9] border border-[#CBD5E1] flex items-center justify-center">
                  <Activity className="w-4 h-4 text-[#0F3875]" />
                </div>
                <span className="text-[11px] font-mono font-bold bg-[#0F3875] text-white px-2 py-0.5 rounded">
                  Admin Security
                </span>
              </div>
              <h3 className="font-outfit font-bold text-sm text-[#0F172A] group-hover:text-[#0F3875] flex items-center justify-between">
                MLOps & System Health Admin
                <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0F3875] group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Model latency SLAs (&lt;50ms), PSI Data Drift meters, Triton ONNX GPU status, and Graceful Fallback controls.
              </p>
              <div className="mt-2 text-[11px] font-mono text-[#475569] bg-[#F1F5F9] px-2 py-1 rounded">
                Account: mlops.lead@cris.org.in
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#E2E8F0] flex items-center justify-between text-xs font-mono text-[#64748B]">
          <span>Role-Based Access Control (RBAC) Enabled</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] rounded-[6px] font-semibold hover:bg-[#E2E8F0]"
          >
            Continue Current View
          </button>
        </div>
      </div>
    </div>
  );
};
