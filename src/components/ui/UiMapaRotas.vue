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
      <svg v-if="!isLocating" class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
        />
      </svg>
      <svg
        v-else
        class="w-5 h-5 text-blue-600 animate-pulse"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import { useMapBounds, useMapMarkers, useMapPolyline, useMapUserLocation } from "~/composables/map";
import { logger } from "~/utils/logger";

import type {
  MapaPonto,
  MapaStatusConfig,
  RotaPolylineConfig,
  UserLocation,
} from "~/composables/map";
import type { UiMapaStatusConfig } from "./maps.types";

export interface RotaPonto {
  id: number | string;
  latitude: number | string;
  longitude: number | string;
  titulo: string;
  subtitulo?: string;
  sequencia?: number;
  status?: string;
  endereco?: {
    rua?: string;
    numero?: string;
    cidade?: string;
    bairro?: string;
  };
}

const props = withDefaults(
  defineProps<{
    points?: RotaPonto[];
    polyline?: string;
    routeCoords?: [number, number][];
    center?: [number, number];
    initialZoom?: number;
    boundsPadding?: [number, number];
    autoFitBounds?: boolean;
    showSequence?: boolean;
    statusConfig?: UiMapaStatusConfig;
    polylineConfig?: RotaPolylineConfig;
    mapType?: "roadmap" | "satellite" | "hybrid" | "terrain";
    userLocation?: UserLocation | null;
    includeUserInBounds?: boolean;
    showUserRouteLine?: boolean;
    showLocationButton?: boolean;
  }>(),
  {
    points: () => [],
    center: () => [-15.7801, -47.9292] as [number, number],
    initialZoom: 4,
    boundsPadding: () => [50, 50],
    autoFitBounds: true,
    showSequence: true,
    statusConfig: () => ({
      aguardando: { color: "#6b7280", label: "Aguardando" },
      pendente: { color: "#f59e0b", label: "Pendente" },
      em_andamento: { color: "#3b82f6", label: "Em Andamento" },
      concluida: { color: "#10b981", label: "Concluída" },
      cancelada: { color: "#ef4444", label: "Cancelada" },
    }),
    polylineConfig: () => ({
      color: "#4285F4",
      weight: 5,
      opacity: 1,
    }),
    mapType: "roadmap",
    userLocation: null,
    includeUserInBounds: false,
    showUserRouteLine: true,
    showLocationButton: true,
  },
);

const emit = defineEmits<{
  (e: "markerClick", ponto: RotaPonto): void;
}>();

// Composables de mapa
const mapMarkers = useMapMarkers();
const mapPolyline = useMapPolyline();
const mapUserLocation = useMapUserLocation();
const mapBounds = useMapBounds();

// Geolocalização
const { position: currentPosition, getCurrentPosition } = useGeolocation({
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 30000,
});

const isLocating = ref(false);

const mapContainerRef = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let mapTileLayer: L.TileLayer | null = null;

// Configuração de status
const resolvedStatusConfig = computed<Record<string, MapaStatusConfig>>(() => ({
  aguardando: { color: "#6b7280", label: "Aguardando" },
  pendente: { color: "#f59e0b", label: "Pendente" },
  em_andamento: { color: "#3b82f6", label: "Em Andamento" },
  concluida: { color: "#10b981", label: "Concluída" },
  cancelada: { color: "#ef4444", label: "Cancelada" },
  ...props.statusConfig,
}));

const getStatus = (status?: string): MapaStatusConfig => {
  const normalized = (status ?? "aguardando").toLowerCase().trim();
  return resolvedStatusConfig.value[normalized] || resolvedStatusConfig.value.aguardando;
};

// Configuração do tile layer
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

/**
 * Inicializa o mapa Leaflet
 */
const initMap = () => {
  if (!mapContainerRef.value || map) return;

  map = L.map(mapContainerRef.value, {
    center: props.center,
    zoom: props.initialZoom,
    zoomControl: true,
  });

  const tileConfig = getTileConfig(props.mapType);
  mapTileLayer = L.tileLayer(tileConfig.url, {
    attribution: tileConfig.attribution,
    maxZoom: 19,
  }).addTo(map);

  updateMap();
};

/**
 * Atualiza markers, polyline e localização do usuário
 */
const updateMap = () => {
  if (!map) return;

  // Limpa tudo
  mapMarkers.clearMarkers();
  mapUserLocation.clearAll();

  // Coordenadas válidas para bounds
  const validBounds: [number, number][] = [];

  // Adiciona markers
  const pointsWithStatus: MapaPonto[] = props.points.map((p) => ({
    ...p,
    endereco: p.endereco
      ? {
          rua: p.endereco.rua,
          numero: p.endereco.numero,
          bairro: p.endereco.bairro,
          cidade: p.endereco.cidade,
        }
      : undefined,
  }));

  const markerBounds = mapMarkers.addMarkers(map, pointsWithStatus, getStatus);
  validBounds.push(...markerBounds);

  // Renderiza polyline
  const { coordinates: routeCoords } = mapPolyline.renderPolyline(map, {
    encodedPolyline: props.polyline,
    polylineCoords: props.routeCoords,
    pontos: pointsWithStatus,
    config: props.polylineConfig,
  });

  // Adiciona bounds da polyline se existir
  if (routeCoords.length >= 2) {
    const first = routeCoords[0];
    const last = routeCoords[routeCoords.length - 1];
    validBounds.push(first, last);
  }

  const hasRouteBounds = validBounds.length > 0;

  // Atualiza localização do usuário
  let userCoords: [number, number] | null = null;

  if (props.userLocation) {
    userCoords = mapUserLocation.updateUserLocation(map, props.userLocation);
  }

  // Inclui localização do usuário nos bounds se configurado
  if ((!hasRouteBounds || props.includeUserInBounds) && userCoords) {
    validBounds.push(userCoords);
  }

  // Desenha linha do usuário até a rota
  if (props.showUserRouteLine && userCoords) {
    const routeStart = mapUserLocation.getRouteStartCoords(routeCoords, props.points);
    mapUserLocation.drawUserToRouteLine(map, userCoords, routeStart);
  }

  // Ajusta view
  if (props.autoFitBounds && mapBounds.isValidBounds(validBounds)) {
    mapBounds.fitToBounds(map, validBounds, {
      padding: props.boundsPadding,
    });
  } else {
    mapBounds.setView(map, props.center, props.initialZoom);
  }
};

/**
 * Botão "Minha Localização"
 */
const locateUser = async () => {
  if (!map) return;

  isLocating.value = true;

  try {
    await getCurrentPosition();

    if (currentPosition.value) {
      const userCoords: [number, number] = [
        currentPosition.value.latitude,
        currentPosition.value.longitude,
      ];

      mapBounds.fitToBounds(map, [userCoords], {
        padding: [100, 100],
        maxZoom: 15,
      });
    }
  } catch (err) {
    logger.error("Erro ao obter localização:", err);
  } finally {
    isLocating.value = false;
  }
};

// Watch para mudanças nas props
watch(
  () => [props.points, props.polyline, props.routeCoords, props.userLocation],
  () => {
    if (map) updateMap();
  },
  { deep: true },
);

// Watch para mudanças no tipo de mapa
watch(
  () => props.mapType,
  () => {
    if (!map || !mapTileLayer) return;

    const tileConfig = getTileConfig(props.mapType);
    mapTileLayer.setUrl(tileConfig.url);
    // Note: setAttribution não existe no TileLayer do Leaflet
    // Para alterar attribution, seria necessário remover e recriar a camada
  },
);

// Inicializa o mapa quando o componente for montado
onMounted(() => {
  if (import.meta.client) {
    initMap();
  }
});

// Limpeza quando o componente for desmontado
onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>
