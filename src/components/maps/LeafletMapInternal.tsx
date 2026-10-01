"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TrainService, StationNode } from "@/lib/simulation/railwayData";
import { Train, Navigation, Layers, Shield, Gauge, Radio, Sparkles } from "lucide-react";

interface LeafletMapInternalProps {
  trains: TrainService[];
  stations: StationNode[];
  selectedTrainId: string | null;
  onSelectTrain: (id: string) => void;
  activeDisruption?: string;
}

export default function LeafletMapInternal({
  trains,
  stations,
  selectedTrainId,
  onSelectTrain,
  activeDisruption = "NONE",
}: LeafletMapInternalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const [mapTheme, setMapTheme] = useState<"DARK" | "LIGHT" | "SATELLITE">("LIGHT");

  // Fix default marker icons path issue in Leaflet + Next.js
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    // Center map near Kanpur / Central India corridor
    const map = L.map(mapContainerRef.current, {
      center: [26.4539, 80.3514], // Kanpur Central
      zoom: 6,
      zoomControl: true,
    });

    mapRef.current = map;
    markersGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle Tile Layer Theme Changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    if (mapTheme === "DARK") {
      tileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
      attribution = '&copy; <a href="https://carto.com/">CARTO</a>';
    } else if (mapTheme === "SATELLITE") {
      tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      attribution = "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";
    }

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    L.tileLayer(tileUrl, { attribution, maxZoom: 19 }).addTo(map);
  }, [mapTheme]);

  // Render Corridor Track Polyline & Dynamic Train Markers
  useEffect(() => {
    const map = mapRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. Draw NDLS -> HWH Trunk Railway Line Polyline
    const corridorCoords: [number, number][] = stations.map((st) => [st.latitude, st.longitude]);

    // Outer Glow / Casing Track Line
    L.polyline(corridorCoords, {
      color: "#0F3875",
      weight: 6,
      opacity: 0.8,
    }).addTo(markersGroup);

    // Inner Active Signal Line
    L.polyline(corridorCoords, {
      color: "#60A5FA",
      weight: 3,
      dashArray: "8, 6",
      opacity: 1,
    }).addTo(markersGroup);

    // 2. Add Station Node Markers
    stations.forEach((st) => {
      const stationHtml = `
        <div class="flex items-center justify-center w-7 h-7 rounded-full bg-[#0F3875] text-white font-mono font-bold text-[10px] border-2 border-white shadow-md">
          ${st.code.slice(0, 3)}
        </div>
      `;

      const stationIcon = L.divIcon({
        html: stationHtml,
        className: "custom-station-pin",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([st.latitude, st.longitude], { icon: stationIcon }).addTo(markersGroup);

      marker.bindPopup(`
        <div class="p-1 font-sans space-y-1.5 min-w-[200px]">
          <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-1">
            <span class="font-outfit font-extrabold text-sm text-[#0F3875]">${st.name} (${st.code})</span>
            <span class="text-[10px] font-mono bg-[#EFF6FF] text-[#1E40AF] px-1.5 py-0.5 rounded font-bold">${st.zone} Zone</span>
          </div>
          <div class="text-xs font-mono text-[#475569] space-y-0.5">
            <div>Platforms: <strong class="text-[#0F172A]">${st.platformCount}</strong> (${st.occupiedPlatforms} Occupied)</div>
            <div>Distance: <strong class="text-[#0F172A]">${st.distanceKm} KM</strong> from NDLS</div>
            <div>Yard Clearance: <span class="text-[#059669] font-bold">OK</span></div>
          </div>
        </div>
      `);
    });

    // 3. Add Live Train Locomotives Position Markers
    const maxKm = 1447;
    trains.forEach((train) => {
      const isSelected = train.id === selectedTrainId;

      // Estimate train position along NDLS-HWH route
      const trainRatio = Math.min(1, Math.max(0, train.currentKm / maxKm));

      // Find segment between stations
      let lat = stations[0].latitude;
      let lng = stations[0].longitude;

      for (let i = 0; i < stations.length - 1; i++) {
        const s1 = stations[i];
        const s2 = stations[i + 1];
        if (train.currentKm >= s1.distanceKm && train.currentKm <= s2.distanceKm) {
          const segRatio = (train.currentKm - s1.distanceKm) / (s2.distanceKm - s1.distanceKm || 1);
          lat = s1.latitude + segRatio * (s2.latitude - s1.latitude);
          lng = s1.longitude + segRatio * (s2.longitude - s1.longitude);
          break;
        } else if (train.currentKm > stations[stations.length - 1].distanceKm) {
          lat = stations[stations.length - 1].latitude;
          lng = stations[stations.length - 1].longitude;
        }
      }

      // Marker Color
      let colorClass = "bg-[#1E5AA8]";
      if (train.category === "VANDE_BHARAT" || train.category === "RAJDHANI") colorClass = "bg-[#0F3875]";
      if (train.category === "FREIGHT") colorClass = "bg-[#D97706]";
      if (train.currentDelayMinutes > 15) colorClass = "bg-[#DC2626]";

      const trainMarkerHtml = `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full ${colorClass} text-white flex items-center justify-center font-mono font-black text-xs border-2 border-white shadow-lg ${
        isSelected ? "ring-4 ring-[#60A5FA] scale-110" : ""
      }">
            🚆
          </div>
          ${
            isSelected
              ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-[#059669] rounded-full border border-white animate-ping"></span>'
              : ""
          }
        </div>
      `;

      const trainIcon = L.divIcon({
        html: trainMarkerHtml,
        className: "custom-train-pin",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([lat, lng], { icon: trainIcon }).addTo(markersGroup);

      // Draw GPS GAGAN Fix Radius Circle
      if (train.gaganFixQuality === "GAGAN_DIFFERENTIAL") {
        L.circle([lat, lng], {
          radius: 1200,
          color: "#3B82F6",
          fillColor: "#60A5FA",
          fillOpacity: 0.15,
          weight: 1,
        }).addTo(markersGroup);
      }

      marker.on("click", () => {
        onSelectTrain(train.id);
      });

      marker.bindPopup(`
        <div class="p-1 font-sans space-y-2 min-w-[220px]">
          <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-1">
            <span class="font-outfit font-extrabold text-base text-[#0F172A]">${train.number}</span>
            <span class="text-xs font-mono font-bold px-2 py-0.5 rounded ${
              train.currentDelayMinutes > 0 ? "bg-[#FFF7ED] text-[#EA580C]" : "bg-[#ECFDF5] text-[#065F46]"
            }">
              ${train.currentDelayMinutes > 0 ? `+${train.currentDelayMinutes}m Late` : "On Time"}
            </span>
          </div>

          <div class="font-outfit font-bold text-xs text-[#334155]">${train.name}</div>

          <div class="grid grid-cols-2 gap-1 text-[11px] font-mono text-[#475569]">
            <div>Speed: <strong class="text-[#0F3875]">${train.currentSpeedKmh} km/h</strong></div>
            <div>Loco: <strong class="text-[#0F172A]">${train.locoId.split(" ")[0]}</strong></div>
            <div>Next: <strong class="text-[#0F172A]">${train.nextStationCode}</strong></div>
            <div>GPS: <strong class="text-[#059669]">${train.gaganFixQuality.slice(0, 5)}</strong></div>
          </div>

          <div class="text-[10px] font-mono text-[#64748B] bg-[#F8FAFC] p-1.5 rounded border border-[#E2E8F0]">
            Route: ${train.origin} ➔ ${train.destination} (${train.currentKm} KM)
          </div>
        </div>
      `);
    });
  }, [trains, stations, selectedTrainId, onSelectTrain]);

  return (
    <div className="relative w-full h-full flex flex-col bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-sm min-h-[400px]">
      {/* Top Map Layer Bar */}
      <div className="p-2.5 sm:p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#1E5AA8] shrink-0" />
          <span className="font-outfit font-bold text-xs sm:text-sm text-[#0F172A] tracking-tight uppercase">
            Live GIS Telemetry Map (NDLS - HWH Trunk Corridor)
          </span>
          <span className="hidden sm:inline bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] text-[10px] font-mono px-2 py-0.5 rounded font-bold">
            ISRO GAGAN Satellite Real-Time Positioning
          </span>
        </div>

        {/* Theme Switcher Pills */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <button
            onClick={() => setMapTheme("LIGHT")}
            className={`px-2 py-0.5 rounded font-semibold transition-all ${
              mapTheme === "LIGHT"
                ? "bg-[#0F3875] text-white shadow-sm"
                : "bg-white text-[#475569] border border-[#CBD5E1] hover:bg-[#F1F5F9]"
            }`}
          >
            Light
          </button>

          <button
            onClick={() => setMapTheme("DARK")}
            className={`px-2 py-0.5 rounded font-semibold transition-all ${
              mapTheme === "DARK"
                ? "bg-[#0F3875] text-white shadow-sm"
                : "bg-white text-[#475569] border border-[#CBD5E1] hover:bg-[#F1F5F9]"
            }`}
          >
            Dark Mode
          </button>

          <button
            onClick={() => setMapTheme("SATELLITE")}
            className={`px-2 py-0.5 rounded font-semibold transition-all ${
              mapTheme === "SATELLITE"
                ? "bg-[#0F3875] text-white shadow-sm"
                : "bg-white text-[#475569] border border-[#CBD5E1] hover:bg-[#F1F5F9]"
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Leaflet Map DOM Element */}
      <div ref={mapContainerRef} className="relative flex-1 w-full h-full min-h-[360px] bg-[#E2E8F0] z-0" />
    </div>
  );
}
