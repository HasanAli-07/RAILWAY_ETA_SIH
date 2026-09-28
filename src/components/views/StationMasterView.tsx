"use client";

import React, { useState } from "react";
import { TrainService, StationNode } from "@/lib/simulation/railwayData";
import { ServiceClassPill } from "@/components/ui/ServiceClassPill";
import { DelayStatusBadge } from "@/components/ui/DelayStatusBadge";
import {
  Train,
  AlertOctagon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Navigation,
} from "lucide-react";

interface StationMasterViewProps {
  trains: TrainService[];
  stations: StationNode[];
  selectedStationCode: string;
  onSelectStation: (code: string) => void;
}

export const StationMasterView: React.FC<StationMasterViewProps> = ({
  trains,
  stations,
  selectedStationCode,
  onSelectStation,
}) => {
  const currentStation =
    stations.find((s) => s.code === selectedStationCode) || stations[4]; // Default CNB

  // Build platform grid data (Platforms 1 to platformCount)
  const platforms = Array.from({ length: currentStation.platformCount }, (_, i) => {
    const pfNumber = `PF ${i + 1}`;

    // Find train berthed at this platform
    const berthedTrain = trains.find((t) =>
      t.stoppages.some(
        (s) =>
          s.stationCode === currentStation.code &&
          s.platformAssigned === pfNumber &&
          (s.status === "active" || s.status === "passed")
      )
    );

    // Find next incoming train
    const incomingTrain = trains.find((t) =>
      t.stoppages.some(
        (s) =>
          s.stationCode === currentStation.code &&
          s.platformAssigned === pfNumber &&
          s.status === "upcoming"
      )
    );

    // Check conflict (if delayed arrival overlaps existing berthed train departure)
    const hasConflict = berthedTrain && incomingTrain && incomingTrain.currentDelayMinutes > 15;

    return {
      pfNumber,
      berthedTrain,
      incomingTrain,
      hasConflict,
    };
  });

  // Approaching trains within 30 km zone
  const approachingTrains = trains.filter((t) =>
    t.stoppages.some((s) => s.stationCode === currentStation.code && s.status !== "passed")
  );

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 max-w-[1920px] mx-auto w-full h-[calc(100vh-3.5rem)] overflow-hidden bg-[#F8FAFC]">
      {/* Top Station Ribbon */}
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-[8px] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[6px] bg-[#0F3875] text-white flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5 text-[#60A5FA]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <select
                value={selectedStationCode}
                onChange={(e) => onSelectStation(e.target.value)}
                className="font-bold text-base text-[#0F172A] bg-[#F1F5F9] border border-[#CBD5E1] px-3 py-1 rounded-[6px] focus:outline-none font-mono cursor-pointer"
              >
                {stations.map((st) => (
                  <option key={st.code} value={st.code}>
                    {st.code} - {st.name} ({st.zone} Zone / {st.division} Div)
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Station Code: <span className="font-mono font-bold text-[#0F172A]">{currentStation.code}</span> | Latitude: {currentStation.latitude} N, Longitude: {currentStation.longitude} E
            </p>
          </div>
        </div>

        {/* Station Stats */}
        <div className="flex items-center gap-6 font-mono text-xs text-[#475569]">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-[6px]">
            Total Platforms: <span className="font-bold text-[#0F172A] text-sm">{currentStation.platformCount}</span>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-[6px]">
            Tracks Occupied: <span className="font-bold text-[#1E5AA8] text-sm">{currentStation.occupiedPlatforms} / {currentStation.platformCount}</span>
          </div>

          <div className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] px-3 py-1.5 rounded-[6px] flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            Yard Throat Clearance: CLEAR
          </div>
        </div>
      </div>

      {/* Main 2-Pane Split: Left Platform Grid vs Right Approach Zone */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 overflow-hidden">
        {/* LEFT: 10-Platform Berthing Grid */}
        <div className="flex-1 bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-sm flex flex-col">
          <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
            <h2 className="font-mono font-bold text-xs uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
              <Train className="w-4 h-4 text-[#0F3875]" />
              Platform Track Berthing Grid ({currentStation.code})
            </h2>
            <span className="text-xs font-mono text-[#64748B]">
              Real-time Berth Occupancy & Platform Throat Overlaps
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {platforms.map((pf) => (
              <div
                key={pf.pfNumber}
                className={`p-3 rounded-[6px] border transition-all ${
                  pf.hasConflict
                    ? "bg-[#FEF2F2] border-[#FECACA]"
                    : pf.berthedTrain
                    ? "bg-[#EFF6FF] border-[#BFDBFE]"
                    : "bg-[#F8FAFC] border-[#E2E8F0]"
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  {/* Platform Number Pill */}
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-10 rounded-[6px] bg-[#0F3875] text-white font-mono font-bold text-sm flex items-center justify-center shrink-0">
                      {pf.pfNumber}
                    </span>

                    <div>
                      {pf.berthedTrain ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-[#0F172A]">
                              {pf.berthedTrain.number}
                            </span>
                            <span className="text-xs font-semibold text-[#334155]">
                              {pf.berthedTrain.name}
                            </span>
                            <ServiceClassPill category={pf.berthedTrain.category} />
                          </div>
                          <p className="text-xs font-mono text-[#64748B] mt-0.5">
                            Status: <span className="font-bold text-[#0F3875]">CURRENTLY BERTHED</span> | Speed: {pf.berthedTrain.currentSpeedKmh} km/h
                          </p>
                        </div>
                      ) : (
                        <div className="text-xs font-mono text-[#94A3B8]">
                          Platform Track Clear • Available for Berthing
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Next Incoming Train & Conflict Status */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    {pf.incomingTrain && (
                      <div className="text-right">
                        <span className="text-[11px] font-mono text-[#64748B] block">
                          Next Incoming: {pf.incomingTrain.number}
                        </span>
                        <span className="font-mono font-bold text-xs text-[#0F3875]">
                          ETA: {pf.incomingTrain.stoppages.find((s) => s.stationCode === currentStation.code)?.predictedEtaMedian || "10:14"}
                        </span>
                      </div>
                    )}

                    {pf.hasConflict ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#DC2626] text-white font-mono font-bold text-xs">
                        <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
                        OVERLAP CONFLICT
                      </span>
                    ) : pf.berthedTrain ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#DBEAFE] text-[#1E40AF] font-mono text-xs">
                        Occupied
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#ECFDF5] text-[#065F46] font-mono text-xs">
                        Vacant
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Approach Zone Countdown Drawer (Width: 380px) */}
        <div className="w-full lg:w-[380px] bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-sm flex flex-col shrink-0">
          <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#1E5AA8]" />
              Station Approach Zone (30 KM)
            </h3>
            <span className="text-[11px] font-mono bg-[#EFF6FF] text-[#1E40AF] px-2 py-0.5 rounded">
              {approachingTrains.length} Approaching
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {approachingTrains.map((train) => {
              const stoppage = train.stoppages.find((s) => s.stationCode === currentStation.code);

              return (
                <div
                  key={train.id}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-[6px] hover:border-[#CBD5E1] transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#0F172A]">
                        {train.number}
                      </span>
                      <p className="text-xs font-semibold text-[#334155] truncate max-w-[200px]">
                        {train.name}
                      </p>
                    </div>
                    <DelayStatusBadge delayMinutes={train.currentDelayMinutes} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-[#475569] bg-white p-2 rounded border border-[#E2E8F0]">
                    <div>
                      Home Signal ETA: <span className="font-bold text-[#0F3875]">{stoppage?.predictedEtaMedian || "10:14"}</span>
                    </div>
                    <div>
                      Assigned: <span className="font-bold text-[#1E5AA8]">{stoppage?.platformAssigned || "PF 1"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                    <span>Speed: {train.currentSpeedKmh} km/h</span>
                    <span className="text-[#059669] font-medium">Throat Clearance OK</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
