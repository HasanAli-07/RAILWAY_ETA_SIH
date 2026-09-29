# 🚆 RAILVISTA | Dynamic Train Arrival Prediction Engine

**RAILVISTA** is an event-driven, spatio-temporal machine learning system for Indian Railways. It transitions arrival forecasting from static timetable extrapolation to a real-time, two-tier AI architecture (RSTGCN + LightGBM + Mondrian Conformal Quantile Regression) delivering point ETAs and calibrated 80% confidence prediction windows.

## 🚀 Key Features

- 🎛️ **Section Train Controller Console**: 60 FPS Canvas Time-Distance String Chart (Digital Control Chart), active block signaling aspects, and interactive "What-If" dispatch scenario simulator.
- 🚉 **Station Master Berthing Console**: Real-time 10-platform berthing grid, platform throat clearance status, and 30 km station approach zone countdown queue.
- 📱 **Passenger Dynamic Journey Portal**: Ultra-clean, mobile-responsive journey tracker featuring simplified arrival countdowns, platform # assignments, 80% confidence windows, and plain-language delay explanations.
- ⚡ **MLOps Diagnostics & Health**: Real-time Population Stability Index (PSI) drift meters, latency SLAs (< 50ms), and automated Kinematic WTT physics fallback.
- 🔐 **Role-Based Access Control (RBAC)**: Unified authentication system with persona presets.

## 🛠️ Stack & Architecture

- **Framework**: Next.js (React 19) / TypeScript
- **Styling**: Tailwind CSS configured with Railway Design Tokens & `Outfit` / `Inter` / `JetBrains Mono` fonts
- **Graphics**: HTML5 Canvas 60 FPS vector renderer for time-distance charts
- **Icons**: Lucide React
- **API Endpoints**: REST APIs for telemetry ingestion (`/api/v1/telemetry/ingest`), ETA predictions (`/api/v1/predictions/eta`), corridor status, and MLOps metrics.

## ⚡ Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
