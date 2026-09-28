"use client";

import React, { useState } from "react";
import { TrainService, StationNode } from "@/lib/simulation/railwayData";
import { DelayStatusBadge } from "@/components/ui/DelayStatusBadge";
import { LiveGPSBadge } from "@/components/ui/LiveGPSBadge";
import { ServiceClassPill } from "@/components/ui/ServiceClassPill";
import { StationTimelineNode } from "@/components/ui/StationTimelineNode";
import { ConformalIntervalBar } from "@/components/ui/ConformalIntervalBar";
import {
  Train,
  Share2,
  Calendar,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";

interface PassengerAppViewProps {
  trains: TrainService[];
  stations: StationNode[];
  selectedTrainId: string | null;
  onSelectTrain: (id: string) => void;
}

export const PassengerAppView: React.FC<PassengerAppViewProps> = ({
  trains,
  stations,
  selectedTrainId,
  onSelectTrain,
}) => {
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const selectedTrain = trains.find((t) => t.id === selectedTrainId) || trains[0];

  const nextStoppage =
    selectedTrain.stoppages.find((s) => s.status === "active" || s.status === "upcoming") ||
    selectedTrain.stoppages[selectedTrain.stoppages.length - 1];

  return (
    <div className="flex-1 bg-[#F8FAFC] p-4 flex flex-col items-center justify-start overflow-y-auto">
      {/* Mobile Smartphone / Web Container Frame */}
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-[16px] overflow-hidden shadow-lg flex flex-col my-auto">
        {/* Sticky Mobile App Header */}
        <div className="sticky top-0 z-20 bg-[#0F3875] text-white p-3.5 flex items-center justify-between border-b border-[#1E5AA8]">
          <div className="flex items-center gap-2">
            <select
              value={selectedTrain.id}
              onChange={(e) => onSelectTrain(e.target.value)}
              className="bg-[#1E5AA8] text-white font-mono font-bold text-xs px-2 py-1 rounded border border-white/20 focus:outline-none cursor-pointer"
            >
              {trains.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.number} - {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#60A5FA]" />
              28-Sep-2026
            </span>
            <button className="p-1 rounded hover:bg-white/10 text-white/80">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Status Summary Card */}
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono font-bold text-lg text-[#0F172A]">
                  {selectedTrain.number}
                </h2>
                <ServiceClassPill category={selectedTrain.category} />
              </div>
              <h3 className="text-sm font-semibold text-[#334155] mt-0.5">
                {selectedTrain.name}
              </h3>
            </div>
            <DelayStatusBadge delayMinutes={selectedTrain.currentDelayMinutes} size="md" />
          </div>

          {/* Headline Dynamic ETA */}
          <div className="bg-white p-3.5 rounded-[8px] border border-[#E2E8F0] shadow-sm space-y-2">
            <div className="text-xs text-[#64748B] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#1E5AA8]" />
              <span>AI Dynamic Arrival Forecast:</span>
            </div>

            <div className="text-base font-bold text-[#0F172A] leading-snug">
              Expected at{" "}
              <span className="text-[#0F3875] underline decoration-[#3B82F6] decoration-2">
                {nextStoppage?.stationCode}
              </span>{" "}
              around{" "}
              <span className="font-mono text-xl text-[#0F3875] font-extrabold">
                {nextStoppage?.predictedEtaMedian}
              </span>
            </div>

            {/* 80% Conformal Prediction Range */}
            <ConformalIntervalBar
              lowerEta={nextStoppage?.lowerBoundEta || "18:29"}
              medianEta={nextStoppage?.predictedEtaMedian || "18:32"}
              upperEta={nextStoppage?.upperBoundEta || "18:36"}
              marginMinutes={nextStoppage?.marginMinutes || 4}
            />
          </div>

          {/* Satellite Telemetry Sync */}
          <div className="flex items-center justify-between text-xs">
            <LiveGPSBadge
              isLive={true}
              fixQuality={selectedTrain.gaganFixQuality}
              lastSyncSec={selectedTrain.lastSyncSecAgo}
            />
            <span className="font-mono text-[11px] text-[#64748B]">
              Speed: <span className="font-bold text-[#0F172A]">{selectedTrain.currentSpeedKmh} km/h</span>
            </span>
          </div>
        </div>

        {/* Contextual Delay Explanation Button */}
        <div className="px-4 py-2 bg-[#EFF6FF] border-b border-[#BFDBFE] flex items-center justify-between text-xs text-[#1E40AF]">
          <div className="flex items-center gap-1.5 font-medium">
            <HelpCircle className="w-4 h-4 text-[#1E5AA8]" />
            <span>Why is this train delayed?</span>
          </div>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="p-1 font-mono text-[11px] font-bold text-[#0F3875] hover:underline flex items-center gap-0.5"
          >
            {showExplanation ? "Hide Details" : "View Explanation"}
            {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expandable Delay Explanation Sheet */}
        {showExplanation && (
          <div className="p-4 bg-[#FFFBEB] border-b border-[#FDE68A] text-xs text-[#92400E] space-y-2 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold font-mono text-xs uppercase">
              <Info className="w-4 h-4 text-[#D97706]" />
              Operational Cause Breakdown
            </div>
            <p className="leading-relaxed">
              {selectedTrain.hasCautionOrder
                ? "Temporary Speed Restriction (TSR 30 km/h) enforced for track renewal civil works between Aligarh and Tundla."
                : selectedTrain.isFogActive
                ? "Dense radiation fog across division triggered GPS Fog-PASS speed limits (capped at 65 km/h) and doubled headway safety buffers."
                : selectedTrain.isLoopLineDiverted
                ? "Train held on station loop line for precedence overtake by higher priority Rajdhani service."
                : "Minor sectional running variation absorbed by upstream Traffic Recovery Time (TRT) margin."}
            </p>
            <div className="text-[11px] font-mono text-[#D97706] bg-white p-2 rounded border border-[#FDE68A]">
              Estimated Recovery: Projected to recover 3–5 minutes before reaching destination.
            </div>
          </div>
        )}

        {/* Vertical Station Journey Milestone Tracker */}
        <div className="p-4 space-y-1 overflow-y-auto max-h-[380px]">
          <h4 className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider mb-3">
            Live Station Progression Tracker
          </h4>

          {selectedTrain.stoppages.map((st, idx) => (
            <StationTimelineNode
              key={st.stationCode}
              stationCode={st.stationCode}
              stationName={st.stationCode === "NDLS" ? "New Delhi" : st.stationCode === "GZB" ? "Ghaziabad" : st.stationCode === "ALJN" ? "Aligarh" : st.stationCode === "TDL" ? "Tundla" : st.stationCode === "CNB" ? "Kanpur Central" : st.stationCode === "PRYJ" ? "Prayagraj" : "Station"}
              distanceKm={(idx + 1) * 120}
              scheduledTime={st.scheduledArrival}
              actualOrPredictedTime={st.predictedEtaMedian}
              delayMinutes={st.delayMinutes}
              status={st.status}
              platform={st.platformAssigned}
              isLast={idx === selectedTrain.stoppages.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
