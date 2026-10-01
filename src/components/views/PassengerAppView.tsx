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
  Search,
  CheckCircle2,
  Navigation,
  ArrowRight,
} from "lucide-react";

import { CorridorMap } from "@/components/maps/CorridorMap";

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
  const [showLiveMap, setShowLiveMap] = useState<boolean>(false);
  const [passengerSearch, setPassengerSearch] = useState<string>("");

  const selectedTrain = trains.find((t) => t.id === selectedTrainId) || trains[0];

  const filteredTrains = trains.filter(
    (t) =>
      t.number.toLowerCase().includes(passengerSearch.toLowerCase()) ||
      t.name.toLowerCase().includes(passengerSearch.toLowerCase())
  );

  const nextStoppage =
    selectedTrain.stoppages.find((s) => s.status === "active" || s.status === "upcoming") ||
    selectedTrain.stoppages[selectedTrain.stoppages.length - 1];

  return (
    <div className="flex-1 bg-[#F8FAFC] p-2 sm:p-4 md:p-6 flex flex-col items-center justify-start overflow-y-auto min-h-[calc(100vh-3.5rem)] w-full max-w-full overflow-x-hidden">
      {/* Top Banner / Passenger Welcome */}
      <div className="w-full max-w-2xl mb-3 sm:mb-6 text-center space-y-1 px-1">
        <h2 className="font-outfit font-extrabold text-lg sm:text-2xl md:text-3xl text-[#0F3875] tracking-tight">
          Indian Railways Passenger Live Tracking
        </h2>
        <p className="text-[11px] sm:text-xs md:text-sm text-[#475569] font-sans">
          ISRO RTIS Satellite Telemetry & Bounded AI Arrival Windows
        </p>

        {/* Quick Search Input */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-4.5" />
          <input
            type="text"
            placeholder="Search Train # (e.g. 12952) or Name..."
            value={passengerSearch}
            onChange={(e) => setPassengerSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#CBD5E1] rounded-[10px] text-xs sm:text-sm font-mono text-[#0F172A] shadow-sm focus:outline-none focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20 transition-all"
          />

          {passengerSearch && (
            <div className="absolute left-0 right-0 top-12 bg-white border border-[#E2E8F0] rounded-[10px] shadow-xl z-40 max-h-56 overflow-y-auto text-left divide-y divide-[#E2E8F0]">
              {filteredTrains.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    onSelectTrain(t.id);
                    setPassengerSearch("");
                  }}
                  className="p-2.5 sm:p-3 hover:bg-[#EFF6FF] cursor-pointer flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#0F3875]">{t.number}</span>
                    <span className="text-xs text-[#334155] ml-2 truncate inline-block max-w-[150px] sm:max-w-none">{t.name}</span>
                  </div>
                  <DelayStatusBadge delayMinutes={t.currentDelayMinutes} size="sm" className="shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile / Web Passenger Journey Card Container */}
      <div className="w-full max-w-xl bg-white border border-[#E2E8F0] rounded-[12px] sm:rounded-[16px] overflow-hidden shadow-lg sm:shadow-xl flex flex-col mb-8">
        {/* Header Bar */}
        <div className="bg-[#0F3875] text-white p-3 sm:p-4 flex items-center justify-between border-b border-[#1E5AA8] gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="/railvista-logo.svg"
              alt="RAILVISTA Logo"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 border border-white/20 p-0.5 object-contain shrink-0"
            />
            <span className="font-outfit font-bold text-xs sm:text-sm tracking-wide text-white truncate">
              {selectedTrain.number} - {selectedTrain.name}
            </span>
          </div>

          <div className="flex items-center shrink-0">
            <span className="bg-white/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-xs flex items-center gap-1 font-mono font-medium">
              <Calendar className="w-3 h-3 text-[#60A5FA]" />
              28-Sep-2026
            </span>
          </div>
        </div>

        {/* Hero Status Card */}
        <div className="p-3.5 sm:p-5 bg-gradient-to-b from-[#F8FAFC] to-white border-b border-[#E2E8F0] space-y-3">
          {/* Mobile-Friendly Train Identity & Status Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="min-w-0 w-full sm:w-auto">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="font-mono font-extrabold text-lg sm:text-2xl text-[#0F172A]">
                  {selectedTrain.number}
                </span>
                <ServiceClassPill category={selectedTrain.category} />
              </div>
              <h3 className="text-xs sm:text-base font-outfit font-bold text-[#334155] mt-0.5 truncate">
                {selectedTrain.name}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#64748B] font-mono mt-0.5">
                Route: <span className="font-bold text-[#0F172A]">{selectedTrain.origin} ➔ {selectedTrain.destination}</span>
              </p>
            </div>

            {/* Delay Badge cleanly anchored */}
            <div className="shrink-0 self-start sm:self-auto pt-0.5 sm:pt-0">
              <DelayStatusBadge delayMinutes={selectedTrain.currentDelayMinutes} size="md" className="whitespace-nowrap" />
            </div>
          </div>

          {/* Headline Arrival Box */}
          <div className="bg-white p-3 sm:p-4 rounded-[10px] sm:rounded-[12px] border border-[#E2E8F0] shadow-sm space-y-2.5">
            <div className="text-[11px] sm:text-xs text-[#64748B] flex items-center justify-between gap-1">
              <span className="flex items-center gap-1 font-medium text-[#1E5AA8]">
                <Sparkles className="w-3.5 h-3.5 text-[#1E5AA8]" />
                Live Predicted Arrival:
              </span>
              <span className="font-mono text-[11px] sm:text-xs font-bold text-[#0F3875] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE] shrink-0">
                Platform {nextStoppage?.platformAssigned || "PF 1"}
              </span>
            </div>

            <div className="text-base sm:text-xl font-outfit font-extrabold text-[#0F172A] leading-snug">
              Expected at{" "}
              <span className="text-[#0F3875] underline decoration-[#3B82F6] decoration-2">
                {nextStoppage?.stationCode}
              </span>{" "}
              around{" "}
              <span className="font-mono text-xl sm:text-3xl text-[#0F3875] font-black inline-block ml-1">
                {nextStoppage?.predictedEtaMedian}
              </span>
            </div>

            {/* Conformal Arrival Window */}
            <ConformalIntervalBar
              lowerEta={nextStoppage?.lowerBoundEta || "18:29"}
              medianEta={nextStoppage?.predictedEtaMedian || "18:32"}
              upperEta={nextStoppage?.upperBoundEta || "18:36"}
              marginMinutes={nextStoppage?.marginMinutes || 4}
            />
          </div>

          {/* Live Telemetry Bar - Fully Responsive Mobile Stack */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
            <LiveGPSBadge
              isLive={true}
              fixQuality={selectedTrain.gaganFixQuality}
              lastSyncSec={selectedTrain.lastSyncSecAgo}
              className="shrink-0"
            />
            
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
              <span className="font-mono text-[11px] sm:text-xs text-[#475569] bg-white px-2 py-1 rounded border border-[#E2E8F0]">
                Speed: <strong className="text-[#0F172A]">{selectedTrain.currentSpeedKmh} km/h</strong>
              </span>
              <button
                onClick={() => setShowLiveMap(!showLiveMap)}
                className="font-mono text-[11px] font-bold text-[#0F3875] bg-[#EFF6FF] px-2.5 py-1 rounded border border-[#BFDBFE] hover:bg-[#DBEAFE] transition-all whitespace-nowrap shrink-0 flex items-center gap-1"
              >
                <span>{showLiveMap ? "Hide Map" : "🗺️ Live Map"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Leaflet GIS Map Drawer */}
        {showLiveMap && (
          <div className="p-2 sm:p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] h-[300px] sm:h-[360px] animate-fadeIn">
            <CorridorMap
              trains={trains}
              stations={stations}
              selectedTrainId={selectedTrain.id}
              onSelectTrain={onSelectTrain}
            />
          </div>
        )}

        {/* Friendly Delay Explanation Drawer Toggle */}
        <div className="px-3 sm:px-5 py-2.5 bg-[#EFF6FF] border-b border-[#BFDBFE] flex items-center justify-between text-xs text-[#1E40AF] gap-2">
          <div className="flex items-center gap-1.5 font-medium font-outfit text-xs sm:text-sm min-w-0">
            <HelpCircle className="w-4 h-4 text-[#1E5AA8] shrink-0" />
            <span className="truncate">Why is my train running delayed?</span>
          </div>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="p-1 font-mono text-[11px] sm:text-xs font-bold text-[#0F3875] hover:underline flex items-center gap-1 bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-[#BFDBFE] whitespace-nowrap shrink-0"
          >
            <span>{showExplanation ? "Hide" : "Reason"}</span>
            {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expandable Explanation Details */}
        {showExplanation && (
          <div className="p-3.5 sm:p-5 bg-[#FFFBEB] border-b border-[#FDE68A] text-xs text-[#92400E] space-y-2 font-sans animate-fadeIn">
            <div className="flex items-center gap-1.5 font-outfit font-bold text-xs sm:text-sm text-[#D97706]">
              <Info className="w-4 h-4 text-[#D97706] shrink-0" />
              Official Delay Reason
            </div>
            <p className="leading-relaxed text-[11px] sm:text-xs">
              {selectedTrain.hasCautionOrder
                ? "Temporary Speed Restriction (TSR 30 km/h) enforced for essential track renewal work between Aligarh and Tundla."
                : selectedTrain.isFogActive
                ? "Dense radiation fog across division triggered GPS Fog-PASS speed limits (65 km/h cap) and doubled headway safety buffers."
                : selectedTrain.isLoopLineDiverted
                ? "Train temporarily diverted to station loop line to allow higher priority Rajdhani service to overtake on main line."
                : "Minor running variation absorbed by upstream Traffic Recovery Time (TRT) margin."}
            </p>
            <div className="text-[11px] sm:text-xs font-mono text-[#D97706] bg-white p-2 rounded-[6px] border border-[#FDE68A] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              <span>Schedule Recovery: Projected to recover 4 minutes before reaching destination.</span>
            </div>
          </div>
        )}

        {/* Milestone Station Timeline */}
        <div className="p-3.5 sm:p-5 space-y-2">
          <h4 className="font-outfit font-bold text-xs sm:text-sm text-[#0F172A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-[#1E5AA8]" />
            Live Station Milestone Tracker
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
