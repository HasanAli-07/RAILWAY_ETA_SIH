import React from "react";

export type DelaySeverity = "ontime" | "minor" | "significant" | "critical";

interface DelayStatusBadgeProps {
  delayMinutes: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function getDelaySeverity(minutes: number): DelaySeverity {
  if (minutes <= 5) return "ontime";
  if (minutes <= 15) return "minor";
  if (minutes <= 60) return "significant";
  return "critical";
}

export const DelayStatusBadge: React.FC<DelayStatusBadgeProps> = ({
  delayMinutes,
  className = "",
  size = "md",
}) => {
  const severity = getDelaySeverity(delayMinutes);

  const styleMap: Record<
    DelaySeverity,
    { bg: string; border: string; text: string; label: string }
  > = {
    ontime: {
      bg: "bg-[#ECFDF5]",
      border: "border-[#A7F3D0]",
      text: "text-[#065F46]",
      label: delayMinutes <= 0 ? "On Time" : `Right Time (${delayMinutes}m)`,
    },
    minor: {
      bg: "bg-[#FFFBEB]",
      border: "border-[#FDE68A]",
      text: "text-[#92400E]",
      label: `Minor Delay (+${delayMinutes} min)`,
    },
    significant: {
      bg: "bg-[#FFF7ED]",
      border: "border-[#FED7AA]",
      text: "text-[#9A3412]",
      label: `Significant (+${delayMinutes} min)`,
    },
    critical: {
      bg: "bg-[#FEF2F2]",
      border: "border-[#FECACA]",
      text: "text-[#991B1B]",
      label: `Critical Delay (+${delayMinutes} min)`,
    },
  };

  const config = styleMap[severity];

  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-xs font-mono font-medium rounded-[4px]",
    md: "px-2 py-1 text-xs font-mono font-semibold rounded-[4px]",
    lg: "px-3 py-1.5 text-sm font-mono font-bold rounded-[6px]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-solid ${config.bg} ${config.border} ${config.text} ${sizeStyles[size]} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          severity === "ontime"
            ? "bg-[#059669]"
            : severity === "minor"
            ? "bg-[#D97706]"
            : severity === "significant"
            ? "bg-[#EA580C]"
            : "bg-[#DC2626]"
        }`}
      />
      {config.label}
    </span>
  );
};
