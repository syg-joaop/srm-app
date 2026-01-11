/**

 * Utilitários consolidados para validação e processamento de coordenadas geográficas.

 * Single source of truth para todas as operações com lat/lng.

 */

/**
 * Valida se uma coordenada (lat, lng) está dentro dos limites geográficos válidos.
 */
export function isValidCoordinate(lat: number | string, lng: number | string): boolean {
  const latNum = typeof lat === "string" ? parseFloat(lat) : lat;
  const lngNum = typeof lng === "string" ? parseFloat(lng) : lng;

  return (
    !isNaN(latNum) &&
    !isNaN(lngNum) &&
    latNum !== 0 &&
    lngNum !== 0 &&
    latNum >= -90 &&
    latNum <= 90 &&
    lngNum >= -180 &&
    lngNum <= 180
  );
}

/**

 * Tipo para representar coordenadas válidas.

 */

export type ValidCoordinate = {
  latitude: number;

  longitude: number;
};

/**

 * Tipo para representar coordenadas no formato [lat, lng].

 */

export type LatLngTuple = [number, number];

/**

 * Converte um valor (string ou number) para number.

 * Retorna null se o valor não for um número finito válido.

 *

 * @param value - Valor a ser convertido

 * @returns Número ou null se inválido

 */

export function toNumberOrNull(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const num = typeof value === "number" ? value : Number(value);

  return Number.isFinite(num) ? num : null;
}

/**

 * Extrai coordenadas válidas de um objeto com propriedades latitude/longitude.

 * Garante que ambas as coordenadas sejam números válidos.

 *

 * @param item - Objeto com latitude e longitude

 * @returns Tupla [lat, lng] ou null se inválido

 */

export function extractValidCoordinates(item: {
  latitude?: number | string | null | undefined;

  longitude?: number | string | null | undefined;
}): LatLngTuple | null {
  const lat = toNumberOrNull(item.latitude);

  const lng = toNumberOrNull(item.longitude);

  if (lat === null || lng === null) {
    return null;
  }

  return isValidCoordinate(lat, lng) ? [lat, lng] : null;
}

/**

 * Extrai coordenadas válidas de um objeto, retornando um objeto com propriedades.

 *

 * @param item - Objeto com latitude e longitude

 * @returns Objeto {latitude, longitude} ou null se inválido

 */

export function extractValidCoordinateObject(item: {
  latitude?: number | string | null | undefined;

  longitude?: number | string | null | undefined;
}): ValidCoordinate | null {
  const coords = extractValidCoordinates(item);

  return coords ? { latitude: coords[0], longitude: coords[1] } : null;
}

/**

 * Filtra um array de coordenadas removendo entradas inválidas.

 *

 * @param coords - Array de coordenadas [latitude, longitude]

 * @returns Array filtrado apenas com coordenadas válidas

 */

export function filterValidCoordinates(coords: LatLngTuple[]): LatLngTuple[] {
  return coords.filter(([lat, lng]) => isValidCoordinate(lat, lng));
}

/**

 * Parseia coordenadas de um objeto, retornando null se inválidas.

 * Alias para extractValidCoordinateObject para legibilidade em contextos específicos.

 *

 * @param item - Objeto com latitude e longitude

 * @returns Objeto {latitude, longitude} ou null se inválido

 */

export function parseCoordinates(item: {
  latitude?: number | string | null | undefined;

  longitude?: number | string | null | undefined;
}): ValidCoordinate | null {
  return extractValidCoordinateObject(item);
}

/**

 * Verifica se um objeto tem coordenadas válidas.

 *

 * @param item - Objeto com latitude e longitude

 * @returns true se as coordenadas são válidas

 */

export function hasValidCoordinates(item: {
  latitude?: number | string | null | undefined;

  longitude?: number | string | null | undefined;
}): boolean {
  return extractValidCoordinates(item) !== null;
}

