import { hasValidCoordinates, parseCoordinates } from "~/utils/geo/coordinateUtils";

import type { Roteiro, VrpTask, VrpVehicle } from "../schemas/rotas.schema";

const VRP_TASK_DURATION = "00:10";
const VRP_TASK_PREPARATION = "00:05";
const VRP_VEHICLE_ID = 1;
const VRP_VEHICLE_DESCRIPTION = "Veiculo Virtual";
const VRP_VEHICLE_MAX_JOBS = 100;
const VRP_VEHICLE_MAX_SPEED = 100;
const VRP_VEHICLE_AVG_SPEED = 80; // Aumentado para 80 km/h
const VRP_WORK_START = "00:00";
const VRP_WORK_END = "23:59";
const VRP_WORK_START_WITH_USER = "00:00"; // Jornada estendida para cálculo com localização
const VRP_WORK_END_WITH_USER = "23:59";

/**
 * Obtém coordenadas de um roteiro.
 * Usa o utilitário consolidado de coordenadas.
 */
export const getRoteiroCoordinates = (
  roteiro: Roteiro,
): { latitude: number; longitude: number } | null => {
  if (!roteiro.endereco) return null;
  return parseCoordinates(roteiro.endereco);
};

/**
 * Ordena roteiros por sequência.
 */
export const sortBySequencia = (a: Roteiro, b: Roteiro) => (a.sequencia ?? 0) - (b.sequencia ?? 0);

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
    preparation: VRP_TASK_PREPARATION,
    duration: VRP_TASK_DURATION,
    loadVolumes: 1, // Volume padrão para cada task
    skills: ["default"], // Skill padrão para matching com o veículo
    priority: 0, // Prioridade padrão
    window: {
      start: "00:00",
      end: "23:59",
    },
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

  const hasValidUserLocation = userLocation && hasValidCoordinates(userLocation);
  const start = hasValidUserLocation ? userLocation : primeiro.coords;

  // Usa velocidade e jornada maiores quando há localização do usuário
  // para permitir cálculo de rotas longas (apenas para visualização)
  const avgSpeed = hasValidUserLocation ? 120 : VRP_VEHICLE_AVG_SPEED;
  const workStart = hasValidUserLocation ? VRP_WORK_START_WITH_USER : VRP_WORK_START;
  const workEnd = hasValidUserLocation ? VRP_WORK_END_WITH_USER : VRP_WORK_END;

  return {
    id: VRP_VEHICLE_ID,
    description: VRP_VEHICLE_DESCRIPTION,
    maxJobs: VRP_VEHICLE_MAX_JOBS,
    maxVolumes: 1000, // Capacidade suficiente para todas as tasks
    maxSpeed: VRP_VEHICLE_MAX_SPEED,
    avgSpeed,
    skills: ["default"], // Skill padrão para matching com as tasks
    location: {
      start,
      end: ultimo.coords,
    },
    work: {
      start: workStart,
      end: workEnd,
    },
  };
};
