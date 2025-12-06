<template>
  <div class="h-[600px] w-full rounded-xl overflow-hidden border" style="border-color: var(--color-border)">
    <div ref="mapContainer" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Supplier } from "../types/supplier";

const props = defineProps<{
  suppliers?: Supplier[];
}>();

const mapContainer = ref<HTMLElement>();
let map: L.Map | null = null;
let markers: L.Marker[] = [];

const statusColors = {
  active: "#10b981",
  alert: "#f59e0b",
  inactive: "#ef4444",
};

const createCustomIcon = (status: Supplier["status"]) => {
  const color = statusColors[status];
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const initMap = () => {
  if (!mapContainer.value || map) return;

  map = L.map(mapContainer.value).setView([-15.7801, -47.9292], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  updateMarkers();
};

const updateMarkers = () => {
  if (!map) return;

  markers.forEach(marker => marker.remove());
  markers = [];

  const suppliersWithCoords = (props.suppliers || []).filter(s => s.hasCoordinates);

  if (suppliersWithCoords.length === 0) return;

  const bounds: [number, number][] = [];

  suppliersWithCoords.forEach(supplier => {
    if (!supplier.latitude || !supplier.longitude) return;

    const marker = L.marker([supplier.latitude, supplier.longitude], {
      icon: createCustomIcon(supplier.status),
    });

    const statusText = {
      active: "Ativo",
      alert: "Alerta",
      inactive: "Inativo",
    }[supplier.status];

    const statusStyle = `color: ${statusColors[supplier.status]}; font-weight: bold;`;

    marker.bindPopup(`
      <div style="min-width: 200px;">
        <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${supplier.name}</h3>
        ${supplier.fantasy ? `<p style="color: #666; margin-bottom: 4px;">${supplier.fantasy}</p>` : ""}
        <p style="margin-bottom: 4px;"><strong>Cidade:</strong> ${supplier.city}</p>
        <p style="margin-bottom: 4px;"><strong>Última carga:</strong> ${supplier.lastLoad}</p>
        <p style="margin-bottom: 0;"><strong>Status:</strong> <span style="${statusStyle}">${statusText}</span></p>
      </div>
    `);

    marker.addTo(map!);
    markers.push(marker);
    bounds.push([supplier.latitude, supplier.longitude]);
  });

  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }
};

watch(() => props.suppliers, () => {
  if (map) {
    updateMarkers();
  }
}, { deep: true });

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>
