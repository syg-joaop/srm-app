/**
 * Utilitários consolidados para validação e processamento de coordenadas geográficas.
 * Single source of truth para todas as operações com lat/lng.
 */

import { isValidCoordinate } from "~/utils/validators/geo";

// Re-exportar para conveniência
export { isValidCoordinate };

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
export function toNumber(value: number | string | null | undefined): number | null {
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
export function extractValidCoordinates(
  item: {
    latitude?: number | string | null | undefined;
    longitude?: number | string | null | undefined;
  },
): LatLngTuple | null {
  const lat = toNumber(item.latitude);
  const lng = toNumber(item.longitude);

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
export function extractValidCoordinateObject(
  item: {
    latitude?: number | string | null | undefined;
    longitude?: number | string | null | undefined;
  },
): ValidCoordinate | null {
  const coords = extractValidCoordinates(item);
  return coords ? { latitude: coords[0], longitude: coords[1] } : null;
}

/**
 * Valida se uma coordenada (lat, lng) está dentro dos limites geográficos válidos.
 * Esta é uma função de compatibilidade que usa isValidCoordinate do validators/geo.ts.
 *
 * @param lat - Latitude em graus
 * @param lng - Longitude em graus
 * @returns true se a coordenada é válida
 *
 * @deprecated Use isValidCoordinate from ~/utils/validators/geo diretamente
 */
export function isValidLatLng(lat: number, lng: number): boolean {
  return isValidCoordinate(lat, lng);
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
export function parseCoordinates(
  item: {
    latitude?: number | string | null | undefined;
    longitude?: number | string | null | undefined;
  },
): ValidCoordinate | null {
  return extractValidCoordinateObject(item);
}

/**
 * Verifica se um objeto tem coordenadas válidas.
 *
 * @param item - Objeto com latitude e longitude
 * @returns true se as coordenadas são válidas
 */
export function hasValidCoordinates(
  item: {
    latitude?: number | string | null | undefined;
    longitude?: number | string | null | undefined;
  },
): boolean {
  return extractValidCoordinates(item) !== null;
}
