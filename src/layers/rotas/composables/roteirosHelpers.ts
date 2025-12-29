import { isValidCoordinate } from "~/utils/validators/geo";
import type { Roteiro, VrpTask, VrpVehicle } from "../types/rotas.types";

const VRP_TASK_DURATION = "00:10";
const VRP_VEHICLE_ID = 1;
const VRP_VEHICLE_DESCRIPTION = "Veiculo Virtual";
const VRP_VEHICLE_MAX_JOBS = 100;
const VRP_VEHICLE_AVG_SPEED = 60;
const VRP_WORK_START = "06:00";
const VRP_WORK_END = "22:00";

/**
 * Converte valor para number ou retorna null.
 * Implementação específica para roteiros.
 */
export const parseNumber = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined) return null;
  const parsed = typeof value === "string" ? Number.parseFloat(value) : value;
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Obtém coordenadas de um roteiro.
 */
export const getRoteiroCoordinates = (
  roteiro: Roteiro,
): { latitude: number; longitude: number } | null => {
  if (!roteiro.endereco) return null;
  const lat = parseNumber(roteiro.endereco.latitude);
  const lng = parseNumber(roteiro.endereco.longitude);
  if (lat === null || lng === null) return null;
  return isValidCoordinate(lat, lng) ? { latitude: lat, longitude: lng } : null;
};

/**
 * Ordena roteiros por sequência.
 */
export const sortBySequencia = (a: Roteiro, b: Roteiro) =>
  (a.sequencia ?? 0) - (b.sequencia ?? 0);

/**
 * Tipo para roteiro com coordenadas válidas.
 */
export type RoteiroWithCoords = {
  roteiro: Roteiro;
  coords: { latitude: number; longitude: number };
};

/**
 * Retorna roteiros com coordenadas válidas.
 */
export const getRoteirosWithCoords = (roteiros: Roteiro[]): RoteiroWithCoords[] => {
  return [...roteiros]
    .sort(sortBySequencia)
    .map((roteiro) => {
      const coords = getRoteiroCoordinates(roteiro);
      return coords ? { roteiro, coords } : null;
    })
    .filter((item): item is RoteiroWithCoords => Boolean(item));
};

/**
 * Converte roteiros para tasks da API VRP (filtra coordenadas inválidas).
 */
export const roteirosToVrpTasks = (roteiros: Roteiro[]): VrpTask[] => {
  const roteirosWithCoords = getRoteirosWithCoords(roteiros);
  return roteirosWithCoords.map(({ roteiro, coords }) => ({
    id: roteiro.id,
    type: "catch-only" as const,
    description: roteiro.nome || `Ponto ${roteiro.sequencia}`,
    duration: VRP_TASK_DURATION,
    location: coords,
  }));
};

/**
 * Cria veículo virtual para calcular polyline.
 * Se userLocation for fornecido, usa como ponto de partida.
 */
export const createVirtualVehicle = (
  roteiros: Roteiro[],
  userLocation?: { latitude: number; longitude: number } | null,
): VrpVehicle | null => {
  const roteirosWithCoords = getRoteirosWithCoords(roteiros);
  if (roteirosWithCoords.length === 0) return null;

  const primeiro = roteirosWithCoords[0];
  const ultimo = roteirosWithCoords[roteirosWithCoords.length - 1];

  const hasValidUserLocation =
    !!userLocation && isValidCoordinate(userLocation.latitude, userLocation.longitude);
  const start = hasValidUserLocation
    ? { latitude: userLocation!.latitude, longitude: userLocation!.longitude }
    : primeiro.coords;

  if (hasValidUserLocation && userLocation) {
    console.log("[createVirtualVehicle] Usando localizacao do usuario como ponto de partida:", start);
  }

  return {
    id: VRP_VEHICLE_ID,
    description: VRP_VEHICLE_DESCRIPTION,
    maxJobs: VRP_VEHICLE_MAX_JOBS,
    avgSpeed: VRP_VEHICLE_AVG_SPEED,
    location: {
      start,
      end: ultimo.coords,
    },
    work: {
      start: VRP_WORK_START,
      end: VRP_WORK_END,
    },
  };
};
