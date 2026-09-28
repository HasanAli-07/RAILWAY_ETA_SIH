import { NextRequest, NextResponse } from "next/server";
import { LiveTelemetryPacket } from "@/lib/engine/types";
import { mapMatchTelemetryToTrack } from "@/lib/engine/mapMatching";
import { TRUNK_STATIONS } from "@/lib/simulation/railwayData";

export async function POST(req: NextRequest) {
  const startTime = performance.now();

  try {
    const body: LiveTelemetryPacket = await req.json();

    // Basic Schema Validation (SRS Section 7.2.1)
    if (!body.packetId || !body.locoId || !body.trainNumber || !body.coordinates) {
      return NextResponse.json(
        { error: "Invalid RTISTelemetryPacket payload. Missing required fields." },
        { status: 400 }
      );
    }

    // Convert simulation stations to StationMaster format
    const stationMasters = TRUNK_STATIONS.map((s) => ({
      code: s.code,
      name: s.name,
      latitude: s.latitude,
      longitude: s.longitude,
      distanceKm: s.distanceKm,
      zone: s.zone,
      division: s.division,
      platformCount: s.platformCount,
    }));

    // Map match telemetry coordinates to track
    const mapMatched = mapMatchTelemetryToTrack(body, stationMasters);
    const latencyMs = Math.round((performance.now() - startTime) * 100) / 100;

    return NextResponse.json(
      {
        status: "INGESTED_SUCCESSFULLY",
        packetId: body.packetId,
        trainNumber: body.trainNumber,
        matchedSection: mapMatched.matchedTrackSection,
        corridorDistanceKm: mapMatched.corridorDistanceKm,
        accuracyPct: mapMatched.mapMatchAccuracyPct,
        ingestionLatencyMs: latencyMs,
        timestampUtc: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to process telemetry stream", details: error.message },
      { status: 500 }
    );
  }
}
