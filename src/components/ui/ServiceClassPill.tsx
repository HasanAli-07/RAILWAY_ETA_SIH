import React from "react";
import { Train, Zap, Shield, Box } from "lucide-react";

export type ServiceClass =
  | "VANDE_BHARAT"
  | "RAJDHANI"
  | "SHATABDI"
  | "SUPERFAST"
  | "MAIL_EXPRESS"
  | "SUBURBAN"
  | "FREIGHT";

interface ServiceClassPillProps {
  category: ServiceClass;
  className?: string;
}

export const ServiceClassPill: React.FC<ServiceClassPillProps> = ({
  category,
  className = "",
}) => {
  const configMap: Record<
    ServiceClass,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    VANDE_BHARAT: {
      label: "Vande Bharat Express",
      bg: "bg-[#0F3875]",
      text: "text-white",
      border: "border-[#1E5AA8]",
      icon: <Zap className="w-3 h-3 text-[#F59E0B]" />,
    },
    RAJDHANI: {
      label: "Tejas Rajdhani Express",
      bg: "bg-[#0F3875]",
      text: "text-white",
      border: "border-[#3B82F6]",
      icon: <Shield className="w-3 h-3 text-[#60A5FA]" />,
    },
    SHATABDI: {
      label: "Shatabdi Express",
      bg: "bg-[#1E5AA8]",
      text: "text-white",
      border: "border-[#60A5FA]",
      icon: <Train className="w-3 h-3 text-white" />,
    },
    SUPERFAST: {
      label: "Superfast Express",
      bg: "bg-[#F1F5F9]",
      text: "text-[#0F172A]",
      border: "border-[#CBD5E1]",
      icon: <Train className="w-3 h-3 text-[#1E5AA8]" />,
    },
    MAIL_EXPRESS: {
      label: "Mail / Express",
      bg: "bg-[#F8FAFC]",
      text: "text-[#475569]",
      border: "border-[#E2E8F0]",
      icon: <Train className="w-3 h-3 text-[#64748B]" />,
    },
    SUBURBAN: {
      label: "Suburban Commuter",
      bg: "bg-[#F1F5F9]",
      text: "text-[#334155]",
      border: "border-[#CBD5E1]",
      icon: <Train className="w-3 h-3 text-[#475569]" />,
    },
    FREIGHT: {
      label: "Freight Rake (DFC)",
      bg: "bg-[#FEF3C7]",
      text: "text-[#92400E]",
      border: "border-[#FDE68A]",
      icon: <Box className="w-3 h-3 text-[#D97706]" />,
    },
  };

  const config = configMap[category] || configMap.MAIL_EXPRESS;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] border border-solid text-[11px] font-medium ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};
