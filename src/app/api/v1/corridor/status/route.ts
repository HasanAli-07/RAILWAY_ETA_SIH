import { NextResponse } from "next/server";
import { INITIAL_TRAINS, TRUNK_STATIONS } from "@/lib/simulation/railwayData";

export async function GET() {
  return NextResponse.json({
    corridorName: "NDLS - HWH (New Delhi - Howrah Trunk Corridor)",
    totalLengthKm: 1447,
    activeLocomotives: INITIAL_TRAINS.length * 28 + 2,
    stations: TRUNK_STATIONS,
    trains: INITIAL_TRAINS,
    timestamp: new Date().toISOString(),
  });
}
