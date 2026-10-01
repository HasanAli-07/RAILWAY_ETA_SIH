import React from "react";
import { Radio, Satellite } from "lucide-react";

interface LiveGPSBadgeProps {
  isLive?: boolean;
  fixQuality?: "GAGAN_DIFFERENTIAL" | "GPS_3D" | "CELLULAR_ESTIMATE";
  lastSyncSec?: number;
  className?: string;
}

export const LiveGPSBadge: React.FC<LiveGPSBadgeProps> = ({
  isLive = true,
  fixQuality = "GAGAN_DIFFERENTIAL",
  lastSyncSec = 12,
  className = "",
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-[4px] border border-solid text-[11px] sm:text-xs font-mono transition-all whitespace-nowrap shrink-0 ${
        isLive
          ? "bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]"
          : "bg-[#FFF7ED] border-[#FED7AA] text-[#9A3412]"
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <span
          className={`w-2 h-2 rounded-full ${
            isLive ? "bg-[#1E5AA8] animate-radar" : "bg-[#EA580C]"
          }`}
        />
        {isLive && (
          <span className="absolute w-3.5 h-3.5 rounded-full border border-[#1E5AA8] animate-ping opacity-75" />
        )}
      </div>

      <div className="flex items-center gap-1">
        <Satellite className="w-3.5 h-3.5" />
        <span className="font-semibold">
          {fixQuality === "GAGAN_DIFFERENTIAL"
            ? "ISRO RTIS GAGAN"
            : fixQuality === "GPS_3D"
            ? "GPS 3D"
            : "Cellular Estimate"}
        </span>
        <span className="text-[#64748B] text-[11px] ml-0.5">
          ({lastSyncSec}s ago)
        </span>
      </div>
    </div>
  );
};
