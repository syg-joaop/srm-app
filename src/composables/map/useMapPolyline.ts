import L from "leaflet";

import { toNumber } from "~/utils/coerce";
import { areValidCoordinates } from "~/composables/map/utils/typeGuards";
import { filterValidCoordinates } from "~/utils/geo/coordinateUtils";
import {
  decodePolyline,
  getBoundsCenter,
  normalizePolylineString,
} from "~/composables/map/utils/polyline";

import type { MapaPonto, RotaPolylineConfig } from "./maps.types";
import type { Map, Polyline } from "leaflet";

/**
 * Composable para gerenciar polylines em um mapa Leaflet.
 */
export function useMapPolyline() {
  let polylineLayer: Polyline | null = null;

  /**
   * Remove a polyline do mapa.
   */
  const clearPolyline = () => {
    if (polylineLayer) {
      polylineLayer.remove();
      polylineLayer = null;
    }
  };

  /**
   * Renderiza a polyline no mapa.
   */
  const renderPolyline = (
    map: Map,
    options: {
      encodedPolyline?: string;
      polylineCoords?: [number, number][];
      pontos?: MapaPonto[];
      config: RotaPolylineConfig;
    },
  ): { coordinates: [number, number][]; isFallback: boolean } => {
    if (!map) {
      return { coordinates: [], isFallback: false };
    }

    clearPolyline();

    let coordinates: [number, number][] = [];
    let isFallback = false;

    // Se tiver polyline encoded, decodifica
    if (options.encodedPolyline) {
      const normalized = normalizePolylineString(options.encodedPolyline);
      if (!normalized) {
        return { coordinates: [], isFallback: false };
      }

      // Tenta obter coordenadas de referência dos pontos
      const referenceCoords: [number, number][] = [];
      if (options.pontos) {
        for (const ponto of options.pontos) {
          const lat = toNumber(ponto.latitude);
          const lng = toNumber(ponto.longitude);

          if (!areValidCoordinates(lat, lng)) {
            continue;
          }

          // Type assertion: after areValidCoordinates check, lat and lng are guaranteed to be number
          referenceCoords.push([lat as number, lng as number]);
        }
      }

      const refCenter = getBoundsCenter(referenceCoords);

      // Decodifica com diferentes precisões
      const decoded5 = filterValidCoordinates(decodePolyline(normalized, 5));
      const decoded6 = filterValidCoordinates(decodePolyline(normalized, 6));

      coordinates = filterValidCoordinates(decodePolyline(normalized));

      // Escolhe a melhor precisão baseada no centro de referência
      if (refCenter) {
        const distanceSquared = (a: [number, number], b: [number, number]) =>
          (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;

        const center5 = getBoundsCenter(decoded5);
        const center6 = getBoundsCenter(decoded6);

        const score5 = center5 ? distanceSquared(center5, refCenter) : Number.POSITIVE_INFINITY;
        const score6 = center6 ? distanceSquared(center6, refCenter) : Number.POSITIVE_INFINITY;

        coordinates = score6 < score5 ? decoded6 : decoded5;
      }
    }
    // Se tiver coordenadas já decodificadas
    else if (options.polylineCoords && options.polylineCoords.length > 0) {
      coordinates = options.polylineCoords;
    }

    // Fallback: desenha uma linha reta conectando os pontos quando não há polyline
    if (coordinates.length < 2 && options.pontos && options.pontos.length > 0) {
      const fallbackCoords: [number, number][] = [];
      const sortedPontos = [...options.pontos].sort(
        (a, b) => (a.sequencia || 0) - (b.sequencia || 0),
      );

      for (const ponto of sortedPontos) {
        const lat = toNumber(ponto.latitude);
        const lng = toNumber(ponto.longitude);

        if (!areValidCoordinates(lat, lng)) {
          continue;
        }

        // Type assertion: after areValidCoordinates check, lat and lng are guaranteed to be number
        fallbackCoords.push([lat as number, lng as number]);
      }

      if (fallbackCoords.length >= 2) {
        coordinates = fallbackCoords;
        isFallback = true;
      }
    }

    if (coordinates.length < 2) {
      return { coordinates: [], isFallback: false };
    }

    // Aplica configuração de fallback se necessário
    const fallbackConfig: RotaPolylineConfig = {
      color: "#9ca3af",
      weight: 3,
      opacity: 0.75,
      dashArray: "6 6",
    };

    const finalConfig = isFallback
      ? { ...options.config, ...fallbackConfig }
      : options.config;

    // Cria e adiciona a polyline ao mapa
    polylineLayer = L.polyline(coordinates, {
      color: finalConfig.color,
      weight: finalConfig.weight,
      opacity: finalConfig.opacity,
      dashArray: finalConfig.dashArray,
      lineJoin: "round",
      lineCap: "round",
    });

    polylineLayer.addTo(map);

    return { coordinates, isFallback };
  };

  /**
   * Retorna a instância da polyline atual.
   */
  const getPolyline = () => polylineLayer;

  return {
    renderPolyline,
    clearPolyline,
    getPolyline,
  };
}


