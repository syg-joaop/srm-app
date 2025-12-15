<template>
  <div ref="mapContainer" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { UiMapaPonto, UiMapaStatusConfig } from "./maps.types";

const props = withDefaults(
  defineProps<{
    pontos?: UiMapaPonto[];
    centro?: [number, number];
    zoomInicial?: number;
    fitBoundsPadding?: [number, number];
    autoFitBounds?: boolean;
    statusConfig?: UiMapaStatusConfig;
    tileLayerUrl?: string;
    tileLayerAttribution?: string;
  }>(),
  {
    pontos: () => [],
    centro: () => [-15.7801, -47.9292] as [number, number],
    zoomInicial: 4,
    fitBoundsPadding: () => [50, 50],
    autoFitBounds: true,
    statusConfig: () => ({
      ativo: { color: "#10b981", label: "Ativo" },
      alerta: { color: "#f59e0b", label: "Alerta" },
      inativo: { color: "#ef4444", label: "Inativo" },
    }),
    tileLayerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    tileLayerAttribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
);

const resolvedStatusConfig = computed<UiMapaStatusConfig>(() => ({
  ativo: { color: "#10b981", label: "Ativo" },
  alerta: { color: "#f59e0b", label: "Alerta" },
  inativo: { color: "#ef4444", label: "Inativo" },
  ...props.statusConfig,
}));

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let markers: L.Marker[] = [];

const normalizeStatus = (status?: string) => (status ?? "").toLowerCase().trim();

const getStatusConfig = (status?: string) => {
  const normalized = normalizeStatus(status);
  return resolvedStatusConfig.value[normalized] || resolvedStatusConfig.value.inativo;
};

const createCustomIcon = (status?: string) => {
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

const createPopupHtml = (ponto: UiMapaPonto) => {
  if (ponto.popupHtml) return ponto.popupHtml;

  const { color, label } = getStatusConfig(ponto.status);

  const subtitleHtml = ponto.subtitulo
    ? `<p style="color: #666; margin-bottom: 4px;">${ponto.subtitulo}</p>`
    : "";

  const linesHtml = (ponto.linhas ?? [])
    .map(
      (line) => `<p style="margin-bottom: 4px;"><strong>${line.rotulo}:</strong> ${line.valor}</p>`,
    )
    .join("");

  return `
    <div style="min-width: 200px;">
      <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">
        ${ponto.titulo}
      </h3>
      ${subtitleHtml}
      ${linesHtml}
      <p style="margin-bottom: 0;">
        <strong>Status:</strong> 
        <span style="color: ${color}; font-weight: bold;">${label}</span>
      </p>
    </div>
  `;
};

const clearMarkers = () => {
  markers.forEach((m) => m.remove());
  markers = [];
};

const toNumber = (value: number | string) => {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
};

const addMarker = (ponto: UiMapaPonto) => {
  if (!map) return null;

  const lat = toNumber(ponto.latitude);
  const lng = toNumber(ponto.longitude);
  if (lat === null || lng === null) return null;

  const marker = L.marker([lat, lng], {
    icon: createCustomIcon(ponto.status),
  });

  marker.bindPopup(createPopupHtml(ponto));
  marker.addTo(map);
  markers.push(marker);

  return [lat, lng] as [number, number];
};

const updateMapMarkers = () => {
  if (!map) return;

  clearMarkers();

  const validBounds: [number, number][] = [];

  for (const ponto of props.pontos) {
    const coords = addMarker(ponto);
    if (coords) validBounds.push(coords);
  }

  if (props.autoFitBounds && validBounds.length > 0) {
    map.fitBounds(validBounds, { padding: props.fitBoundsPadding });
    return;
  }

  map.setView(props.centro, props.zoomInicial);
};

const initMap = async () => {
  if (!mapContainer.value || map) return;

  map = L.map(mapContainer.value).setView(props.centro, props.zoomInicial);

  L.tileLayer(props.tileLayerUrl, {
    attribution: props.tileLayerAttribution,
    maxZoom: 19,
  }).addTo(map);

  await nextTick();
  map.invalidateSize();

  updateMapMarkers();
};

watch(() => props.pontos, updateMapMarkers, { deep: true });

onMounted(initMap);

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>
