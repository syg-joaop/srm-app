import { decodePolyline } from "./decoder";

/**
 * Valida se uma coordenada latitude/longitude está dentro dos limites válidos.
 *
 * @param lat - Latitude em graus
 * @param lng - Longitude em graus
 * @returns true se a coordenada é válida
 */
export function isValidLatLng(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  );
}

/**
 * Calcula o centro (ponto médio) de um conjunto de coordenadas.
 *
 * @param coords - Array de coordenadas [latitude, longitude]
 * @returns Coordenada central [lat, lng] ou null se o array for vazio/inválido
 */
export function getBoundsCenter(coords: [number, number][]): [number, number] | null {
  if (coords.length === 0) return null;

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const [lat, lng] of coords) {
    if (!isValidLatLng(lat, lng)) continue;
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  }

  if (!Number.isFinite(minLat) || !Number.isFinite(minLng)) return null;
  return [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
}

/**
 * Calcula a distância ao quadrado entre dois pontos (otimização para evitar sqrt).
 *
 * @param a - Primeira coordenada [lat, lng]
 * @param b - Segunda coordenada [lat, lng]
 * @returns Distância ao quadrado entre os pontos
 */
export function distanceSquared(a: [number, number], b: [number, number]): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
}

/**
 * Filtra um array de coordenadas removendo entradas inválidas.
 *
 * @param coords - Array de coordenadas [latitude, longitude]
 * @returns Array filtrado apenas com coordenadas válidas
 */
export function filterValidCoordinates(coords: [number, number][]): [number, number][] {
  return coords.filter(([lat, lng]) => isValidLatLng(lat, lng));
}

/**
 * Normaliza uma string de polyline removendo espaços e aspas extras.
 *
 * @param polyline - String da polyline possivelmente com formatação
 * @returns String normalizada
 */
export function normalizePolylineString(polyline: string): string {
  const normalized = polyline.trim().replace(/\s+/g, "");

  // Remove aspas ao redor se existirem
  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    return normalized.slice(1, -1);
  }

  return normalized;
}

/**
 * Determina a melhor precisão de decodificação (5 ou 6) baseada em coordenadas de referência.
 *
 * @param encoded - Polyline codificada
 * @param referenceCoords - Coordenadas de referência para comparação
 * @returns Coordenadas decodificadas com a melhor precisão
 */
export function decodeWithBestPrecision(
  encoded: string,
  referenceCoords: [number, number][],
): [number, number][] {
  const refCenter = getBoundsCenter(referenceCoords);
  if (!refCenter) {
    return decodePolyline(encoded);
  }

  const decoded5 = filterValidCoordinates(decodePolyline(encoded, 5));
  const decoded6 = filterValidCoordinates(decodePolyline(encoded, 6));

  const center5 = getBoundsCenter(decoded5);
  const center6 = getBoundsCenter(decoded6);

  const score5 = center5 ? distanceSquared(center5, refCenter) : Number.POSITIVE_INFINITY;
  const score6 = center6 ? distanceSquared(center6, refCenter) : Number.POSITIVE_INFINITY;

  return score6 < score5 ? decoded6 : decoded5;
}
