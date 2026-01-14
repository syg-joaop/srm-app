import type { FitBoundsOptions } from "./maps.types";
import type { Map, LatLngBoundsExpression } from "leaflet";

/**
 * Composable para gerenciar bounds e viewport do mapa.
 */
export function useMapBounds() {
  /**
   * Ajusta a visualização do mapa para incluir todas as coordenadas.
   */
  const fitToBounds = (
    map: Map,
    coords: [number, number][],
    options: FitBoundsOptions = {},
  ): boolean => {
    if (!map || coords.length < 2) return false;

    try {
      map.fitBounds(coords as LatLngBoundsExpression, {
        padding: options.padding ?? [50, 50],
        maxZoom: options.maxZoom,
        animate: options.animate ?? true,
        duration: options.duration,
      });
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Define a visualização do mapa para um centro e zoom específicos.
   */
  const setView = (
    map: Map,
    center: [number, number],
    zoom: number,
    options: { animate?: boolean; duration?: number } = {},
  ): boolean => {
    if (!map) return false;

    try {
      map.setView(center, zoom, {
        animate: options.animate ?? true,
        duration: options.duration,
      });
      return true;
    } catch {
      return false;
    }
  };

  return { fitToBounds, setView };
}
