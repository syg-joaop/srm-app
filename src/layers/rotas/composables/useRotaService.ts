import { z } from "zod";
import {
  schemaRota,
  schemaRotaResponse,
  schemaRoteiro,
  schemaRoteiroResponse,
} from "~/server/schemas/rotas.schema";
import type {
  CreateRoteiroPayload,
  Rota,
  RotaFilters,
  RotaResponse,
  Roteiro,
  RoteiroFilters,
  RoteiroResponse,
  VrpSummary,
} from "../types/rotas.types";
import { usePolylineCache } from "./usePolylineCache";
import { useVrpService } from "./useVrpService";
import { getRoteirosWithCoords, parseNumber } from "./roteirosHelpers";

const LOG_PREFIX = "[useRotaService]";

// Endpoints do backend NestJS
const ROTAS_ENDPOINT = "/srm/rotas";
const ROTEIRO_ENDPOINT = "/srm/roteiro";

// Sequencing
const DEFAULT_ROTA_TIPO = "COMPRA";
const DEFAULT_ROTEIROS_PAGE_SIZE = 100;
const TEMP_SEQUENCE_BASE = 10000;

// VRP minimum tasks constants
const VRP_MIN_TASKS_WITH_USER = 1;
const VRP_MIN_TASKS_WITHOUT_USER = 2;

const logDebug = (...args: unknown[]) => console.log(LOG_PREFIX, ...args);
const logWarn = (...args: unknown[]) => console.warn(LOG_PREFIX, ...args);
const logError = (...args: unknown[]) => console.error(LOG_PREFIX, ...args);

/**
 * Função helper para validar respostas com Zod e tratar erros
 * Lança erro detalhado se a validação falhar
 */
const validateWithSchema = <T>(schema: z.ZodSchema<T>, data: unknown, context: string): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errorMessage = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    throw new Error(`Falha na validação da API (${context}): ${errorMessage}`);
  }

  // Type assertion: o schema Zod garante que os dados estão corretos
  return result.data as T;
};

// Schema para wrapper de resposta com { data: T }
const createDataWrapperSchema = <T>(itemSchema: z.ZodSchema<T>) => {
  return z.object({
    data: itemSchema,
  });
};

const appendQueryParam = (
  params: URLSearchParams,
  key: string,
  value?: string | number | null,
) => {
  if (value === undefined || value === null || value === "") return;
  params.append(key, String(value));
};

/**
 * Serviço para gerenciar rotas e roteiros.
 */
export const useRotaService = () => {
  const vrpService = useVrpService();
  const polylineCache = usePolylineCache();

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Busca lista de rotas do comprador
   */
  const fetchRotas = async (filters?: RotaFilters): Promise<RotaResponse | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const api = useMainApi(true);
      const queryParams = new URLSearchParams();

      appendQueryParam(queryParams, "page", filters?.page ?? null);
      appendQueryParam(queryParams, "itens", filters?.itens ?? null);
      appendQueryParam(queryParams, "status", filters?.status ?? null);
      appendQueryParam(queryParams, "data_inicio", filters?.data_inicio ?? null);
      appendQueryParam(queryParams, "data_fim", filters?.data_fim ?? null);

      const url = queryParams.toString() ? `${ROTAS_ENDPOINT}?${queryParams}` : ROTAS_ENDPOINT;

      const response = await api<RotaResponse>(url, {
        method: "GET",
      });

      return validateWithSchema(schemaRotaResponse, response, "fetchRotas");
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao buscar rotas";
      logError("fetchRotas error:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Busca roteiros (pontos) de uma rota específica
   */
  const fetchRoteiros = async (
    idRota: number,
    filters?: RoteiroFilters,
  ): Promise<RoteiroResponse | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const api = useMainApi(true);
      const queryParams = new URLSearchParams();

      appendQueryParam(queryParams, "id_rota", idRota);
      appendQueryParam(queryParams, "page", filters?.page ?? null);
      appendQueryParam(queryParams, "itens", filters?.itens ?? null);
      appendQueryParam(queryParams, "id_usuario", filters?.id_usuario ?? null);

      const response = await api<RoteiroResponse>(`${ROTEIRO_ENDPOINT}?${queryParams}`, {
        method: "GET",
      });

      return validateWithSchema(schemaRoteiroResponse, response, "fetchRoteiros");
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao buscar roteiros";
      logError("fetchRoteiros error:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Busca uma rota específica por ID
   */
  const fetchRotaById = async (id: number): Promise<Rota | null> => {
    const response = await fetchRotas();
    if (!response?.data) return null;
    return response.data.find((r) => r.id === id) || null;
  };

  /**
   * Calcula polyline usando o serviço VRP
   */
  const calcularPolyline = async (
    roteiros: Roteiro[],
    userLocation?: { latitude: number; longitude: number } | null,
  ): Promise<{ polyline: string; summary: VrpSummary } | null> => {
    return vrpService.calcularPolyline(roteiros, userLocation);
  };

  /**
   * Busca roteiros de uma rota e calcula a polyline
   * @param idRota - ID da rota
   * @param userLocation - Localização atual do usuário (GPS) para usar como ponto de partida
   */
  const fetchRotaComPolyline = async (
    idRota: number,
    userLocation?: { latitude: number; longitude: number } | null,
  ): Promise<{
    rota: Rota | null;
    roteiros: Roteiro[];
    polyline: string | null;
    summary: VrpSummary | null;
  }> => {
    // Busca rota
    const rota = await fetchRotaById(idRota);

    // Busca roteiros
    const roteirosResponse = await fetchRoteiros(idRota, { itens: DEFAULT_ROTEIROS_PAGE_SIZE });
    const roteiros = roteirosResponse?.data || [];
    logDebug("fetchRotaComPolyline - Roteiros carregados:", roteiros.length);
    logDebug("fetchRotaComPolyline - Localizacao do usuario:", userLocation);

    const roteirosWithCoords = getRoteirosWithCoords(roteiros);
    const roteirosValidos = roteirosWithCoords.map((item) => item.roteiro);

    logDebug("fetchRotaComPolyline - Roteiros com coordenadas validas:", roteirosValidos.length);

    let polyline: string | null = null;
    let summary: VrpSummary | null = null;

    const minPontos = userLocation ? VRP_MIN_TASKS_WITH_USER : VRP_MIN_TASKS_WITHOUT_USER;

    if (roteirosValidos.length >= minPontos) {
      logDebug("fetchRotaComPolyline - Calculando polyline com userLocation:", !!userLocation);
      const result = await calcularPolyline(roteirosValidos, userLocation);
      if (result) {
        polyline = result.polyline;
        summary = result.summary;
        logDebug("fetchRotaComPolyline - Polyline calculada:", polyline?.substring(0, 50) + "...");
      } else {
        logDebug("fetchRotaComPolyline - Falha ao calcular polyline");
      }
    } else {
      logWarn(
        "fetchRotaComPolyline - Pontos insuficientes para calcular polyline (minimo:",
        minPontos,
        ")",
      );
    }

    return { rota, roteiros, polyline, summary };
  };

  /**
   * Limpa cache de polylines
   */
  const clearPolylineCache = (): void => {
    polylineCache.clearPolylineCache();
  };

  /**
   * Cria uma nova rota
   */
  const createRota = async (data: {
    tipo?: string;
    data_inicio: string;
    data_fim: string;
    observacao?: string;
  }): Promise<Rota | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const api = useMainApi(true);
      const response = await api<{ data: Rota }>(ROTAS_ENDPOINT, {
        method: "POST",
        body: {
          tipo: data.tipo || DEFAULT_ROTA_TIPO,
          data_inicio: data.data_inicio,
          data_fim: data.data_fim,
          observacao: data.observacao || "",
        },
      });

      if (!response?.data) return null;

      const wrapperSchema = createDataWrapperSchema(schemaRota);
      const validated = validateWithSchema(wrapperSchema, response, "createRota");
      return validated.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao criar rota";
      logError("createRota error:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Cria um novo roteiro (ponto na rota)
   */
  const createRoteiro = async (payload: CreateRoteiroPayload): Promise<Roteiro | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const api = useMainApi(true);
      const response = await api<{ data: Roteiro }>(ROTEIRO_ENDPOINT, {
        method: "POST",
        body: payload,
      });

      // Limpa cache de polylines pois os pontos mudaram
      clearPolylineCache();

      if (!response?.data) return null;

      const wrapperSchema = createDataWrapperSchema(schemaRoteiro);
      const validated = validateWithSchema(wrapperSchema, response, "createRoteiro");
      return validated.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao criar roteiro";
      logError("createRoteiro error:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Deleta um roteiro
   */
  const deleteRoteiro = async (id: number): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const api = useMainApi(true);
      await api(`${ROTEIRO_ENDPOINT}/${id}`, {
        method: "DELETE",
      });

      // Limpa cache de polylines pois os pontos mudaram
      clearPolylineCache();

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao deletar roteiro";
      logError("deleteRoteiro error:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Atualiza a sequência de um roteiro
   * Usa PUT conforme a API NestJS (não PATCH)
   */
  const updateRoteiroSequencia = async (id: number, sequencia: number): Promise<boolean> => {
    error.value = null;

    try {
      const api = useMainApi(true);
      await api(`${ROTEIRO_ENDPOINT}/${id}`, {
        method: "PUT",
        body: { sequencia },
      });

      // Limpa cache de polylines
      clearPolylineCache();

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao atualizar sequência";
      logError("updateRoteiroSequencia error:", err);
      return false;
    }
  };

  /**
   * Reordena múltiplos roteiros de uma vez
   * Como a API valida sequências duplicadas, usamos sequências temporárias
   * para evitar conflitos durante a reordenação
   */
  const reordenarRoteiros = async (
    roteiros: Array<{ id: number; sequencia: number }>,
  ): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const api = useMainApi(true);

      // Estratégia: usar sequências temporárias altas para evitar conflitos
      // 1. Primeiro move todos para sequências temporárias (10000+)
      // 2. Depois move para as sequências finais

      // Passo 1: Mover para sequências temporárias
      for (let i = 0; i < roteiros.length; i++) {
        const roteiro = roteiros[i];
        await api(`${ROTEIRO_ENDPOINT}/${roteiro.id}`, {
          method: "PUT",
          body: { sequencia: TEMP_SEQUENCE_BASE + i },
        });
      }

      // Passo 2: Mover para sequências finais
      for (const roteiro of roteiros) {
        await api(`${ROTEIRO_ENDPOINT}/${roteiro.id}`, {
          method: "PUT",
          body: { sequencia: roteiro.sequencia },
        });
      }

      // Limpa cache de polylines
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

  return {
    // Estado
    isLoading,
    error,

    // Métodos de rotas
    fetchRotas,
    fetchRotaById,
    createRota,

    // Métodos de roteiros
    fetchRoteiros,
    createRoteiro,
    deleteRoteiro,
    updateRoteiroSequencia,
    reordenarRoteiros,

    // Métodos de polyline
    calcularPolyline,
    fetchRotaComPolyline,
    clearPolylineCache,

    // Utilitários
    toNumber,
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
