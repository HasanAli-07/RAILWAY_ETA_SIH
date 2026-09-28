export type ServiceCategory =
  | "VANDE_BHARAT"
  | "RAJDHANI"
  | "SHATABDI"
  | "SUPERFAST"
  | "MAIL_EXPRESS"
  | "SUBURBAN"
  | "FREIGHT";

export type GaganFixQuality =
  | "GAGAN_DIFFERENTIAL"
  | "GPS_3D"
  | "CELLULAR_ESTIMATE";

export type EventType =
  | "PERIODIC_30S"
  | "GEOFENCE_STATION_ARRIVAL"
  | "GEOFENCE_STATION_DEPARTURE"
  | "UNSCHEDULED_HALT";

export interface TrainMaster {
  trainNumber: string;
  trainName: string;
  category: ServiceCategory;
  priorityRank: number; // 1 = highest (Vande Bharat/Rajdhani), 5 = lowest (Freight)
  originStationCode: string;
  destinationStationCode: string;
  bookedSpeedKmh: number;
  maxPermissibleSpeedKmh: number;
  locoId: string;
  locoType: string;
}

export interface StationMaster {
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  zone: string;
  division: string;
  platformCount: number;
}

export interface TrackSegment {
  id: string;
  fromStationCode: string;
  toStationCode: string;
  lengthKm: number;
  trackCount: number; // 1 = single, 2 = double, 4 = quad
  mpsKmh: number;
  rulingGradient: string;
  turnoutSpeedKmh: number;
}

export interface ScheduleEntry {
  trainNumber: string;
  stationCode: string;
  scheduledArrival: string; // HH:MM
  scheduledDeparture: string; // HH:MM
  dwellMinutes: number;
  distanceKm: number;
  platformAssigned: string;
}

export interface LiveTelemetryPacket {
  packetId: string;
  locoId: string;
  trainNumber: string;
  timestampUtc: string;
  coordinates: {
    latitude: number;
    longitude: number;
    altitudeM: number;
    fixQuality: GaganFixQuality;
  };
  kinematics: {
    speedKmh: number;
    headingDegrees: number;
    sectionalAcceleration: number;
  };
  eventType: EventType;
}

export interface CautionOrderRecord {
  id: string;
  segmentId: string;
  startKm: number;
  endKm: number;
  speedCapKmh: number;
  reason: string;
  isActive: boolean;
}

export interface WeatherAlertRecord {
  stationCode: string;
  visibilityMeters: number;
  fogLevel: "CLEAR" | "MODERATE_FOG" | "DENSE_RADIATION_FOG";
  fogPassActivated: boolean;
  timestamp: string;
}

export interface RecoveryFactorsApplied {
  engineeringAllowanceMin: number;
  trafficRecoveryTimeMin: number;
  cautionOrderPenaltyMin: number;
  loopLineHoldingPenaltyMin: number;
  fogSpeedCapPenaltyMin: number;
}

export interface PredictionResult {
  trainNumber: string;
  stationCode: string;
  scheduledArrivalTime: string;
  predictedPointEta: string; // Median ETA (50th percentile)
  predictedDelayMinutes: number;
  confidenceInterval80Pct: {
    lowerBoundEta: string; // 10th percentile
    upperBoundEta: string; // 90th percentile
    marginMinutes: number; // e.g. ±4m
    empiricalCoveragePct: number; // e.g. 83.4%
  };
  recoveryFactors: RecoveryFactorsApplied;
  modelUsed: "TIER1_RSTGCN_TIER2_LIGHTGBM" | "KINEMATIC_WTT_PHYSICS_FALLBACK";
  generatedTimestamp: string;
}
