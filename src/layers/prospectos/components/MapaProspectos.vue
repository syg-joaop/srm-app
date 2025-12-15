<template>
  <div
    class="h-[600px] w-full rounded-xl overflow-hidden border"
    style="border-color: var(--color-border)"
  >
    <div ref="mapContainer" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Prospecto, ProspectoMapItem } from "../types/prospecto";

const MAP_CENTER: [number, number] = [-15.7801, -47.9292];
const INITIAL_ZOOM = 4;
const TILE_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_LAYER_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  ativo: { color: "#10b981", label: "Ativo" },
  alerta: { color: "#f59e0b", label: "Alerta" },
  inativo: { color: "#ef4444", label: "Inativo" },
  novo: { color: "#3b82f6", label: "Novo" },
};

// --- Props ---
const props = defineProps<{
  prospectos?: ProspectoMapItem[];
}>();

// --- State ---
const mapContainer = ref<HTMLElement>();
let map: L.Map | null = null;
let markers: L.Marker[] = [];

// --- Helpers ---
const getStatusConfig = (status: string) => {
  const normalized = (status || "").toLowerCase().trim();
  return STATUS_CONFIG[normalized] || STATUS_CONFIG.inativo;
};

const createCustomIcon = (status: string) => {
  const { color } = getStatusConfig(status);
  const html = `
    <div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>
  `;

  return L.divIcon({
    html,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const createPopupContent = (prospecto: ProspectoMapItem) => {
  const { color, label } = getStatusConfig(prospecto.status);

  return `
    <div style="min-width: 200px;">
      <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">
        ${prospecto.prospecto}
      </h3>
      ${prospecto.fanta ? `<p style="color: #666; margin-bottom: 4px;">${prospecto.fanta}</p>` : ""}
      <p style="margin-bottom: 4px;"><strong>Cidade:</strong> ${prospecto.cidade}</p>
      <p style="margin-bottom: 4px;"><strong>Última Interação:</strong> ${prospecto.ultima_interacao}</p>
      <p style="margin-bottom: 0;">
        <strong>Status:</strong> 
        <span style="color: ${color}; font-weight: bold;">${label}</span>
      </p>
    </div>
  `;
};

// --- Core Logic ---
const clearMarkers = () => {
  markers.forEach((m) => m.remove());
  markers = [];
};

const addMarker = (prospecto: ProspectoMapItem) => {
  if (!prospecto.latitude || !prospecto.longitude) return null;

  const marker = L.marker(
    [Number(prospecto.latitude), Number(prospecto.longitude)],
    {
      icon: createCustomIcon(prospecto.status),
    }
  );

  marker.bindPopup(createPopupContent(prospecto));
  marker.addTo(map!);
  markers.push(marker);

  return [Number(prospecto.latitude), Number(prospecto.longitude)] as [
    number,
    number,
  ];
};

const updateMapMarkers = () => {
  if (!map) return;

  clearMarkers();

  const prospectos = props.prospectos || [];
  const validBounds: [number, number][] = [];

  for (const prospecto of prospectos) {
    if (!prospecto.latlong) continue;

    const coords = addMarker(prospecto);
    if (coords) validBounds.push(coords);
  }

  if (validBounds.length > 0) {
    map.fitBounds(validBounds, { padding: [50, 50] });
  }
};

const initMap = () => {
  if (!mapContainer.value || map) return;

  map = L.map(mapContainer.value).setView(MAP_CENTER, INITIAL_ZOOM);

  L.tileLayer(TILE_LAYER_URL, {
    attribution: TILE_LAYER_ATTRIBUTION,
    maxZoom: 19,
  }).addTo(map);

  updateMapMarkers();
};

watch(() => props.prospectos, updateMapMarkers, { deep: true });

onMounted(initMap);

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>
