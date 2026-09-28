import { NextRequest, NextResponse } from "next/server";
import { dtapeEngine } from "@/lib/engine/predictionEngine";

export async function GET() {
  return NextResponse.json({
    systemHealth: "HEALTHY",
    slas: {
      endToEndLatencySec: 0.8,
      endToEndSlaSec: 2.0,
      microInferenceLatencyMs: 24,
      microInferenceSlaMs: 50,
      macroGraphRefreshSec: 42,
      macroGraphSlaSec: 60,
    },
    dataDrift: {
      populationStabilityIndex: dtapeEngine.isFallbackMode() ? 0.24 : 0.08,
      driftStatus: dtapeEngine.isFallbackMode() ? "PSI_DRIFT_ALERT" : "STABLE",
      featureMetrics: [
        { name: "Speed Profile Distribution", psi: 0.04 },
        { name: "Headway Variance Ratio", psi: 0.09 },
        { name: "Caution Order (TSR) Frequency", psi: dtapeEngine.isFallbackMode() ? 0.24 : 0.08 },
      ],
    },
    conformalCoverage: {
      targetCoveragePct: 80.0,
      empiricalCoveragePct: 83.4,
      calibrationWindowSize: 5000,
    },
    fallbackModeActive: dtapeEngine.isFallbackMode(),
    activeModelServing: dtapeEngine.isFallbackMode()
      ? "KINEMATIC_WTT_PHYSICS_FALLBACK"
      : "TIER1_RSTGCN_TIER2_LIGHTGBM",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (typeof body.fallbackActive === "boolean") {
      dtapeEngine.setFallbackMode(body.fallbackActive);
    }
    return NextResponse.json({
      status: "UPDATED",
      fallbackActive: dtapeEngine.isFallbackMode(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update fallback state" }, { status: 400 });
  }
}
