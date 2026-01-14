import L from "leaflet";

import { toNumber } from "~/utils/coerce";
import { filterValidCoordinates } from "~/utils/geo/coordinateUtils";
import { decodePolyline, normalizePolylineString } from "~/composables/map/utils/polyline";

import type { MapaPonto, RotaPolylineConfig } from "./maps.types";
import type { Map, Polyline } from "leaflet";

const FALLBACK_CONFIG: RotaPolylineConfig = {
  color: "#9ca3af",
  weight: 3,
  opacity: 0.75,
  dashArray: "6 6",
};

/**
 * Extrai coordenadas válidas de um array de pontos.
 */
const extractCoordinates = (pontos: MapaPonto[]): [number, number][] => {
  return [...pontos]
    .sort((a, b) => (a.sequencia ?? 0) - (b.sequencia ?? 0))
    .map((p) => {
      const lat = toNumber(p.latitude);
      const lng = toNumber(p.longitude);
      return lat !== undefined && lng !== undefined ? ([lat, lng] as [number, number]) : null;
    })
    .filter((c): c is [number, number] => c !== null);
};

/**
 * Composable para gerenciar polylines em um mapa Leaflet.
 */
export function useMapPolyline() {
  let polylineLayer: Polyline | null = null;

  const clearPolyline = () => {
    if (polylineLayer) {
      polylineLayer.remove();
      polylineLayer = null;
    }
  };

  const renderPolyline = (
    map: Map,
    options: {
      encodedPolyline?: string;
      polylineCoords?: [number, number][];
      pontos?: MapaPonto[];
      config: RotaPolylineConfig;
    },
  ): { coordinates: [number, number][]; isFallback: boolean } => {
    if (!map) return { coordinates: [], isFallback: false };

    clearPolyline();

    let coordinates: [number, number][] = [];
    let isFallback = false;

    // 1. Tenta decodificar polyline encoded
    if (options.encodedPolyline) {
      const normalized = normalizePolylineString(options.encodedPolyline);
      if (normalized) {
        coordinates = filterValidCoordinates(decodePolyline(normalized));
      }
    }

    // 2. Usa coordenadas passadas diretamente
    if (coordinates.length < 2 && options.polylineCoords?.length) {
      coordinates = options.polylineCoords;
    }

    // 3. Fallback: linha reta entre pontos
    if (coordinates.length < 2 && options.pontos?.length) {
      const fallbackCoords = extractCoordinates(options.pontos);
      if (fallbackCoords.length >= 2) {
        coordinates = fallbackCoords;
        isFallback = true;
      }
    }

    if (coordinates.length < 2) return { coordinates: [], isFallback: false };

    const config = isFallback ? { ...options.config, ...FALLBACK_CONFIG } : options.config;

    polylineLayer = L.polyline(coordinates, {
      color: config.color,
      weight: config.weight,
      opacity: config.opacity,
      dashArray: config.dashArray,
      lineJoin: "round",
      lineCap: "round",
    }).addTo(map);

    return { coordinates, isFallback };
  };

  return { renderPolyline, clearPolyline };
}
