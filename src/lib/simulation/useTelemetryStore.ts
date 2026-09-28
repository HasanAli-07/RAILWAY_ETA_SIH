"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TRUNK_STATIONS,
  INITIAL_TRAINS,
  TrainService,
  StationNode,
} from "./railwayData";

export interface TelemetryState {
  trains: TrainService[];
  stations: StationNode[];
  activeCorridor: string;
  activeLocoCount: number;
  isSimulating: boolean;
  selectedTrainId: string | null;
  selectedStationCode: string;
  activeDisruption: "NONE" | "OHE_POWER_DROP" | "FOG_ALERT" | "TSR_ALJN_TDL" | "OVERTAKE_HOLD";
  
  // Model performance metrics
  inferenceLatencyMs: number;
  graphRefreshSec: number;
  psiDataDrift: number;
  conformalCoveragePct: number;
  fallbackActive: boolean;
}

export function useTelemetryStore() {
  const [state, setState] = useState<TelemetryState>({
    trains: INITIAL_TRAINS,
    stations: TRUNK_STATIONS,
    activeCorridor: "NDLS - HWH (New Delhi - Howrah Trunk)",
    activeLocoCount: 142,
    isSimulating: true,
    selectedTrainId: "t1",
    selectedStationCode: "CNB",
    activeDisruption: "NONE",
    inferenceLatencyMs: 38,
    graphRefreshSec: 42,
    psiDataDrift: 0.08,
    conformalCoveragePct: 83.4,
    fallbackActive: false,
  });

  // Ticker for real-time telemetry animation and small progress updates
  useEffect(() => {
    if (!state.isSimulating) return;

    const interval = setInterval(() => {
      setState((prev) => {
        const updatedTrains = prev.trains.map((train) => {
          let speedDelta = (Math.random() - 0.5) * 4;
          let newSpeed = Math.max(0, Math.min(train.mpsKmh, Math.round(train.currentSpeedKmh + speedDelta)));
          if (train.status === "HALTED" || train.status === "OVERTAKE_HOLD") {
            newSpeed = 0;
          }

          let kmProgress = train.status === "HALTED" ? 0 : 0.2;
          let newKm = Math.min(1447, Math.round((train.currentKm + kmProgress) * 10) / 10);
          
          return {
            ...train,
            currentSpeedKmh: newSpeed,
            currentKm: newKm,
            lastSyncSecAgo: (train.lastSyncSecAgo + 1) % 30,
          };
        });

        return {
          ...prev,
          trains: updatedTrains,
          graphRefreshSec: (prev.graphRefreshSec + 1) % 60,
          inferenceLatencyMs: Math.min(48, Math.max(24, prev.inferenceLatencyMs + (Math.random() > 0.5 ? 1 : -1))),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isSimulating]);

  // Handler to inject dynamic operational disruptions
  const triggerDisruption = useCallback((type: TelemetryState["activeDisruption"]) => {
    setState((prev) => {
      let updatedTrains = [...prev.trains];
      let fallback = prev.fallbackActive;

      if (type === "OHE_POWER_DROP") {
        // Power drop near Kanpur
        updatedTrains = updatedTrains.map((t) => {
          if (t.id === "t1" || t.id === "t3") {
            return {
              ...t,
              currentDelayMinutes: t.currentDelayMinutes + 22,
              status: "RUNNING_LATE",
              currentSpeedKmh: Math.round(t.currentSpeedKmh * 0.4),
              stoppages: t.stoppages.map((s) =>
                s.status === "upcoming" || s.status === "active"
                  ? {
                      ...s,
                      delayMinutes: s.delayMinutes + 22,
                      predictedEtaMedian: shiftTime(s.predictedEtaMedian, 22),
                      upperBoundEta: shiftTime(s.upperBoundEta, 28),
                    }
                  : s
              ),
            };
          }
          return t;
        });
      } else if (type === "FOG_ALERT") {
        // Enforce 65 km/h fog speed cap across all trains
        updatedTrains = updatedTrains.map((t) => ({
          ...t,
          isFogActive: true,
          mpsKmh: 65,
          currentSpeedKmh: Math.min(t.currentSpeedKmh, 65),
          currentDelayMinutes: t.currentDelayMinutes + 12,
        }));
      } else if (type === "TSR_ALJN_TDL") {
        // Active Temporary Speed Restriction 30 km/h
        updatedTrains = updatedTrains.map((t) =>
          t.id === "t1"
            ? {
                ...t,
                hasCautionOrder: true,
                currentSpeedKmh: 30,
                currentDelayMinutes: t.currentDelayMinutes + 8,
              }
            : t
        );
      } else if (type === "OVERTAKE_HOLD") {
        // Divert MEMU to loop line for Rajdhani overtake
        updatedTrains = updatedTrains.map((t) =>
          t.id === "t4"
            ? {
                ...t,
                isLoopLineDiverted: true,
                status: "OVERTAKE_HOLD",
                currentSpeedKmh: 0,
                currentDelayMinutes: t.currentDelayMinutes + 15,
              }
            : t
        );
      } else if (type === "NONE") {
        // Reset to initial
        updatedTrains = INITIAL_TRAINS;
      }

      return {
        ...prev,
        trains: updatedTrains,
        activeDisruption: type,
        psiDataDrift: type !== "NONE" ? 0.24 : 0.08,
      };
    });
  }, []);

  const setSelectedTrain = useCallback((id: string) => {
    setState((prev) => ({ ...prev, selectedTrainId: id }));
  }, []);

  const setSelectedStation = useCallback((code: string) => {
    setState((prev) => ({ ...prev, selectedStationCode: code }));
  }, []);

  const toggleSimulation = useCallback(() => {
    setState((prev) => ({ ...prev, isSimulating: !prev.isSimulating }));
  }, []);

  const toggleFallbackMode = useCallback(() => {
    setState((prev) => ({ ...prev, fallbackActive: !prev.fallbackActive }));
  }, []);

  return {
    ...state,
    setSelectedTrain,
    setSelectedStation,
    triggerDisruption,
    toggleSimulation,
    toggleFallbackMode,
  };
}

// Helper to shift HH:MM time string
function shiftTime(timeStr: string, minutesToAdd: number): string {
  if (!timeStr || !timeStr.includes(":")) return timeStr;
  const [h, m] = timeStr.split(":").map(Number);
  const totalM = h * 60 + m + minutesToAdd;
  const newH = Math.floor(totalM / 60) % 24;
  const newM = totalM % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}
