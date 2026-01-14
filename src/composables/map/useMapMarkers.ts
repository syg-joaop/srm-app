import L from "leaflet";

import { toNumber } from "~/utils/coerce";

import type { MapaPonto, MapaStatusConfig } from "./maps.types";
import type { Map, Marker } from "leaflet";

/**
 * Composable para gerenciar markers em um mapa Leaflet.
 */
export function useMapMarkers() {
  const markers: Marker[] = [];

  /**
   * Cria um ícone para o marker.
   */
  const createIcon = (color: string, sequencia?: number) => {
    const isNumbered = sequencia !== undefined;
    const size = isNumbered ? 32 : 24;
    const half = size / 2;

    const html = `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px ${isNumbered ? 6 : 4}px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        ${isNumbered ? "font-size: 14px;" : ""}
      ">${isNumbered ? sequencia : ""}</div>
    `;

    return L.divIcon({
      html,
      className: "",
      iconSize: [size, size],
      iconAnchor: [half, half],
      popupAnchor: [0, -half],
    });
  };

  /**
   * Cria o HTML do popup para um ponto.
   */
  const createPopupHtml = (ponto: MapaPonto, statusConfig: MapaStatusConfig): string => {
    const endereco = ponto.endereco
      ? [ponto.endereco.rua, ponto.endereco.numero, ponto.endereco.bairro, ponto.endereco.cidade]
          .filter(Boolean)
          .join(", ")
      : "";

    return `
      <div style="min-width: 200px;">
        <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${ponto.titulo}</h3>
        ${ponto.subtitulo ? `<p style="color: #666; margin-bottom: 4px;">${ponto.subtitulo}</p>` : ""}
        ${endereco ? `<p style="margin-bottom: 4px; color: #666; font-size: 12px;">${endereco}</p>` : ""}
        ${ponto.sequencia !== undefined ? `<p style="margin-bottom: 4px;"><strong>Sequência:</strong> ${ponto.sequencia}</p>` : ""}
        <p style="margin-bottom: 0;">
          <strong>Status:</strong>
          <span style="color: ${statusConfig.color}; font-weight: bold;">${statusConfig.label}</span>
        </p>
      </div>
    `;
  };

  /**
   * Adiciona um marker ao mapa.
   */
  const addMarker = (map: Map, ponto: MapaPonto, statusConfig: MapaStatusConfig): [number, number] | null => {
    const lat = toNumber(ponto.latitude);
    const lng = toNumber(ponto.longitude);

    if (lat === undefined || lng === undefined) return null;

    const marker = L.marker([lat, lng], { icon: createIcon(statusConfig.color, ponto.sequencia) })
      .addTo(map)
      .bindPopup(createPopupHtml(ponto, statusConfig));

    markers.push(marker);
    return [lat, lng];
  };

  /**
   * Adiciona múltiplos markers ao mapa.
   */
  const addMarkers = (
    map: Map,
    pontos: MapaPonto[],
    getStatusConfig: (status?: string) => MapaStatusConfig,
  ): [number, number][] => {
    return [...pontos]
      .sort((a, b) => (a.sequencia ?? 0) - (b.sequencia ?? 0))
      .map((ponto) => addMarker(map, ponto, getStatusConfig(ponto.status)))
      .filter((coords): coords is [number, number] => coords !== null);
  };

  /**
   * Remove todos os markers do mapa.
   */
  const clearMarkers = () => {
    markers.forEach((m) => m.remove());
    markers.length = 0;
  };

  return { addMarkers, clearMarkers };
}
