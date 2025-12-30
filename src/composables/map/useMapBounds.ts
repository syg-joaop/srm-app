import { logger } from "~/utils/logger";

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
    if (!map || coords.length === 0) {
      return false;
    }

    try {
      map.fitBounds(coords as LatLngBoundsExpression, {
        padding: options.padding || [50, 50],
        maxZoom: options.maxZoom,
        animate: options.animate ?? true,
        duration: options.duration,
      });
      return true;
    } catch (error) {
      logger.error("[useMapBounds] Erro ao ajustar bounds do mapa:", error);
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
    if (!map) {
      return false;
    }

    try {
      map.setView(center, zoom, {
        animate: options.animate ?? true,
        duration: options.duration,
      });
      return true;
    } catch (error) {
      logger.error("[useMapBounds] Erro ao definir view do mapa:", error);
      return false;
    }
  };

  /**
   * Ajusta o zoom do mapa.
   */
  const setZoom = (map: Map, zoom: number): boolean => {
    if (!map) {
      return false;
    }

    try {
      map.setZoom(zoom);
      return true;
    } catch (error) {
      logger.error("[useMapBounds] Erro ao definir zoom do mapa:", error);
      return false;
    }
  };

  /**
   * Obtém os bounds atuais do mapa.
   */
  const getBounds = (map: Map) => {
    if (!map) {
      return null;
    }

    try {
      return map.getBounds();
    } catch (error) {
      logger.error("[useMapBounds] Erro ao obter bounds do mapa:", error);
      return null;
    }
  };

  /**
   * Obtém o centro atual do mapa.
   */
  const getCenter = (map: Map): [number, number] | null => {
    if (!map) {
      return null;
    }

    try {
      const center = map.getCenter();
      return [center.lat, center.lng];
    } catch (error) {
      logger.error("[useMapBounds] Erro ao obter centro do mapa:", error);
      return null;
    }
  };

  /**
   * Obtém o zoom atual do mapa.
   */
  const getZoom = (map: Map): number | null => {
    if (!map) {
      return null;
    }

    try {
      return map.getZoom();
    } catch (error) {
      logger.error("[useMapBounds] Erro ao obter zoom do mapa:", error);
      return null;
    }
  };

  /**
   * Verifica se os bounds são válidos.
   */
  const isValidBounds = (coords: [number, number][]): boolean => {
    return coords.length >= 2;
  };

  return {
    fitToBounds,
    setView,
    setZoom,
    getBounds,
    getCenter,
    getZoom,
    isValidBounds,
  };
}
