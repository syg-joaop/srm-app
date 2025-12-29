<template>
  <div class="relative w-full h-full">
    <div ref="mapContainer" class="w-full h-full"></div>

    <!-- Botão de geolocalização estilo Google Maps -->
    <button
      v-if="showMyLocationButton"
      class="absolute bottom-24 right-3 z-[1000] bg-white rounded-sm shadow-md hover:shadow-lg transition-shadow w-10 h-10 flex items-center justify-center border border-gray-300"
      :class="{ 'bg-blue-50': isGettingLocation }"
      title="Minha localização"
      @click="goToMyLocation"
    >
      <svg
        v-if="!isGettingLocation"
        class="w-5 h-5 text-gray-700"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
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
import type { UiMapaStatusConfig } from "./maps.types";
import type { MapaPonto, MapaStatusConfig, RotaPolylineConfig, UserLocation } from "~/composables/map";
import {
  useMapMarkers,
  useMapPolyline,
  useMapUserLocation,
  useMapBounds,
} from "~/composables/map";

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
    pontos?: RotaPonto[];
    polyline?: string; // Encoded polyline string
    polylineCoords?: [number, number][]; // Ou coordenadas já decodificadas
    centro?: [number, number];
    zoomInicial?: number;
    fitBoundsPadding?: [number, number];
    autoFitBounds?: boolean;
    showSequence?: boolean;
    statusConfig?: UiMapaStatusConfig;
    polylineConfig?: RotaPolylineConfig;
    mapType?: "roadmap" | "satellite" | "hybrid" | "terrain";
    userLocation?: UserLocation | null;
    includeUserInFitBounds?: boolean;
    showUserToRouteLine?: boolean;
    showMyLocationButton?: boolean;
  }>(),
  {
    pontos: () => [],
    centro: () => [-15.7801, -47.9292] as [number, number],
    zoomInicial: 4,
    fitBoundsPadding: () => [50, 50],
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
    includeUserInFitBounds: false,
    showUserToRouteLine: true,
    showMyLocationButton: true,
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
const { position: geoPosition, getCurrentPosition } = useGeolocation({
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 30000,
});

const isGettingLocation = ref(false);

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let tileLayer: L.TileLayer | null = null;

// Configuração de status
const resolvedStatusConfig = computed<Record<string, MapaStatusConfig>>(() => ({
  aguardando: { color: "#6b7280", label: "Aguardando" },
  pendente: { color: "#f59e0b", label: "Pendente" },
  em_andamento: { color: "#3b82f6", label: "Em Andamento" },
  concluida: { color: "#10b981", label: "Concluída" },
  cancelada: { color: "#ef4444", label: "Cancelada" },
  ...props.statusConfig,
}));

const getStatusConfig = (status?: string): MapaStatusConfig => {
  const normalized = (status ?? "aguardando").toLowerCase().trim();
  return resolvedStatusConfig.value[normalized] || resolvedStatusConfig.value.aguardando;
};

// Configuração do tile layer
const getTileLayerConfig = (type: string) => {
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
  if (!mapContainer.value || map) return;

  map = L.map(mapContainer.value, {
    center: props.centro,
    zoom: props.zoomInicial,
    zoomControl: true,
  });

  const tileConfig = getTileLayerConfig(props.mapType);
  tileLayer = L.tileLayer(tileConfig.url, {
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
  const pontosComStatus: MapaPonto[] = props.pontos.map((p) => ({
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

  const markerBounds = mapMarkers.addMarkers(map, pontosComStatus, getStatusConfig);
  validBounds.push(...markerBounds);

  // Renderiza polyline
  const { coordinates: polylineCoords } = mapPolyline.renderPolyline(map, {
    encodedPolyline: props.polyline,
    polylineCoords: props.polylineCoords,
    pontos: pontosComStatus,
    config: props.polylineConfig,
  });

  // Adiciona bounds da polyline se existir
  if (polylineCoords.length >= 2) {
    const first = polylineCoords[0];
    const last = polylineCoords[polylineCoords.length - 1];
    validBounds.push(first, last);
  }

  const hasRouteBounds = validBounds.length > 0;

  // Atualiza localização do usuário
  let userCoords: [number, number] | null = null;

  if (props.userLocation) {
    userCoords = mapUserLocation.updateUserLocation(map, props.userLocation);
  }

  // Inclui localização do usuário nos bounds se configurado
  if ((!hasRouteBounds || props.includeUserInFitBounds) && userCoords) {
    validBounds.push(userCoords);
  }

  // Desenha linha do usuário até a rota
  if (props.showUserToRouteLine && userCoords) {
    const routeStart = mapUserLocation.getRouteStartCoords(polylineCoords, props.pontos);
    mapUserLocation.drawUserToRouteLine(map, userCoords, routeStart);
  }

  // Ajusta view
  if (props.autoFitBounds && mapBounds.isValidBounds(validBounds)) {
    mapBounds.fitToBounds(map, validBounds, {
      padding: props.fitBoundsPadding,
    });
  } else {
    mapBounds.setView(map, props.centro, props.zoomInicial);
  }
};

/**
 * Botão "Minha Localização"
 */
const goToMyLocation = async () => {
  if (!map) return;

  isGettingLocation.value = true;

  try {
    await getCurrentPosition();

    if (geoPosition.value) {
      const userCoords: [number, number] = [
        geoPosition.value.latitude,
        geoPosition.value.longitude,
      ];

      mapBounds.fitToBounds(map, [userCoords], {
        padding: [100, 100],
        maxZoom: 15,
      });
    }
  } catch (err) {
    console.error("Erro ao obter localização:", err);
  } finally {
    isGettingLocation.value = false;
  }
};

// Watch para mudanças nas props
watch(
  () => [props.pontos, props.polyline, props.polylineCoords, props.userLocation],
  () => {
    if (map) updateMap();
  },
  { deep: true },
);

// Watch para mudanças no tipo de mapa
watch(() => props.mapType, () => {
  if (!map || !tileLayer) return;

  const tileConfig = getTileLayerConfig(props.mapType);
  tileLayer.setUrl(tileConfig.url);
  tileLayer.setAttribution(tileConfig.attribution);
});

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
