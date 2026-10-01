"use client";

import React, { useState } from "react";
import { TrainService, StationNode } from "@/lib/simulation/railwayData";
import { TimeDistanceChart } from "@/components/charts/TimeDistanceChart";
import { CorridorMap } from "@/components/maps/CorridorMap";
import { DelayStatusBadge } from "@/components/ui/DelayStatusBadge";
import { ServiceClassPill } from "@/components/ui/ServiceClassPill";
import { ConformalIntervalBar } from "@/components/ui/ConformalIntervalBar";
import {
  Search,
  Train,
  Gauge,
  AlertTriangle,
  Radio,
  ChevronRight,
  Filter,
  CheckCircle,
  XCircle,
  LayoutDashboard,
  Info,
  List,
  MapPin,
  Navigation,
} from "lucide-react";

interface ControllerDeskViewProps {
  trains: TrainService[];
  stations: StationNode[];
  selectedTrainId: string | null;
  onSelectTrain: (id: string) => void;
  activeDisruption: string;
  onTriggerDisruption: (type: any) => void;
}

export const ControllerDeskView: React.FC<ControllerDeskViewProps> = ({
  trains,
  stations,
  selectedTrainId,
  onSelectTrain,
  activeDisruption,
  onTriggerDisruption,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobileTab, setMobileTab] = useState<"CHART" | "MAP" | "ROSTER" | "INSPECTOR">("CHART");
  const [centerViewMode, setCenterViewMode] = useState<"CHART" | "MAP">("CHART");

  const filteredTrains = trains.filter((t) => {
    const matchesSearch =
      t.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterCategory === "PRIORITY") {
      return t.category === "VANDE_BHARAT" || t.category === "RAJDHANI";
    }
    if (filterCategory === "EXPRESS") {
      return t.category === "SUPERFAST" || t.category === "MAIL_EXPRESS";
    }
    if (filterCategory === "FREIGHT") {
      return t.category === "FREIGHT";
    }
    return true;
  });

  const selectedTrain = trains.find((t) => t.id === selectedTrainId) || trains[0];

  return (
    <div className="flex-1 flex flex-col p-2 sm:p-3 md:p-4 max-w-[1920px] mx-auto w-full min-h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto lg:overflow-hidden">
      {/* Mobile Tab Switcher (Visible on < 1024px viewports) */}
      <div className="lg:hidden flex items-center gap-1 mb-2 bg-[#E2E8F0] p-1 rounded-[8px] text-xs font-mono shrink-0 shadow-inner">
        <button
          onClick={() => {
            setMobileTab("CHART");
            setCenterViewMode("CHART");
          }}
          className={`flex-1 py-1.5 rounded-[6px] text-center font-bold transition-all flex items-center justify-center gap-1 ${
            mobileTab === "CHART" ? "bg-[#0F3875] text-white shadow-sm" : "text-[#475569] hover:bg-white/50"
          }`}
        >
          <span>📊 String Chart</span>
        </button>

        <button
          onClick={() => {
            setMobileTab("MAP");
            setCenterViewMode("MAP");
          }}
          className={`flex-1 py-1.5 rounded-[6px] text-center font-bold transition-all flex items-center justify-center gap-1 ${
            mobileTab === "MAP" ? "bg-[#0F3875] text-white shadow-sm" : "text-[#475569] hover:bg-white/50"
          }`}
        >
          <span>🗺️ GIS Map</span>
        </button>

        <button
          onClick={() => setMobileTab("ROSTER")}
          className={`flex-1 py-1.5 rounded-[6px] text-center font-bold transition-all flex items-center justify-center gap-1 ${
            mobileTab === "ROSTER" ? "bg-[#0F3875] text-white shadow-sm" : "text-[#475569] hover:bg-white/50"
          }`}
        >
          <span>🚆 Roster ({trains.length})</span>
        </button>

        <button
          onClick={() => setMobileTab("INSPECTOR")}
          className={`flex-1 py-1.5 rounded-[6px] text-center font-bold transition-all flex items-center justify-center gap-1 ${
            mobileTab === "INSPECTOR" ? "bg-[#0F3875] text-white shadow-sm" : "text-[#475569] hover:bg-white/50"
          }`}
        >
          <span>📋 Telemetry</span>
        </button>
      </div>

      {/* Main 3-Pane / Responsive Stack */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 md:gap-4 min-h-0 overflow-y-auto lg:overflow-hidden">
        {/* LEFT PANE: Train Roster & Filters */}
        <div
          className={`w-full lg:w-[320px] flex flex-col bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-sm shrink-0 min-h-[350px] lg:min-h-0 ${
            mobileTab !== "ROSTER" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Search & Filter Header */}
          <div className="p-3 border-b border-[#E2E8F0] bg-[#F8FAFC] space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Train # or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#CBD5E1] rounded-[6px] text-xs font-mono text-[#0F172A] focus:outline-none focus:border-[#1E5AA8]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-[11px] font-medium text-[#475569] overflow-x-auto pb-1">
              <button
                onClick={() => setFilterCategory("ALL")}
                className={`px-2 py-0.5 rounded whitespace-nowrap ${
                  filterCategory === "ALL"
                    ? "bg-[#0F3875] text-white"
                    : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                }`}
              >
                All ({trains.length})
              </button>
              <button
                onClick={() => setFilterCategory("PRIORITY")}
                className={`px-2 py-0.5 rounded whitespace-nowrap ${
                  filterCategory === "PRIORITY"
                    ? "bg-[#0F3875] text-white"
                    : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                }`}
              >
                Rajdhani/VB
              </button>
              <button
                onClick={() => setFilterCategory("EXPRESS")}
                className={`px-2 py-0.5 rounded whitespace-nowrap ${
                  filterCategory === "EXPRESS"
                    ? "bg-[#0F3875] text-white"
                    : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                }`}
              >
                Express
              </button>
              <button
                onClick={() => setFilterCategory("FREIGHT")}
                className={`px-2 py-0.5 rounded whitespace-nowrap ${
                  filterCategory === "FREIGHT"
                    ? "bg-[#0F3875] text-white"
                    : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                }`}
              >
                Freight
              </button>
            </div>
          </div>

          {/* Train Roster List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E2E8F0]">
            {filteredTrains.map((train) => {
              const isSelected = train.id === selectedTrain?.id;
              return (
                <div
                  key={train.id}
                  onClick={() => {
                    onSelectTrain(train.id);
                    setMobileTab("INSPECTOR"); // Jump to inspector on mobile
                  }}
                  className={`p-3 cursor-pointer transition-all hover:bg-[#F1F5F9] ${
                    isSelected ? "bg-[#EFF6FF] border-l-4 border-[#1E5AA8]" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#0F172A]">
                        {train.number}
                      </span>
                      <h3 className="text-xs font-semibold text-[#334155] truncate max-w-[180px]">
                        {train.name}
                      </h3>
                    </div>
                    <DelayStatusBadge delayMinutes={train.currentDelayMinutes} size="sm" />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-[#64748B] font-mono">
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-[#1E5AA8]" />
                      <span>{train.currentSpeedKmh} km/h</span>
                    </div>
                    <span>Next: {train.nextStationCode}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER PANE: Dynamic String Chart vs GIS Live Map */}
        <div
          className={`flex-1 min-w-0 flex-col h-full ${
            mobileTab !== "CHART" && mobileTab !== "MAP" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Desktop Subnav Mode Switcher Bar */}
          <div className="hidden lg:flex items-center justify-between mb-2 bg-[#F1F5F9] p-1.5 rounded-[8px] border border-[#CBD5E1] shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#0F172A] uppercase px-2">
                Center Console Mode:
              </span>
              <button
                onClick={() => setCenterViewMode("CHART")}
                className={`px-3 py-1 rounded-[6px] text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  centerViewMode === "CHART"
                    ? "bg-[#0F3875] text-white shadow-sm"
                    : "bg-white text-[#475569] hover:bg-[#F8FAFC] border border-[#CBD5E1]"
                }`}
              >
                <span>📊 60 FPS String Chart</span>
              </button>

              <button
                onClick={() => setCenterViewMode("MAP")}
                className={`px-3 py-1 rounded-[6px] text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  centerViewMode === "MAP"
                    ? "bg-[#0F3875] text-white shadow-sm"
                    : "bg-white text-[#475569] hover:bg-[#F8FAFC] border border-[#CBD5E1]"
                }`}
              >
                <span>🗺️ Live GIS Leaflet Map</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-[#64748B]">
              NDLS - HWH Trunk Line Telemetry Feed Active
            </span>
          </div>

          {/* Conditional View Rendering */}
          {centerViewMode === "CHART" && mobileTab !== "MAP" ? (
            <TimeDistanceChart
              trains={trains}
              stations={stations}
              selectedTrainId={selectedTrain?.id || null}
              onSelectTrain={onSelectTrain}
              activeDisruption={activeDisruption}
              onTriggerDisruption={onTriggerDisruption}
            />
          ) : (
            <CorridorMap
              trains={trains}
              stations={stations}
              selectedTrainId={selectedTrain?.id || null}
              onSelectTrain={onSelectTrain}
              activeDisruption={activeDisruption}
            />
          )}
        </div>

        {/* RIGHT PANE: Selected Train Telemetry Inspector */}
        <div
          className={`w-full lg:w-[380px] flex-col bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-sm shrink-0 ${
            mobileTab !== "INSPECTOR" ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="p-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Train className="w-4 h-4 text-[#0F3875]" />
              <span className="font-bold text-xs font-mono uppercase text-[#0F172A]">
                Telemetry Inspector
              </span>
            </div>
            <ServiceClassPill category={selectedTrain.category} />
          </div>

          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4">
            {/* Card 1: Train Kinematics & Loco ID */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-[6px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm md:text-base text-[#0F3875]">
                  {selectedTrain.number} - {selectedTrain.name}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#475569]">
                <div>
                  Loco ID: <span className="font-bold text-[#0F172A]">{selectedTrain.locoId}</span>
                </div>
                <div>
                  Speed: <span className="font-bold text-[#1E5AA8]">{selectedTrain.currentSpeedKmh} km/h</span>
                </div>
                <div>
                  Max MPS: <span className="font-bold text-[#0F172A]">{selectedTrain.mpsKmh} km/h</span>
                </div>
                <div>
                  Route: <span className="font-bold text-[#0F172A]">{selectedTrain.origin} ➔ {selectedTrain.destination}</span>
                </div>
              </div>
            </div>

            {/* Card 2: 80% Conformal Prediction Bounds */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-[6px] space-y-2">
              <span className="text-xs font-bold text-[#0F172A] uppercase font-mono tracking-wider">
                Conformal ETA Prediction Window
              </span>
              {selectedTrain.stoppages.length > 0 && (
                <ConformalIntervalBar
                  lowerEta={selectedTrain.stoppages[selectedTrain.stoppages.length - 1].lowerBoundEta}
                  medianEta={selectedTrain.stoppages[selectedTrain.stoppages.length - 1].predictedEtaMedian}
                  upperEta={selectedTrain.stoppages[selectedTrain.stoppages.length - 1].upperBoundEta}
                  marginMinutes={selectedTrain.stoppages[selectedTrain.stoppages.length - 1].marginMinutes}
                />
              )}
            </div>

            {/* Card 3: Domain Recovery Factor Explanation */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-[6px] space-y-2 text-xs text-[#475569]">
              <span className="font-bold text-[#0F172A] font-mono uppercase text-[11px]">
                Domain Recovery Factors Applied
              </span>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span>Engineering Allowance (EA):</span>
                  <span className="text-[#059669] font-semibold">+3.5 min recovery</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Traffic Recovery Time (TRT):</span>
                  <span className="text-[#059669] font-semibold">+5.0 min buffer</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Caution Orders (TSR):</span>
                  <span className={selectedTrain.hasCautionOrder ? "text-[#DC2626] font-semibold" : "text-[#64748B]"}>
                    {selectedTrain.hasCautionOrder ? "-6.0 min speed penalty" : "None"}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Downstream Station Arrival Schedule Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-[6px] overflow-hidden">
              <div className="bg-[#F8FAFC] px-3 py-2 border-b border-[#E2E8F0] font-mono text-xs font-bold text-[#0F172A]">
                Downstream Station Schedule & Dynamic ETAs
              </div>
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9] text-[#475569]">
                    <th className="p-2">Station</th>
                    <th className="p-2">STA</th>
                    <th className="p-2">ML ETA</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {selectedTrain.stoppages.map((st) => (
                    <tr key={st.stationCode} className="hover:bg-[#F8FAFC]">
                      <td className="p-2 font-bold text-[#0F172A]">{st.stationCode}</td>
                      <td className="p-2 text-[#64748B]">{st.scheduledArrival}</td>
                      <td className="p-2 font-bold text-[#0F3875]">{st.predictedEtaMedian}</td>
                      <td className="p-2">
                        {st.delayMinutes > 0 ? (
                          <span className="text-[#D97706]">+{st.delayMinutes}m</span>
                        ) : (
                          <span className="text-[#059669]">OK</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
