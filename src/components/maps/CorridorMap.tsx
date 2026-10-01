"use client";

import React from "react";
import dynamic from "next/dynamic";
import { TrainService, StationNode } from "@/lib/simulation/railwayData";
import { Navigation } from "lucide-react";

const LeafletMapInternal = dynamic(() => import("./LeafletMapInternal"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] flex flex-col items-center justify-center p-6 text-center space-y-3">
      <div className="w-10 h-10 border-4 border-[#1E5AA8] border-t-transparent rounded-full animate-spin" />
      <div className="font-outfit font-bold text-sm text-[#0F3875] flex items-center gap-2">
        <Navigation className="w-4 h-4 text-[#1E5AA8] animate-bounce" />
        Loading Live Leaflet GIS Telemetry Corridor Map...
      </div>
      <p className="text-xs text-[#64748B] font-mono">
        Connecting to ISRO GAGAN Positional Feed & Map Matcher Engine
      </p>
    </div>
  ),
});

interface CorridorMapProps {
  trains: TrainService[];
  stations: StationNode[];
  selectedTrainId: string | null;
  onSelectTrain: (id: string) => void;
  activeDisruption?: string;
}

export const CorridorMap: React.FC<CorridorMapProps> = (props) => {
  return <LeafletMapInternal {...props} />;
};
