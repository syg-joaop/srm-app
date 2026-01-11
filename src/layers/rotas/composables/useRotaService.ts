import { toNumber as parseNumber } from "~/utils/geo/coordinateUtils";
import { logger } from "~/utils/logger";

import { RotaApiService } from "./services/rotaApi.service";
import { RotaPolylineService } from "./services/rotaPolyline.service";
import { RoteiroSequencingService } from "./services/roteiroSequencing.service";
import { usePolylineCache } from "./usePolylineCache";
import { useVrpService } from "./useVrpService";

import type {
  CreateRoteiroPayload,
  RotaFilters,
  VrpSummary,
} from "../schemas/rotas.schema";
import type {
  Rota,
  RotaResponse,
  Roteiro,
  RoteiroFilters,
  RoteiroResponse,
} from "../schemas/rotas.schema";

const LOG_PREFIX = "[useRotaService]";

const logError = (...args: unknown[]) => logger.error(LOG_PREFIX, ...args);

/**
 * Facade/Orquestrador para gerenciar rotas e roteiros.
 * Delega operações para serviços especializados e mantém estado reativo.
 */
export const useRotaService = () => {
  const vrpService = useVrpService();
  const polylineCache = usePolylineCache();

  // Instancia serviços especializados
  const apiService = new RotaApiService();
  const sequencingService = new RoteiroSequencingService();
  const polylineService = new RotaPolylineService(
    apiService,
    vrpService.calcularPolyline.bind(vrpService),
  );

  // Estado reativo
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Wrapper para executar chamadas de API com tratamento de erro.
   */
  const withErrorHandling = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    isLoading.value = true;
    error.value = null;
    try {
      return await fn();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro na operação";
      logError("Operation error:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const withErrorHandlingBool = async (fn: () => Promise<void>): Promise<boolean> => {
    const result = await withErrorHandling(async () => {
      await fn();
      return true;
    });
    return result ?? false;
  };

  // Métodos de rotas - delegação direta com error handling
  const fetchRotas = (filters?: RotaFilters) =>
    withErrorHandling(() => apiService.fetchRotas(filters));

  const fetchRoteiros = (idRota: number, filters?: RoteiroFilters) =>
    withErrorHandling(() => apiService.fetchRoteiros(idRota, filters));

  const fetchRotaById = (id: number) =>
    withErrorHandling(() => apiService.fetchRotaById(id));

  const createRota = (data: {
    tipo?: string;
    data_inicio: string;
    data_fim: string;
    observacao?: string;
  }) => withErrorHandling(() => apiService.createRota(data));

  const createRoteiro = async (payload: CreateRoteiroPayload) => {
    const result = await withErrorHandling(() => apiService.createRoteiro(payload));
    if (result) clearPolylineCache();
    return result;
  };

  const deleteRoteiro = async (id: number) => {
    const result = await withErrorHandlingBool(() => apiService.deleteRoteiro(id));
    if (result) clearPolylineCache();
    return result;
  };

  const updateRoteiroSequencia = async (id: number, sequencia: number) => {
    const result = await withErrorHandlingBool(() => apiService.updateRoteiroSequencia(id, sequencia));
    if (result) clearPolylineCache();
    return result;
  };

  const reordenarRoteiros = async (roteiros: Array<{ id: number; sequencia: number }>) => {
    isLoading.value = true;
    error.value = null;
    try {
      const api = useMainApi(true);
      const { tempOps, finalOps } = sequencingService.gerarOperacoesReordenacao(roteiros);
      for (const op of tempOps) {
        await api(`/srm/roteiro/${op.id}`, { method: "PUT", body: { sequencia: op.sequencia } });
      }
      for (const op of finalOps) {
        await api(`/srm/roteiro/${op.id}`, { method: "PUT", body: { sequencia: op.sequencia } });
      }
      clearPolylineCache();
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao reordenar roteiros";
      logError("reordenarRoteiros error:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Métodos de polyline - delegação direta
  const calcularPolyline = (
    roteiros: Roteiro[],
    userLocation?: { latitude: number; longitude: number } | null,
  ) => polylineService.calcularPolyline(roteiros, userLocation);

  const fetchRotaComPolyline = (
    idRota: number,
    userLocation?: { latitude: number; longitude: number } | null,
  ) =>
    withErrorHandling(() =>
      polylineService.fetchRotaComPolyline(idRota, userLocation),
    ) ?? { rota: null, roteiros: [], polyline: null, summary: null };

  const clearPolylineCache = () => polylineCache.clearPolylineCache();

  return {
    isLoading,
    error,
    fetchRotas,
    fetchRotaById,
    createRota,
    fetchRoteiros,
    createRoteiro,
    deleteRoteiro,
    updateRoteiroSequencia,
    reordenarRoteiros,
    calcularPolyline,
    fetchRotaComPolyline,
    clearPolylineCache,
    toNumber: parseNumber,
  };
};

// Composable para usar em páginas com useAsyncData
export const useRotaAsyncData = () => {
  const service = useRotaService();

  const useRotasData = (filters?: Ref<RotaFilters>) => {
    return useAsyncData("rotas-list", () => service.fetchRotas(filters?.value), {
      watch: filters ? [filters] : undefined,
    });
  };

  const useRoteirosData = (idRota: Ref<number>) => {
    return useAsyncData(`roteiros-${idRota.value}`, () => service.fetchRoteiros(idRota.value), {
      watch: [idRota],
    });
  };

  return {
    ...service,
    useRotasData,
    useRoteirosData,
  };
};
