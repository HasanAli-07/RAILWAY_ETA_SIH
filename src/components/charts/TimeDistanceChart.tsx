"use client";

import React, { useRef, useEffect, useState } from "react";
import { TrainService, StationNode } from "@/lib/simulation/railwayData";
import { AlertTriangle, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";

interface TimeDistanceChartProps {
  trains: TrainService[];
  stations: StationNode[];
  selectedTrainId: string | null;
  onSelectTrain: (id: string) => void;
  activeDisruption: string;
  onTriggerDisruption: (type: any) => void;
}

export const TimeDistanceChart: React.FC<TimeDistanceChartProps> = ({
  trains,
  stations,
  selectedTrainId,
  onSelectTrain,
  activeDisruption,
  onTriggerDisruption,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredTrain, setHoveredTrain] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const render = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set high DPI canvas resolution based on container bounding rect
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width || 600;
      const height = rect.height || 420;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Responsive padding
      const isMobile = width < 640;
      const padding = {
        top: 35,
        right: isMobile ? 15 : 30,
        bottom: 35,
        left: isMobile ? 45 : 70,
      };
      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;

      // Clear canvas
      ctx.fillStyle = "#F8FAFC";
      ctx.fillRect(0, 0, width, height);

      // Render Grid & Stations Y-Axis
      const maxKm = 1447;
      stations.forEach((st, idx) => {
        const y = padding.top + (st.distanceKm / maxKm) * chartH;

        // Horizontal station line
        ctx.beginPath();
        ctx.strokeStyle = idx % 2 === 0 ? "#E2E8F0" : "#F1F5F9";
        ctx.lineWidth = 1;
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        // Station Label
        ctx.fillStyle = "#0F172A";
        ctx.font = isMobile ? "bold 9px monospace" : "bold 11px monospace";
        ctx.textAlign = "right";
        ctx.fillText(st.code, padding.left - (isMobile ? 4 : 10), y + 3);

        if (!isMobile) {
          ctx.fillStyle = "#64748B";
          ctx.font = "9px sans-serif";
          ctx.fillText(`${st.distanceKm}k`, padding.left - 42, y + 3);
        }
      });

      // Time X-Axis Grid (Past 2 hours to Next 4 hours)
      const timeSlots = ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
      timeSlots.forEach((tStr, idx) => {
        const x = padding.left + (idx / (timeSlots.length - 1)) * chartW;

        ctx.beginPath();
        ctx.strokeStyle = "#E2E8F0";
        ctx.setLineDash([3, 3]);
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, height - padding.bottom);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#475569";
        ctx.font = isMobile ? "9px monospace" : "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(tStr, x, height - padding.bottom + 16);
      });

      // Draw Train Trajectories
      trains.forEach((train) => {
        const isSelected = train.id === selectedTrainId;
        const isHovered = train.id === hoveredTrain;

        // Calculate path coordinates across stations
        const points: { x: number; y: number; isPassed: boolean; etaMin: string; etaMax: string }[] = [];
        train.stoppages.forEach((stp, sIdx) => {
          const stNode = stations.find((s) => s.code === stp.stationCode);
          const km = stNode ? stNode.distanceKm : 0;
          const y = padding.top + (km / maxKm) * chartH;

          // Map time to X
          const timeRatio = Math.min(1, Math.max(0, (sIdx + 1) / train.stoppages.length));
          const x = padding.left + timeRatio * chartW;

          points.push({
            x,
            y,
            isPassed: stp.status === "passed",
            etaMin: stp.lowerBoundEta,
            etaMax: stp.upperBoundEta,
          });
        });

        if (points.length < 2) return;

        // Color selection
        let color = "#1E5AA8"; // Default blue
        if (train.category === "VANDE_BHARAT" || train.category === "RAJDHANI") {
          color = "#0F3875";
        } else if (train.category === "FREIGHT") {
          color = "#D97706";
        } else if (train.category === "SUBURBAN") {
          color = "#64748B";
        }
        if (train.currentDelayMinutes > 15) color = "#EA580C";
        if (train.currentDelayMinutes > 30) color = "#DC2626";

        // 1. Draw Shaded 80% Conformal Prediction Interval Band
        ctx.beginPath();
        ctx.fillStyle = isSelected ? "rgba(191, 219, 254, 0.45)" : "rgba(226, 232, 240, 0.3)";
        ctx.moveTo(points[0].x - 8, points[0].y);
        points.forEach((pt) => ctx.lineTo(pt.x + 8, pt.y));
        for (let i = points.length - 1; i >= 0; i--) {
          ctx.lineTo(points[i].x - 8, points[i].y);
        }
        ctx.closePath();
        ctx.fill();

        // 2. Draw Historical Solid Trajectory (Realized RTIS)
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = isSelected ? 3.5 : isHovered ? 2.5 : 2;
        ctx.setLineDash([]);

        const activeIdx = points.findIndex((pt) => !pt.isPassed);
        const passedPoints = activeIdx > 0 ? points.slice(0, activeIdx + 1) : [points[0]];

        ctx.moveTo(passedPoints[0].x, passedPoints[0].y);
        passedPoints.forEach((pt) => ctx.lineTo(pt.x, pt.y));
        ctx.stroke();

        // 3. Draw Predicted Dotted Trajectory (ML Inference)
        const futurePoints = activeIdx >= 0 ? points.slice(activeIdx) : points;
        if (futurePoints.length > 0) {
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = isSelected ? 3 : 1.8;
          ctx.setLineDash([5, 4]);

          ctx.moveTo(futurePoints[0].x, futurePoints[0].y);
          futurePoints.forEach((pt) => ctx.lineTo(pt.x, pt.y));
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // 4. Draw Train Position Node Marker
        const activePt = points[Math.max(0, activeIdx >= 0 ? activeIdx : points.length - 1)];
        ctx.beginPath();
        ctx.arc(activePt.x, activePt.y, isSelected ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Train Label Tag
        ctx.fillStyle = isSelected ? "#0F3875" : "#334155";
        ctx.font = isSelected ? (isMobile ? "bold 9px monospace" : "bold 11px monospace") : (isMobile ? "8px monospace" : "10px monospace");
        ctx.textAlign = "left";
        ctx.fillText(`${train.number}`, activePt.x + 6, activePt.y + 3);
      });

      // Draw Platform Conflict Diamond Alerts (e.g. near CNB/PRYJ)
      if (activeDisruption !== "NONE") {
        const conflictY = padding.top + (440 / maxKm) * chartH; // CNB
        const conflictX = padding.left + 0.55 * chartW;

        ctx.beginPath();
        ctx.fillStyle = "#EA580C";
        ctx.moveTo(conflictX, conflictY - 7);
        ctx.lineTo(conflictX + 7, conflictY);
        ctx.lineTo(conflictX, conflictY + 7);
        ctx.lineTo(conflictX - 7, conflictY);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    render();

    // Use ResizeObserver for responsive canvas updates on resize
    const resizeObserver = new ResizeObserver(() => {
      render();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [trains, stations, selectedTrainId, hoveredTrain, activeDisruption]);

  return (
    <div className="flex flex-col h-full bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-sm">
      {/* Top Controls & Status Header */}
      <div className="p-2.5 sm:p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Sparkles className="w-4 h-4 text-[#1E5AA8] shrink-0" />
          <span className="font-bold text-xs text-[#0F172A] tracking-tight uppercase font-mono">
            Digital String Chart (NDLS - HWH)
          </span>
          <span className="hidden md:inline bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] text-[10px] font-mono px-2 py-0.5 rounded">
            60 FPS Canvas Realized vs RSTGCN Prediction
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] font-mono text-[#475569]">
          <div className="flex items-center gap-1">
            <span className="w-3 h-[2px] bg-[#0F3875]" />
            <span>RTIS</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-[2px] bg-[#0F3875] border-t border-dashed border-[#0F3875]" />
            <span>ML ETA</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2 bg-[#BFDBFE] rounded-[2px]" />
            <span>80% CQR</span>
          </div>
        </div>
      </div>

      {/* Disruption Warning Banner */}
      {activeDisruption !== "NONE" && (
        <div className="bg-[#FFF7ED] border-b border-[#FED7AA] px-3 py-2 flex flex-wrap items-center justify-between text-xs text-[#9A3412] gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#EA580C] shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs">
              {activeDisruption === "OHE_POWER_DROP" && "OVERHEAD EQUIPMENT (OHE) VOLTAGE DROP: Primary delay active near Kanpur Central."}
              {activeDisruption === "FOG_ALERT" && "DENSE RADIATION FOG (FOG-PASS ACTIVE): Speed capped at 65 km/h across affected zones."}
              {activeDisruption === "TSR_ALJN_TDL" && "TEMPORARY SPEED RESTRICTION (TSR 30 KM/H): Active between Aligarh & Tundla."}
              {activeDisruption === "OVERTAKE_HOLD" && "PRECEDENCE OVERTAKE DIVERSIOIN: MEMU passenger diverted to loop line for Rajdhani overtake."}
            </span>
          </div>
          <button
            onClick={() => onTriggerDisruption("NONE")}
            className="text-[10px] sm:text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-[#FED7AA] text-[#9A3412] hover:bg-[#FFF7ED] shrink-0"
          >
            Clear Disruption
          </button>
        </div>
      )}

      {/* Interactive Canvas Work Area */}
      <div ref={containerRef} className="relative flex-1 min-h-[300px] sm:min-h-[360px] lg:min-h-[400px] w-full bg-[#F8FAFC]">
        <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
      </div>

      {/* Interactive "What-If" Scenario Simulator Controls */}
      <div className="p-2.5 sm:p-3 bg-[#F1F5F9] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[#0F172A] font-semibold shrink-0">
          <ShieldAlert className="w-4 h-4 text-[#1E5AA8]" />
          <span>"What-If" Scenario Dispatch Simulator:</span>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => onTriggerDisruption("OHE_POWER_DROP")}
            className={`px-2 py-1 rounded text-[11px] font-mono border transition-all text-center truncate ${
              activeDisruption === "OHE_POWER_DROP"
                ? "bg-[#EA580C] text-white border-[#EA580C]"
                : "bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]"
            }`}
          >
            ⚡ OHE Power Failure (+22m)
          </button>

          <button
            onClick={() => onTriggerDisruption("FOG_ALERT")}
            className={`px-2 py-1 rounded text-[11px] font-mono border transition-all text-center truncate ${
              activeDisruption === "FOG_ALERT"
                ? "bg-[#1E5AA8] text-white border-[#1E5AA8]"
                : "bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]"
            }`}
          >
            🌫️ Fog-PASS (65 km/h)
          </button>

          <button
            onClick={() => onTriggerDisruption("TSR_ALJN_TDL")}
            className={`px-2 py-1 rounded text-[11px] font-mono border transition-all text-center truncate ${
              activeDisruption === "TSR_ALJN_TDL"
                ? "bg-[#D97706] text-white border-[#D97706]"
                : "bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]"
            }`}
          >
            🚧 TSR Caution (30 km/h)
          </button>

          <button
            onClick={() => onTriggerDisruption("OVERTAKE_HOLD")}
            className={`px-2 py-1 rounded text-[11px] font-mono border transition-all text-center truncate ${
              activeDisruption === "OVERTAKE_HOLD"
                ? "bg-[#0F3875] text-white border-[#0F3875]"
                : "bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]"
            }`}
          >
            🔀 Loop Line Overtake
          </button>

          {activeDisruption !== "NONE" && (
            <button
              onClick={() => onTriggerDisruption("NONE")}
              className="p-1 rounded text-[#64748B] hover:text-[#0F172A] hidden sm:block"
              title="Reset Simulation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
