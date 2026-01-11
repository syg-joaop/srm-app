/**
 * Decodifica uma string de polyline codificada (Google Encoded Polyline Algorithm Format).
 * Suporta precisão de 5 (padrão) ou 6 casas decimais.
 *
 * @param str - String codificada
 * @param precision - Precisão (5 ou 6). Default: 5
 * @returns Array de coordenadas [latitude, longitude]
 */
export function decodePolyline(str: string, precision = 5): [number, number][] {
  let index = 0;
  let lat = 0;
  let lng = 0;
  const coordinates: [number, number][] = [];
  const factor = Math.pow(10, precision);

  // Changes the factor to 1e6 if precision is 6 (OSRM / Valhalla typically use 6, Google uses 5)
  // Ensure we handle the integer logic correctly for both.

  while (index < str.length) {
    let byte = 0;
    let shift = 0;
    let result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const latitudeChange = result & 1 ? ~(result >> 1) : result >> 1;
    lat += latitudeChange;

    shift = 0;
    result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const longitudeChange = result & 1 ? ~(result >> 1) : result >> 1;
    lng += longitudeChange;

    coordinates.push([lat / factor, lng / factor]);
  }

  return coordinates;
}

/**
 * Calcula o centro geográfico de um conjunto de coordenadas.
 * Retorna null se o array estiver vazio.
 *
 * @param coords - Array de coordenadas
 * @returns Coordenada central [lat, lng] ou null
 */
export function getBoundsCenter(coords: [number, number][]): [number, number] | null {
  if (!coords.length) {
    return null;
  }

  let minLat = Number.POSITIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;
  let minLng = Number.POSITIVE_INFINITY;
  let maxLng = Number.NEGATIVE_INFINITY;

  for (const [lat, lng] of coords) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  return [centerLat, centerLng];
}

/**
 * Normaliza uma string de polyline, removendo escapes extras de JSON se necessário.
 *
 * @param polyline - String de polyline bruta
 * @returns String limpa ou null se inválida
 */
export function normalizePolylineString(polyline: unknown): string | null {
  if (!polyline || typeof polyline !== "string") {
    return null;
  }

  // Remove aspas extras se estiver double-escaped
  let clean = polyline.trim();
  if (clean.startsWith('"') && clean.endsWith('"')) {
    clean = clean.slice(1, -1);
  }

  // Unescape backslashes (ex: \ -> \)
  clean = clean.replace(/\\/g, "\\");

  return clean;
}

