import type { Map, Marker } from "leaflet";
import L from "leaflet";
import type { MapaPonto, MapaStatusConfig } from "./maps.types";

/**
 * Composable para gerenciar markers em um mapa Leaflet.
 */
export function useMapMarkers() {
  const markers: Marker[] = [];

  /**
   * Cria um ícone numerado para o marker.
   */
  const createSequenceIcon = (sequencia: number, color: string) => {
    const html = `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
      ">${sequencia}</div>
    `;

    return L.divIcon({
      html,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  /**
   * Cria um ícone simples (sem número).
   */
  const createSimpleIcon = (color: string) => {
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

  /**
   * Cria o HTML do popup para um ponto.
   */
  const createPopupHtml = (
    ponto: MapaPonto,
    statusConfig: MapaStatusConfig,
  ): string => {
    const subtitleHtml = ponto.subtitulo
      ? `<p style="color: #666; margin-bottom: 4px;">${ponto.subtitulo}</p>`
      : "";

    const enderecoHtml = ponto.endereco
      ? `<p style="margin-bottom: 4px; color: #666; font-size: 12px;">
          ${[
            ponto.endereco.rua,
            ponto.endereco.numero,
            ponto.endereco.bairro,
            ponto.endereco.cidade,
          ]
            .filter(Boolean)
            .join(", ")}
       </p>`
      : "";

    const sequenciaHtml =
      ponto.sequencia !== undefined
        ? `<p style="margin-bottom: 4px;"><strong>Sequência:</strong> ${ponto.sequencia}</p>`
        : "";

    return `
      <div style="min-width: 200px;">
        <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">
          ${ponto.titulo}
        </h3>
        ${subtitleHtml}
        ${enderecoHtml}
        ${sequenciaHtml}
        <p style="margin-bottom: 0;">
          <strong>Status:</strong>
          <span style="color: ${statusConfig.color}; font-weight: bold;">${statusConfig.label}</span>
        </p>
      </div>
    `;
  };

  /**
   * Converte valor para number ou retorna null.
   */
  const toNumber = (value: number | string): number | null => {
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? n : null;
  };

  /**
   * Adiciona um marker ao mapa.
   * @returns Coordenadas do marker ou null se inválidas
   */
  const addMarker = (
    map: Map,
    ponto: MapaPonto,
    statusConfig: MapaStatusConfig,
  ): [number, number] | null => {
    const lat = toNumber(ponto.latitude);
    const lng = toNumber(ponto.longitude);

    if (lat === null || lng === null) return null;

    const icon = ponto.sequencia
      ? createSequenceIcon(ponto.sequencia, statusConfig.color)
      : createSimpleIcon(statusConfig.color);

    const marker = L.marker([lat, lng], { icon })
      .addTo(map)
      .bindPopup(createPopupHtml(ponto, statusConfig));

    markers.push(marker);
    return [lat, lng];
  };

  /**
   * Adiciona múltiplos markers ao mapa.
   * @returns Array de coordenadas válidas
   */
  const addMarkers = (
    map: Map,
    pontos: MapaPonto[],
    getStatusConfig: (status?: string) => MapaStatusConfig,
  ): [number, number][] => {
    const validBounds: [number, number][] = [];

    const sortedPontos = [...pontos].sort(
      (a, b) => (a.sequencia || 0) - (b.sequencia || 0),
    );

    for (const ponto of sortedPontos) {
      const coords = addMarker(map, ponto, getStatusConfig(ponto.status));
      if (coords) validBounds.push(coords);
    }

    return validBounds;
  };

  /**
   * Remove todos os markers do mapa.
   */
  const clearMarkers = () => {
    markers.forEach((m) => m.remove());
    markers.length = 0;
  };

  return {
    markers,
    addMarker,
    addMarkers,
    clearMarkers,
    createSequenceIcon,
    createSimpleIcon,
    createPopupHtml,
  };
}
