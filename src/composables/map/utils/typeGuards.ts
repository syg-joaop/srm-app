/**
 * Type guards reutilizáveis para validação de coordenadas geográficas.
 * Elimina a necessidade de null checks repetitivos e fornece type narrowing
 * adequado para o TypeScript.
 */

/**
 * Type guard para verificar se uma coordenada individual (lat ou lng) é válida.
 * Retorna true se o valor não é null nem undefined.
 *
 * @example
 * const lat = toNumber(ponto.latitude);
 *
 * if (isValidCoordinateValue(lat)) {
 *   // lat é garantidamente number aqui
 *   console.log(lat);
 * }
 */
export function isValidCoordinateValue(value: number | null | undefined): value is number {
  return value != null;
}

/**
 * Type guard para verificar se ambas as coordenadas são válidas (não null nem undefined).
 * Retorna true apenas se AMBAS as coordenadas são válidas.
 *
 * @example
 * const lat = toNumber(ponto.latitude);
 * const lng = toNumber(ponto.longitude);
 *
 * if (areValidCoordinates(lat, lng)) {
 *   // lat e lng são garantidamente number aqui
 *   coords.push([lat, lng]);
 * }
 */
export function areValidCoordinates(
  lat: number | null | undefined,
  lng: number | null | undefined
): boolean {
  return isValidCoordinateValue(lat) && isValidCoordinateValue(lng);
}
