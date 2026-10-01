import React from "react";
import { CheckCircle2, Clock, Train } from "lucide-react";

export type NodeStatus = "passed" | "active" | "upcoming";

interface StationTimelineNodeProps {
  stationCode: string;
  stationName: string;
  distanceKm: number;
  scheduledTime: string; // e.g. "18:18"
  actualOrPredictedTime: string; // e.g. "18:32"
  delayMinutes: number;
  status: NodeStatus;
  platform?: string;
  isLast?: boolean;
}

export const StationTimelineNode: React.FC<StationTimelineNodeProps> = ({
  stationCode,
  stationName,
  distanceKm,
  scheduledTime,
  actualOrPredictedTime,
  delayMinutes,
  status,
  platform = "PF 1",
  isLast = false,
}) => {
  return (
    <div className="relative flex items-start gap-4 pb-6 group">
      {/* Connecting Vertical Track Line */}
      {!isLast && (
        <div
          className={`absolute left-[15px] top-6 bottom-0 w-[2px] ${
            status === "passed"
              ? "bg-[#94A3B8]"
              : status === "active"
              ? "bg-[#1E5AA8]"
              : "bg-[#E2E8F0]"
          }`}
        />
      )}

      {/* Node Icon Status */}
      <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#CBD5E1]">
        {status === "passed" ? (
          <CheckCircle2 className="w-5 h-5 text-[#64748B] fill-[#F1F5F9]" />
        ) : status === "active" ? (
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#EFF6FF] border border-[#1E5AA8]">
            <Train className="w-4 h-4 text-[#1E5AA8]" />
            <span className="absolute w-full h-full rounded-full border border-[#1E5AA8] animate-ping opacity-60" />
          </div>
        ) : (
          <div className="w-3 h-3 rounded-full border-2 border-[#CBD5E1] bg-white" />
        )}
      </div>

      {/* Content Block */}
      <div className="flex-1 flex flex-row items-center justify-between bg-white border border-[#E2E8F0] p-2.5 sm:p-3 rounded-[8px] hover:border-[#CBD5E1] transition-all gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="font-mono font-bold text-[#0F172A] text-xs sm:text-sm">
              {stationCode}
            </span>
            <span className="text-xs sm:text-sm font-medium text-[#475569] truncate">
              {stationName}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-[#94A3B8] bg-[#F1F5F9] px-1.5 py-0.5 rounded shrink-0">
              {distanceKm} KM
            </span>
          </div>

          <div className="text-[11px] sm:text-xs text-[#64748B] mt-0.5 flex items-center gap-1.5">
            <span>{platform}</span>
            <span>•</span>
            <span className="font-mono">STA: {scheduledTime}</span>
          </div>
        </div>

        {/* ETA & Delay Badge */}
        <div className="text-right flex flex-col items-end shrink-0">
          <div className="font-mono font-bold text-xs sm:text-sm text-[#0F3875]">
            {actualOrPredictedTime}
          </div>
          {delayMinutes > 0 ? (
            <span className="text-[10px] sm:text-[11px] font-mono text-[#D97706]">
              +{delayMinutes}m delay
            </span>
          ) : (
            <span className="text-[10px] sm:text-[11px] font-mono text-[#059669]">
              On Time
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
