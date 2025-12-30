<template>
  <div class="relative w-full h-full">
    <div ref="mapContainer" class="w-full h-full"></div>

    <!-- Botão de geolocalização estilo Google Maps -->
    <button
      v-if="showLocationButton"
      class="absolute bottom-24 right-3 z-[1000] bg-white rounded-sm shadow-md hover:shadow-lg transition-shadow w-10 h-10 flex items-center justify-center border border-gray-300"
      :class="{ 'bg-blue-50': isLocating }"
      title="Minha localização"
      @click="locateUser"
    >
      <svg
        v-if="!isLocating"
        class="w-5 h-5 text-gray-700"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
      </svg>
      <svg
        v-else
        class="w-5 h-5 text-blue-600 animate-pulse"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
      </svg>
    </button>

    <!-- Mensagem de erro de geolocalização -->
    <div
      v-if="geoError"
      class="absolute top-4 left-4 right-4 z-[1000] bg-white rounded shadow-lg p-3 border border-yellow-400"
    >
      <div class="flex items-start gap-2 text-sm">
        <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <div class="flex-1">
          <p class="text-gray-800">{{ geoError }}</p>
          <button
            class="mt-2 text-xs font-medium text-blue-600 hover:underline"
            @click="locateUser"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
    showLocationButton?: boolean;
    mapType?: "roadmap" | "satellite" | "hybrid" | "terrain";
  }>(),
  {
    pontos: () => [],
    centro: () => [-15.7801, -47.9292] as [number, number],
    zoomInicial: 4,
    fitBoundsPadding: () => [50, 50],
    autoFitBounds: true,
    showLocationButton: true,
    mapType: "roadmap",
    statusConfig: () => ({
      ativo: { color: "#10b981", label: "Ativo" },
      alerta: { color: "#f59e0b", label: "Alerta" },
      inativo: { color: "#ef4444", label: "Inativo" },
    }),
  },
);

const statusConfig = computed<UiMapaStatusConfig>(() => ({
  ativo: { color: "#10b981", label: "Ativo" },
  alerta: { color: "#f59e0b", label: "Alerta" },
  inativo: { color: "#ef4444", label: "Inativo" },
  ...props.statusConfig,
}));

const mapContainer = ref<HTMLElement | null>(null);
const isLocating = ref(false);
const geoError = ref<string | null>(null);

let map: L.Map | null = null;
let markers: L.Marker[] = [];
let userMarker: L.CircleMarker | null = null;

// Geolocalização
const { position, getCurrentPosition, error } = useGeolocation({
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 30000,
});

// Observa erros de geolocalização
watch(error, (newError) => {
  if (newError) {
    geoError.value = newError;
  }
});

const normalizeStatus = (status?: string) => (status ?? "").toLowerCase().trim();

const getStatus = (status?: string) => {
  const normalized = normalizeStatus(status);
  return statusConfig.value[normalized] || statusConfig.value.inativo;
};

// Tiles do Google Maps (gratuito, sem API key)
const getTileConfig = (type: string) => {
  const configs = {
    roadmap: {
      url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
    },
    satellite: {
      url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
    },
    hybrid: {
      url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
      attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
    },
    terrain: {
      url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
      attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
    },
  };

  return configs[type as keyof typeof configs] || configs.roadmap;
};

const createIcon = (status?: string) => {
  const { color } = getStatus(status);
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

const createPopup = (ponto: UiMapaPonto) => {
  if (ponto.popupHtml) return ponto.popupHtml;

  const { color, label } = getStatus(ponto.status);

  const subtitleHtml = ponto.subtitulo
    ? `<div style="color: var(--color-text-muted); margin: 0; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 6px; padding-right: 40px;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        ${ponto.subtitulo}
       </div>`
    : "";

  const linesHtml = (ponto.linhas ?? [])
    .map(
      (line, index) => `
        <div style="
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: var(--color-surface);
          border-left: 2px solid var(--color-border);
          border-radius: 6px;
          transition: all 0.2s ease;
          margin-bottom: ${index === (ponto.linhas?.length || 0) - 1 ? '0' : '6px'};
        ">
          <div style="
            width: 28px;
            height: 28px;
            min-width: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-background);
            border-radius: 6px;
            border: 1px solid var(--color-border-subtle);
          ">
            <svg style="width: 14px; height: 14px; color: var(--color-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              ${line.rotulo.toLowerCase().includes('cidade')
                ? '<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />'
                : '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />'}
            </svg>
          </div>
          <div style="flex: 1; min-width: 0;">
            <div style="
              color: var(--color-text-muted);
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 2px;
            ">
              ${line.rotulo}
            </div>
            <div style="
              color: var(--color-text);
              font-size: 13px;
              font-weight: 600;
              word-break: break-word;
            ">
              ${line.valor}
            </div>
          </div>
        </div>
      `,
    )
    .join("");

  return `
    <div style="
      min-width: 240px;
      font-family: var(--font-family);
      -webkit-font-smoothing: antialiased;
    ">
      <!-- Container Principal com Sombra -->
      <div style="
        background: var(--color-background);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      ">
        <!-- Header com Gradiente -->
        <div style="
          position: relative;
          padding: 16px 48px 14px 16px;
          background: linear-gradient(135deg, ${color}08 0%, ${color}15 100%);
          border-bottom: 1px solid var(--color-border-subtle);
        ">
          <!-- Barra Lateral -->
          <div style="
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(180deg, ${color} 0%, ${color}cc 100%);
          "></div>

          <!-- Botão de Fechar Customizado -->
          <button
            onclick="this.closest('.leaflet-popup').remove()"
            style="
              position: absolute;
              top: 8px;
              right: 8px;
              width: 40px;
              height: 40px;
              min-width: 40px;
              min-height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: var(--color-background);
              border: 1px solid var(--color-border);
              border-radius: 8px;
              cursor: pointer;
              padding: 0;
              transition: all 0.2s ease;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            "
            onmouseover="this.style.background='var(--color-hover)'; this.style.borderColor='var(--color-border)';"
            onmouseout="this.style.background='var(--color-background)';"
            aria-label="Fechar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="color: var(--color-text);"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Título -->
          <h3 style="
            font-weight: 700;
            margin: 0 0 6px 0;
            font-size: 15px;
            color: var(--color-text);
            line-height: 1.3;
            letter-spacing: -0.01em;
          ">
            ${ponto.titulo}
          </h3>

          <!-- Subtítulo -->
          ${subtitleHtml}
        </div>

        <!-- Badge de Status -->
        <div style="
          padding: 12px 16px 8px 16px;
        ">
          <div style="
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 12px;
            background: ${color}12;
            border: 1px solid ${color}30;
            border-radius: 20px;
            box-shadow: 0 2px 4px ${color}15;
          ">
            <div style="
              width: 7px;
              height: 7px;
              background: ${color};
              border-radius: 50%;
              box-shadow: 0 0 8px ${color}60;
              animation: pulse 2s ease-in-out infinite;
            "></div>
            <span style="
              font-size: 11px;
              font-weight: 700;
              color: ${color};
              text-transform: uppercase;
              letter-spacing: 0.6px;
            ">
              ${label}
            </span>
          </div>
        </div>

        <!-- Linhas de Informação -->
        <div style="
          padding: 0 16px 16px 16px;
        ">
          <div style="
            display: flex;
            flex-direction: column;
          ">
            ${linesHtml}
          </div>
        </div>
      </div>

      <style>
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 8px !important;
        }

        .leaflet-popup-content {
          margin: 0 !important;
          min-width: 240px !important;
        }

        .leaflet-popup-tip {
          display: none;
        }

        .leaflet-popup-close-button {
          display: none !important;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      </style>
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
    icon: createIcon(ponto.status),
  });

  marker.bindPopup(createPopup(ponto));
  marker.addTo(map);
  markers.push(marker);

  return [lat, lng] as [number, number];
};

const updateUserMarker = (lat: number, lng: number) => {
  if (!map) return;

  if (userMarker) {
    userMarker.setLatLng([lat, lng]);
  } else {
    // Cria marcador estilo Google Maps (círculo azul com borda branca)
    userMarker = L.circleMarker([lat, lng], {
      radius: 8,
      fillColor: "#4285F4",
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 1,
    });

    // Adiciona círculo de precisão
    const accuracyCircle = L.circle([lat, lng], {
      radius: 50, // Pode ajustar baseado na precisão real
      fillColor: "#4285F4",
      color: "#4285F4",
      weight: 1,
      opacity: 0.2,
      fillOpacity: 0.1,
    });

    userMarker.addTo(map);
    accuracyCircle.addTo(map);

    userMarker.bindPopup("Sua localização atual");
  }
};

const locateUser = async () => {
  isLocating.value = true;
  geoError.value = null;

  try {
    const pos = await getCurrentPosition();

    if (pos && map) {
      updateUserMarker(pos.latitude, pos.longitude);
      map.flyTo([pos.latitude, pos.longitude], 15, {
        duration: 1,
      });
    }
  } catch (err) {
    geoError.value = "Não foi possível obter sua localização";
  } finally {
    isLocating.value = false;
  }
};

const updateMarkers = () => {
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

  const tileConfig = getTileConfig(props.mapType);

  map = L.map(mapContainer.value, {
    zoomControl: true,
    attributionControl: true,
  }).setView(props.centro, props.zoomInicial);

  L.tileLayer(tileConfig.url, {
    attribution: tileConfig.attribution,
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }).addTo(map);

  await nextTick();
  map.invalidateSize();

  updateMarkers();

  // Tenta obter localização inicial
  if (props.showLocationButton && position.value) {
    updateUserMarker(position.value.latitude, position.value.longitude);
  }
};

// Observa mudanças na posição do usuário
watch(position, (newPos) => {
  if (newPos && map && !isLocating.value) {
    updateUserMarker(newPos.latitude, newPos.longitude);
  }
}, { deep: true });

watch(() => props.pontos, updateMarkers, { deep: true });

onMounted(initMap);

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});

defineExpose({
  locateUser,
  map,
});
</script>
