import { StationMaster, LiveTelemetryPacket } from "./types";

export interface MapMatchedLocation {
  trainNumber: string;
  matchedTrackSection: string; // e.g. "GZB - ALJN"
  corridorDistanceKm: number;
  nearestStationCode: string;
  distanceToNextStationKm: number;
  instantaneousSpeedKmh: number;
  calculatedAcceleration: number;
  mapMatchAccuracyPct: number; // e.g. 99.7%
}

// Calculate Haversine distance between 2 geodetic coordinates (in km)
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function mapMatchTelemetryToTrack(
  telemetry: LiveTelemetryPacket,
  stations: StationMaster[]
): MapMatchedLocation {
  const { latitude, longitude } = telemetry.coordinates;

  // Find nearest station node along trunk line
  let closestStation = stations[0];
  let minDistance = Infinity;

  stations.forEach((st) => {
    const dist = haversineDistanceKm(latitude, longitude, st.latitude, st.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closestStation = st;
    }
  });

  // Determine section bounds
  const nearestIdx = stations.findIndex((s) => s.code === closestStation.code);
  const nextStation = stations[Math.min(stations.length - 1, nearestIdx + 1)];
  const sectionName = `${closestStation.code} - ${nextStation.code}`;

  const estDistanceKm = closestStation.distanceKm + Math.min(nextStation.distanceKm - closestStation.distanceKm, minDistance * 0.8);

  return {
    trainNumber: telemetry.trainNumber,
    matchedTrackSection: sectionName,
    corridorDistanceKm: Math.round(estDistanceKm * 10) / 10,
    nearestStationCode: closestStation.code,
    distanceToNextStationKm: Math.max(0, Math.round((nextStation.distanceKm - estDistanceKm) * 10) / 10),
    instantaneousSpeedKmh: telemetry.kinematics.speedKmh,
    calculatedAcceleration: telemetry.kinematics.sectionalAcceleration || 0.05,
    mapMatchAccuracyPct: telemetry.coordinates.fixQuality === "GAGAN_DIFFERENTIAL" ? 99.8 : 98.5,
  };
}
