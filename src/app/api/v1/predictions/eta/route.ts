import { NextRequest, NextResponse } from "next/server";
import { INITIAL_TRAINS, TRUNK_STATIONS } from "@/lib/simulation/railwayData";
import { dtapeEngine } from "@/lib/engine/predictionEngine";
import { TrainMaster, ScheduleEntry } from "@/lib/engine/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trainNumber = searchParams.get("trainNumber") || "12952";
  const stationCode = searchParams.get("stationCode") || "CNB";

  const targetTrain = INITIAL_TRAINS.find((t) => t.number === trainNumber) || INITIAL_TRAINS[0];

  const trainMaster: TrainMaster = {
    trainNumber: targetTrain.number,
    trainName: targetTrain.name,
    category: targetTrain.category,
    priorityRank: targetTrain.category === "VANDE_BHARAT" || targetTrain.category === "RAJDHANI" ? 1 : 3,
    originStationCode: targetTrain.origin,
    destinationStationCode: targetTrain.destination,
    bookedSpeedKmh: targetTrain.currentSpeedKmh,
    maxPermissibleSpeedKmh: targetTrain.mpsKmh,
    locoId: targetTrain.locoId,
    locoType: targetTrain.locoType,
  };

  const schedule: ScheduleEntry = {
    trainNumber: targetTrain.number,
    stationCode: stationCode,
    scheduledArrival: "22:10",
    scheduledDeparture: "22:15",
    dwellMinutes: 5,
    distanceKm: 440,
    platformAssigned: "PF 5",
  };

  const prediction = dtapeEngine.predictTrainEta(
    trainMaster,
    schedule,
    targetTrain.currentDelayMinutes,
    [{ id: "c1", segmentId: "ALJN-TDL", startKm: 130, endKm: 180, speedCapKmh: 30, reason: "Track Renewal", isActive: targetTrain.hasCautionOrder }],
    targetTrain.isFogActive ? { stationCode: "CNB", visibilityMeters: 150, fogLevel: "DENSE_RADIATION_FOG", fogPassActivated: true, timestamp: new Date().toISOString() } : null,
    targetTrain.isLoopLineDiverted
  );

  // Return SRS Compliant Prediction API JSON Response Payload (Section 7.2.2)
  return NextResponse.json({
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "DynamicETAPredictionResponse",
    train_number: targetTrain.number,
    train_name: targetTrain.name,
    current_status: {
      last_reported_station: targetTrain.nextStationCode,
      current_delay_minutes: targetTrain.currentDelayMinutes,
      as_of_timestamp: new Date().toISOString(),
    },
    predictions: [
      {
        station_code: prediction.stationCode,
        scheduled_arrival_time: prediction.scheduledArrivalTime,
        predicted_eta_point: prediction.predictedPointEta,
        predicted_delay_minutes: prediction.predictedDelayMinutes,
        confidence_interval_80pct: {
          lower_bound_eta: prediction.confidenceInterval80Pct.lowerBoundEta,
          upper_bound_eta: prediction.confidenceInterval80Pct.upperBoundEta,
          margin_minutes: prediction.confidenceInterval80Pct.marginMinutes,
          empirical_coverage_pct: prediction.confidenceInterval80Pct.empiricalCoveragePct,
        },
        recovery_factors_applied: prediction.recoveryFactors,
        model_serving_type: prediction.modelUsed,
      },
    ],
  });
}
