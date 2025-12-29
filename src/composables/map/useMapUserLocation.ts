import type { Map, CircleMarker, Polyline } from "leaflet";
import L from "leaflet";
import type { UserLocation } from "./maps.types";
import { toNumber } from "~/utils/coerce";

/**
 * Composable para gerenciar a localização do usuário no mapa.
 */
export function useMapUserLocation() {
  let userMarker: CircleMarker | null = null;
  let userToRouteLayer: Polyline | null = null;

  /**
   * Remove o marker do usuário do mapa.
   */
  const clearUserLocation = () => {
    if (userMarker) {
      userMarker.remove();
      userMarker = null;
    }
  };

  /**
   * Remove a linha do usuário até a rota.
   */
  const clearUserToRouteLine = () => {
    if (userToRouteLayer) {
      userToRouteLayer.remove();
      userToRouteLayer = null;
    }
  };

  /**
   * Atualiza ou cria o marker da localização do usuário.
   */
  const updateUserLocation = (
    map: Map,
    userLocation: UserLocation | null,
  ): [number, number] | null => {
    clearUserLocation();

    if (!userLocation) {
      return null;
    }

    const lat = toNumber(userLocation.latitude);
    const lng = toNumber(userLocation.longitude);

    if (lat === null || lng === null) {
      return null;
    }

    const userCoords: [number, number] = [lat, lng];

    userMarker = L.circleMarker(userCoords, {
      radius: 8,
      color: "#ffffff",
      weight: 2,
      fillColor: "#2563eb",
      fillOpacity: 1,
    }).addTo(map);

    userMarker.bindPopup("Sua localização");

    return userCoords;
  };

  /**
   * Desenha uma linha tracejada da localização do usuário até o início da rota.
   */
  const drawUserToRouteLine = (
    map: Map,
    userCoords: [number, number],
    routeStartCoords: [number, number] | null,
  ) => {
    clearUserToRouteLine();

    if (!routeStartCoords) {
      return;
    }

    userToRouteLayer = L.polyline([userCoords, routeStartCoords], {
      color: "#2563eb",
      weight: 3,
      opacity: 0.6,
      dashArray: "4 6",
      lineJoin: "round",
      lineCap: "round",
    }).addTo(map);
  };

  /**
   * Obtém as coordenadas do início da rota a partir da polyline ou dos pontos.
   */
  const getRouteStartCoords = (
    polylineCoords?: [number, number][],
    pontos?: { latitude: number | string; longitude: number | string; sequencia?: number }[],
  ): [number, number] | null => {
    // Tenta obter da polyline primeiro
    if (polylineCoords && polylineCoords.length > 0) {
      return polylineCoords[0];
    }

    // Tenta obter do primeiro ponto
    if (pontos && pontos.length > 0) {
      const sortedPontos = [...pontos].sort(
        (a, b) => (a.sequencia || 0) - (b.sequencia || 0),
      );
      const firstPonto = sortedPontos[0];
      const lat = toNumber(firstPonto.latitude);
      const lng = toNumber(firstPonto.longitude);

      if (lat !== null && lng !== null) {
        return [lat, lng];
      }
    }

    return null;
  };

  /**
   * Limpa todos os elementos relacionados à localização do usuário.
   */
  const clearAll = () => {
    clearUserLocation();
    clearUserToRouteLine();
  };

  return {
    updateUserLocation,
    drawUserToRouteLine,
    getRouteStartCoords,
    clearUserLocation,
    clearUserToRouteLine,
    clearAll,
  };
}
