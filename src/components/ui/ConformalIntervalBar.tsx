import React from "react";
import { ShieldCheck } from "lucide-react";

interface ConformalIntervalBarProps {
  lowerEta: string; // e.g. "18:29"
  medianEta: string; // e.g. "18:32"
  upperEta: string; // e.g. "18:36"
  marginMinutes?: number;
  coveragePct?: number; // default 80
  className?: string;
  showLabels?: boolean;
}

export const ConformalIntervalBar: React.FC<ConformalIntervalBarProps> = ({
  lowerEta,
  medianEta,
  upperEta,
  marginMinutes = 4,
  coveragePct = 80,
  className = "",
  showLabels = true,
}) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {/* Visual Bar Container */}
      <div className="relative w-full h-2.5 bg-[#E2E8F0] rounded-[4px] overflow-hidden flex items-center">
        {/* Shaded Conformal 10th-to-90th Percentile Interval Range */}
        <div
          className="absolute h-full bg-[#BFDBFE] border-x border-[#3B82F6]/30"
          style={{ left: "20%", right: "20%" }}
        />
        {/* Median Predicted Pin */}
        <div
          className="absolute h-full w-1 bg-[#0F3875] z-10 shadow-sm"
          style={{ left: "50%", transform: "translateX(-50%)" }}
        />
      </div>

      {/* Accessible Subtext Labels */}
      {showLabels && (
        <div className="flex items-center justify-between text-xs text-[#475569]">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E5AA8]" />
            <span className="font-medium text-[#0F172A]">
              Median ETA: <span className="font-mono font-bold text-[#0F3875]">{medianEta}</span>
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#64748B]">
            Range: {lowerEta} – {upperEta} ({coveragePct}% verified ±{marginMinutes}m)
          </span>
        </div>
      )}
    </div>
  );
};
