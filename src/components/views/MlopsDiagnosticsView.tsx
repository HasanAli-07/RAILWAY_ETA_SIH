"use client";

import React from "react";
import {
  Activity,
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertTriangle,
  Server,
  RefreshCw,
  Clock,
  Layers,
  CheckCircle2,
} from "lucide-react";

interface MlopsDiagnosticsViewProps {
  inferenceLatencyMs: number;
  graphRefreshSec: number;
  psiDataDrift: number;
  conformalCoveragePct: number;
  fallbackActive: boolean;
  onToggleFallback: () => void;
}

export const MlopsDiagnosticsView: React.FC<MlopsDiagnosticsViewProps> = ({
  inferenceLatencyMs,
  graphRefreshSec,
  psiDataDrift,
  conformalCoveragePct,
  fallbackActive,
  onToggleFallback,
}) => {
  return (
    <div className="flex-1 bg-[#F8FAFC] p-4 max-w-[1920px] mx-auto w-full h-[calc(100vh-3.5rem)] overflow-y-auto space-y-4">
      {/* Top Header */}
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-[8px] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#0F3875]" />
            <h2 className="font-mono font-bold text-base text-[#0F172A]">
              DTAPE MLOps Diagnostic Console & System Health (NFR-REL-01)
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5 font-mono">
            Model Serving Infrastructure • Population Stability Index Drift Tracking • Graceful Degradation Toggles
          </p>
        </div>

        {/* Fallback Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-mono text-[#64748B] block">Model Serving Pipeline</span>
            <span className={`font-mono font-bold text-xs ${fallbackActive ? "text-[#DC2626]" : "text-[#059669]"}`}>
              {fallbackActive ? "FALLBACK: Kinematic WTT Physics" : "PRIMARY: GPU RSTGCN + LightGBM"}
            </span>
          </div>

          <button
            onClick={onToggleFallback}
            className={`px-3 py-1.5 rounded-[6px] font-mono font-bold text-xs border transition-all shadow-sm ${
              fallbackActive
                ? "bg-[#FEF2F2] border-[#FECACA] text-[#991B1B] hover:bg-[#FEE2E2]"
                : "bg-[#0F3875] border-[#1E5AA8] text-white hover:bg-[#1E5AA8]"
            }`}
          >
            {fallbackActive ? "Restore ML Inference Engine" : "Simulate ML Server Outage (Fallback)"}
          </button>
        </div>
      </div>

      {/* Latency SLAs & System Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Ingestion Latency */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-[8px] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>End-to-End Latency</span>
            <Database className="w-4 h-4 text-[#1E5AA8]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#0F172A]">
            0.8s <span className="text-xs text-[#059669] font-normal">(&le; 2.0s SLA)</span>
          </div>
          <p className="text-[11px] text-[#64748B] font-mono">
            ISRO GAGAN Satellite ➔ Kafka Ingestion ➔ Redis
          </p>
        </div>

        {/* Metric 2: Model Inference Latency */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-[8px] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>Micro-Scale Inference</span>
            <Cpu className="w-4 h-4 text-[#1E5AA8]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#0F3875]">
            {inferenceLatencyMs} ms <span className="text-xs text-[#059669] font-normal">(&le; 50ms SLA)</span>
          </div>
          <p className="text-[11px] text-[#64748B] font-mono">
            NVIDIA Triton ONNX GPU Batch Evaluation
          </p>
        </div>

        {/* Metric 3: Macro Graph Refresh */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-[8px] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>Graph Embedding Refresh</span>
            <Layers className="w-4 h-4 text-[#1E5AA8]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#0F172A]">
            {graphRefreshSec}s <span className="text-xs text-[#059669] font-normal">(&le; 60s SLA)</span>
          </div>
          <p className="text-[11px] text-[#64748B] font-mono">
            Tier 1 RSTGCN Network Embedding (4,735 Nodes)
          </p>
        </div>

        {/* Metric 4: Conformal Coverage */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-[8px] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>CQR Coverage Rate</span>
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#059669]">
            {conformalCoveragePct}% <span className="text-xs text-[#059669] font-normal">(&ge; 80% Valid)</span>
          </div>
          <p className="text-[11px] text-[#64748B] font-mono">
            Mondrian Conformal Stratified Test Holdout
          </p>
        </div>
      </div>

      {/* Main Content Split: Data Drift Meters vs Retraining Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Data Drift & Feature PSI Monitoring */}
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#1E5AA8]" />
              Data Drift & Feature Distribution Stability (PSI)
            </h3>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              psiDataDrift > 0.2 ? "bg-[#FEF2F2] text-[#991B1B]" : "bg-[#ECFDF5] text-[#065F46]"
            }`}>
              PSI: {psiDataDrift} {psiDataDrift > 0.2 ? "(Drift Alert)" : "(Normal)"}
            </span>
          </div>

          <p className="text-xs text-[#475569] leading-relaxed font-sans">
            Population Stability Index (PSI) evaluates feature distribution shifts across section speeds, headway variances, and TSR counts. Alerts trigger automated retraining pipelines if PSI &gt; 0.2.
          </p>

          <div className="space-y-2 font-mono text-xs">
            <div>
              <div className="flex justify-between text-[#334155] mb-1">
                <span>Section Speed Profile Distribution</span>
                <span>PSI 0.04</span>
              </div>
              <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#059669] w-[20%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#334155] mb-1">
                <span>Headway Compression Variance</span>
                <span>PSI 0.09</span>
              </div>
              <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#059669] w-[45%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#334155] mb-1">
                <span>Temporary Caution Orders (TSR) Frequency</span>
                <span className={psiDataDrift > 0.2 ? "text-[#DC2626] font-bold" : "text-[#334155]"}>
                  PSI {psiDataDrift}
                </span>
              </div>
              <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className={`h-full ${psiDataDrift > 0.2 ? "bg-[#DC2626]" : "bg-[#059669]"}`}
                  style={{ width: `${Math.min(100, psiDataDrift * 300)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Model Retraining Cadence & Canary Evaluation */}
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#0F3875]" />
              Automated Retraining & Canary Deployment Logs
            </h3>
            <span className="text-xs font-mono bg-[#F1F5F9] px-2 py-0.5 rounded text-[#475569]">
              72h Shadow Evaluation
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-[6px] space-y-1">
              <div className="flex items-center justify-between text-[#0F172A] font-bold">
                <span>Tier 2 LightGBM Tabular Regressors</span>
                <span className="text-[#059669] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Retrained Weekly
                </span>
              </div>
              <p className="text-[#64748B] text-[11px]">
                Last training execution: 27-Sep-2026 02:00 UTC | MAE Improvement: +6.2%
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-[6px] space-y-1">
              <div className="flex items-center justify-between text-[#0F172A] font-bold">
                <span>Tier 1 RSTGCN Graph Neural Network</span>
                <span className="text-[#1E5AA8] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Retrained Monthly
                </span>
              </div>
              <p className="text-[#64748B] text-[11px]">
                Network topology graph updated across all 17 zones | GPU Memory: 3.4 GB VRAM
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-[6px] space-y-1">
              <div className="flex items-center justify-between text-[#0F172A] font-bold">
                <span>Canary Promotion Criteria</span>
                <span className="text-[#D97706]">&ge; 5% MAE gain + PICP &ge; 80%</span>
              </div>
              <p className="text-[#64748B] text-[11px]">
                Shadow candidate v1.4.2 validated for 72h on Delhi-Howrah trunk line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
