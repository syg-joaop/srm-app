/**
 * Decodifica uma polyline encoded no formato Google Polyline Algorithm.
 * Referência: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 *
 * @param encoded - String da polyline encoded
 * @returns Array de coordenadas [latitude, longitude]
 */
export function decodePolyline(encoded: string, precision?: 5 | 6): [number, number][] {
  const coordinates: [number, number][] = [];

  const cleaned = (encoded ?? "").replace(/\s+/g, "");

  if (!cleaned || cleaned.length === 0) {
    return coordinates;
  }

  let index = 0;
  let lat = 0;
  let lng = 0;
  const resolvedPrecision = precision ?? 5;
  const factor = Math.pow(10, resolvedPrecision);

  while (index < cleaned.length) {
    // Decodifica latitude
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = cleaned.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    // Decodifica longitude
    shift = 0;
    result = 0;

    do {
      byte = cleaned.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    // Converte de inteiro para coordenada decimal (precisão de 5 casas)
    coordinates.push([lat / factor, lng / factor]);
  }

  if (precision === undefined) {
    const hasOutOfRange = coordinates.some(([cLat, cLng]) => Math.abs(cLat) > 90 || Math.abs(cLng) > 180);
    if (hasOutOfRange) {
      return decodePolyline(cleaned, 6);
    }
  }

  return coordinates;
}

/**
 * Codifica um array de coordenadas no formato Google Polyline Algorithm.
 *
 * @param coordinates - Array de coordenadas [latitude, longitude]
 * @returns String da polyline encoded
 */
export function encodePolyline(coordinates: [number, number][]): string {
  if (!coordinates || coordinates.length === 0) {
    return "";
  }

  let encoded = "";
  let prevLat = 0;
  let prevLng = 0;

  for (const [lat, lng] of coordinates) {
    // Converte para inteiro (precisão de 5 casas)
    const latInt = Math.round(lat * 1e5);
    const lngInt = Math.round(lng * 1e5);

    // Calcula delta
    const deltaLat = latInt - prevLat;
    const deltaLng = lngInt - prevLng;

    prevLat = latInt;
    prevLng = lngInt;

    // Codifica delta
    encoded += encodeNumber(deltaLat);
    encoded += encodeNumber(deltaLng);
  }

  return encoded;
}

/**
 * Codifica um número no formato polyline
 */
function encodeNumber(num: number): string {
  let encoded = "";

  // Left-shift e inverte se negativo
  let value = num < 0 ? ~(num << 1) : num << 1;

  while (value >= 0x20) {
    encoded += String.fromCharCode((0x20 | (value & 0x1f)) + 63);
    value >>= 5;
  }

  encoded += String.fromCharCode(value + 63);
  return encoded;
}
