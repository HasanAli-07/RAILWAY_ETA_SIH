"use client";

import React, { useState } from "react";
import { HeaderNav, ConsoleMode } from "@/components/layout/HeaderNav";
import { useTelemetryStore } from "@/lib/simulation/useTelemetryStore";
import { ControllerDeskView } from "@/components/views/ControllerDeskView";
import { StationMasterView } from "@/components/views/StationMasterView";
import { PassengerAppView } from "@/components/views/PassengerAppView";
import { MlopsDiagnosticsView } from "@/components/views/MlopsDiagnosticsView";

export default function Home() {
  const [currentMode, setCurrentMode] = useState<ConsoleMode>("CONTROLLER");

  const telemetry = useTelemetryStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Application Navigation Header */}
      <HeaderNav
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        activeCorridor={telemetry.activeCorridor}
        activeLocoCount={telemetry.activeLocoCount}
      />

      {/* Main Console View Switcher */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {currentMode === "CONTROLLER" && (
          <ControllerDeskView
            trains={telemetry.trains}
            stations={telemetry.stations}
            selectedTrainId={telemetry.selectedTrainId}
            onSelectTrain={telemetry.setSelectedTrain}
            activeDisruption={telemetry.activeDisruption}
            onTriggerDisruption={telemetry.triggerDisruption}
          />
        )}

        {currentMode === "STATION_MASTER" && (
          <StationMasterView
            trains={telemetry.trains}
            stations={telemetry.stations}
            selectedStationCode={telemetry.selectedStationCode}
            onSelectStation={telemetry.setSelectedStation}
          />
        )}

        {currentMode === "PASSENGER" && (
          <PassengerAppView
            trains={telemetry.trains}
            stations={telemetry.stations}
            selectedTrainId={telemetry.selectedTrainId}
            onSelectTrain={telemetry.setSelectedTrain}
          />
        )}

        {currentMode === "MLOPS" && (
          <MlopsDiagnosticsView
            inferenceLatencyMs={telemetry.inferenceLatencyMs}
            graphRefreshSec={telemetry.graphRefreshSec}
            psiDataDrift={telemetry.psiDataDrift}
            conformalCoveragePct={telemetry.conformalCoveragePct}
            fallbackActive={telemetry.fallbackActive}
            onToggleFallback={telemetry.toggleFallbackMode}
          />
        )}
      </main>
    </div>
  );
}
