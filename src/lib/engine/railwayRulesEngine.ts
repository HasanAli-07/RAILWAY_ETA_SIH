import {
  TrainMaster,
  StationMaster,
  ScheduleEntry,
  CautionOrderRecord,
  WeatherAlertRecord,
  RecoveryFactorsApplied,
} from "./types";

export interface EvaluatedSectionDelay {
  trainNumber: string;
  fromStationCode: string;
  toStationCode: string;
  departureDelayMin: number;
  sectionalDelayMin: number;
  recoveryFactors: RecoveryFactorsApplied;
  finalArrivalDelayMin: number;
}

export class RailwayRulesEngine {
  /**
   * Calculates sectional running time delay according to Indian Railways WTT mechanics & precedence rules
   */
  public evaluateSectionalDelay(
    train: TrainMaster,
    schedule: ScheduleEntry,
    currentDelayMin: number,
    activeCautionOrders: CautionOrderRecord[],
    weatherAlert: WeatherAlertRecord | null,
    isLoopLineHold: boolean
  ): EvaluatedSectionDelay {
    let eaRecovery = 3.5; // Default Engineering Allowance credit
    let trtBuffer = 0;
    let tsrPenalty = 0;
    let loopPenalty = 0;
    let fogPenalty = 0;

    // 1. Evaluate Active Caution Orders (TSR)
    const activeTsr = activeCautionOrders.find((c) => c.isActive);
    if (activeTsr) {
      // TSR active -> EA consumed, speed penalty applied
      eaRecovery = 0;
      const speedDrop = train.bookedSpeedKmh - activeTsr.speedCapKmh;
      tsrPenalty = Math.max(2, Math.round((speedDrop / 100) * 12));
    }

    // 2. Evaluate Weather / Fog-PASS Speed Caps
    if (weatherAlert && weatherAlert.fogPassActivated) {
      const fogSpeedCap = 65;
      if (train.bookedSpeedKmh > fogSpeedCap) {
        fogPenalty = Math.round(((train.bookedSpeedKmh - fogSpeedCap) / 10) * 1.5);
      }
    }

    // 3. Evaluate Precedence Overtake Penalties
    if (isLoopLineHold && train.priorityRank >= 4) {
      // Turnout deceleration to 15/30 km/h + dwell + re-acceleration
      loopPenalty = 15; // 15 mins penalty for loop-line overtake dwell
    }

    // 4. Traffic Recovery Time (TRT) at major junction approach
    if (schedule.stationCode === "CNB" || schedule.stationCode === "PRYJ" || schedule.stationCode === "HWH") {
      trtBuffer = 5.0; // Deduct 5 mins TRT buffer at terminal approach
    }

    // Net Sectional Delay Equation:
    // delta_j = max(0, delta_i + tsrPenalty + fogPenalty + loopPenalty - eaRecovery - trtBuffer)
    const netPerturbation = tsrPenalty + fogPenalty + loopPenalty - eaRecovery - trtBuffer;
    const finalArrivalDelayMin = Math.max(0, Math.round(currentDelayMin + netPerturbation));

    return {
      trainNumber: train.trainNumber,
      fromStationCode: schedule.stationCode,
      toStationCode: schedule.stationCode,
      departureDelayMin: currentDelayMin,
      sectionalDelayMin: netPerturbation,
      recoveryFactors: {
        engineeringAllowanceMin: eaRecovery,
        trafficRecoveryTimeMin: trtBuffer,
        cautionOrderPenaltyMin: tsrPenalty,
        loopLineHoldingPenaltyMin: loopPenalty,
        fogSpeedCapPenaltyMin: fogPenalty,
      },
      finalArrivalDelayMin,
    };
  }
}

export const railwayRulesEngine = new RailwayRulesEngine();
