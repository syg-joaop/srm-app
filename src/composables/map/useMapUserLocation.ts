import L from "leaflet";

import { toNumber } from "~/utils/coerce";

import type { UserLocation } from "./maps.types";
import type { Map, CircleMarker, Polyline } from "leaflet";

/**
 * Composable para gerenciar a localização do usuário no mapa.
 */
export function useMapUserLocation() {
  let userMarker: CircleMarker | null = null;
  let userToRouteLayer: Polyline | null = null;

  const clearLayer = (layer: { remove: () => void } | null) => {
    layer?.remove();
  };

  const clearUserLocation = () => {
    clearLayer(userMarker);
    userMarker = null;
  };

  const clearUserToRouteLine = () => {
    clearLayer(userToRouteLayer);
    userToRouteLayer = null;
  };

  const clearAll = () => {
    clearUserLocation();
    clearUserToRouteLine();
  };

  const updateUserLocation = (map: Map, userLocation: UserLocation | null): [number, number] | null => {
    clearUserLocation();
    if (!userLocation) return null;

    const lat = toNumber(userLocation.latitude);
    const lng = toNumber(userLocation.longitude);
    if (lat === undefined || lng === undefined) return null;

    const coords: [number, number] = [lat, lng];

    userMarker = L.circleMarker(coords, {
      radius: 8,
      color: "#ffffff",
      weight: 2,
      fillColor: "#2563eb",
      fillOpacity: 1,
    })
      .addTo(map)
      .bindPopup("Sua localização");

    return coords;
  };

  const drawUserToRouteLine = (map: Map, userCoords: [number, number], routeStartCoords: [number, number] | null) => {
    clearUserToRouteLine();
    if (!routeStartCoords) return;

    userToRouteLayer = L.polyline([userCoords, routeStartCoords], {
      color: "#2563eb",
      weight: 3,
      opacity: 0.6,
      dashArray: "4 6",
      lineJoin: "round",
      lineCap: "round",
    }).addTo(map);
  };

  const getRouteStartCoords = (
    polylineCoords?: [number, number][],
    pontos?: { latitude: number | string; longitude: number | string; sequencia?: number }[],
  ): [number, number] | null => {
    if (polylineCoords?.length) return polylineCoords[0];

    if (pontos?.length) {
      const first = [...pontos].sort((a, b) => (a.sequencia ?? 0) - (b.sequencia ?? 0))[0];
      const lat = toNumber(first.latitude);
      const lng = toNumber(first.longitude);
      if (lat !== undefined && lng !== undefined) return [lat, lng];
    }

    return null;
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
