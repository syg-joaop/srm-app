/**
 * Calcula a distância total de uma polyline em metros usando a fórmula de Haversine.
 *
 * @param coordinates - Array de coordenadas [latitude, longitude]
 * @returns Distância total em metros
 */
export function calculatePolylineDistance(coordinates: [number, number][]): number {
  if (coordinates.length < 2) return 0;

  let totalDistance = 0;

  for (let i = 0; i < coordinates.length - 1; i++) {
    totalDistance += haversineDistance(coordinates[i], coordinates[i + 1]);
  }

  return totalDistance;
}

/**
 * Calcula a distância entre dois pontos usando a fórmula de Haversine.
 *
 * @param point1 - Coordenada [latitude, longitude]
 * @param point2 - Coordenada [latitude, longitude]
 * @returns Distância em metros
 */
function haversineDistance(point1: [number, number], point2: [number, number]): number {
  const R = 6371000; // Raio da Terra em metros
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Simplifica uma polyline removendo pontos desnecessários.
 * Usa o algoritmo de Douglas-Peucker.
 *
 * @param coordinates - Array de coordenadas [latitude, longitude]
 * @param tolerance - Tolerância em graus (padrão: 0.00001 ~= 1m)
 * @returns Array de coordenadas simplificado
 */
export function simplifyPolyline(
  coordinates: [number, number][],
  tolerance: number = 0.00001,
): [number, number][] {
  if (coordinates.length < 3) return coordinates;

  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];

  let maxDistance = 0;
  let maxIndex = 0;

  for (let i = 1; i < coordinates.length - 1; i++) {
    const distance = perpendicularDistance(coordinates[i], first, last);
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }

  if (maxDistance > tolerance) {
    const left = simplifyPolyline(coordinates.slice(0, maxIndex + 1), tolerance);
    const right = simplifyPolyline(coordinates.slice(maxIndex), tolerance);
    return [...left.slice(0, -1), ...right];
  }

  return [first, last];
}

function perpendicularDistance(
  point: [number, number],
  lineStart: [number, number],
  lineEnd: [number, number],
): number {
  const [x, y] = point;
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;

  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) {
    return Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
  }

  const t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
  const tClamped = Math.max(0, Math.min(1, t));

  const nearestX = x1 + tClamped * dx;
  const nearestY = y1 + tClamped * dy;

  return Math.sqrt((x - nearestX) ** 2 + (y - nearestY) ** 2);
}
