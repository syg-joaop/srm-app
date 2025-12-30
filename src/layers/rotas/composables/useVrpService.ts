import { logger } from "~/utils/logger";
import type { Roteiro, VrpRouteRequest, VrpRouteResponse, VrpSummary } from "../types/rotas.types";
import { usePolylineCache } from "./usePolylineCache";
import { roteirosToVrpTasks, createVirtualVehicle, getRoteirosWithCoords } from "./roteirosHelpers";
import { validateVrpResponse } from "../schemas/vrp.schema";

const LOG_PREFIX = "[useVrpService]";

// VRP constants
const VRP_TIMEZONE = "America/Sao_Paulo";
const VRP_MIN_TASKS_WITH_USER = 1;
const VRP_MIN_TASKS_WITHOUT_USER = 2;
const VRP_MAX_DAYS_WORKING = 1;
const VRP_LOCATION_PRECISION = 4;

const logDebug = (...args: unknown[]) => logger.debug(LOG_PREFIX, ...args);
const logWarn = (...args: unknown[]) => logger.warn(LOG_PREFIX, ...args);
const logError = (...args: unknown[]) => logger.error(LOG_PREFIX, ...args);

/**
 * Verifica se um valor é VrpSummary.
 */
const isVrpSummary = (value: unknown): value is VrpSummary => {
  if (!value || typeof value !== "object") return false;
  return "distance" in value && "time" in value;
};

const DEFAULT_VRP_SUMMARY: VrpSummary = {
  distance: { meters: 0 },
  time: { duration: 0, traveling: 0 },
};

/**
 * Composable para calcular polylines usando a VRP API.
 */
export function useVrpService() {
  const config = useRuntimeConfig();
  const cache = usePolylineCache();

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Configuração da API VRP
  const VRP_API_URL = (config.public?.vrpApiUrl as string) || "";
  const VRP_API_KEY = (config.public?.vrpApiKey as string) || "";

  /**
   * Faz a parse da resposta da VRP API.
   */
  const parseVrpResponse = (response: VrpRouteResponse) => {
    type VrpApiResponseShape = {
      response?: unknown;
      unassignedTasks?: unknown;
      workDays?: Array<{
        plans?: Array<{ route?: { polyline?: unknown }; summary?: unknown }>;
      }>;
      summary?: unknown;
    };

    const responseData = response as unknown as VrpApiResponseShape;
    const vrpData = (responseData.response as VrpApiResponseShape | undefined) ?? responseData;

    const unassignedTasks = Array.isArray(vrpData.unassignedTasks)
      ? vrpData.unassignedTasks
      : [];
    const plan = vrpData.workDays?.[0]?.plans?.[0];
    const polyline = plan?.route?.polyline;
    const summaryData = plan?.summary || vrpData.summary;
    const summary = isVrpSummary(summaryData) ? summaryData : DEFAULT_VRP_SUMMARY;

    return {
      polyline,
      summary,
      unassignedTasks,
      unassignedCount: unassignedTasks.length,
    };
  };

  /**
   * Chama a API VRP para calcular a polyline.
   */
  const callVrp = async (
    roteiros: Roteiro[],
    tasks: ReturnType<typeof roteirosToVrpTasks>,
    location?: { latitude: number; longitude: number } | null,
  ) => {
    const minTasks = location ? VRP_MIN_TASKS_WITH_USER : VRP_MIN_TASKS_WITHOUT_USER;
    if (tasks.length < minTasks) return null;

    // Cache por combinação de pontos + localização (se houver)
    const userLocStr = location
      ? `${location.latitude.toFixed(VRP_LOCATION_PRECISION)},${location.longitude.toFixed(VRP_LOCATION_PRECISION)}`
      : "";
    const cacheKey = cache.generateCacheKey(roteiros, userLocStr);

    const cached = cache.getPolylineFromCache(cacheKey);
    if (cached) {
      logDebug("Polyline encontrada no cache");
      return { polyline: cached.polyline, summary: cached.summary };
    }

    const vehicle = createVirtualVehicle(roteiros, location);
    if (!vehicle || tasks.length < minTasks) {
      return null;
    }

    const request: VrpRouteRequest = {
      timezone: VRP_TIMEZONE,
      maxDaysWorking: VRP_MAX_DAYS_WORKING,
      vehicles: [vehicle],
      tasks,
    };

    logDebug("Chamando API VRP:", request);

    const response = await $fetch(VRP_API_URL + "/route", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": VRP_API_KEY,
      },
      body: request,
    });

    logDebug("Resposta API VRP:", response);

    // Valida a resposta com o schema Zod
    const validatedResponse = validateVrpResponse(response);

    const parsed = parseVrpResponse(validatedResponse);
    if (!parsed.polyline || typeof parsed.polyline !== "string") {
      return null;
    }

    const result = { polyline: parsed.polyline, summary: parsed.summary };

    // Salva no cache
    cache.savePolylineToCache(cacheKey, result.polyline, result.summary);

    // Se houve tarefas não atribuídas, loga warning
    if (parsed.unassignedCount > 0 && location) {
      logWarn(
        "VRP retornou tarefas nao atribuidas ao usar localizacao do usuario; usando fallback sem localizacao.",
        parsed.unassignedTasks,
      );
    }

    return result;
  };

  /**
   * Calcula polyline chamando a API VRP.
   * @param roteiros - Lista de roteiros
   * @param userLocation - Localização atual do usuário (GPS) para usar como ponto de partida
   */
  const calcularPolyline = async (
    roteiros: Roteiro[],
    userLocation?: { latitude: number; longitude: number } | null,
  ): Promise<{ polyline: string; summary: VrpSummary } | null> => {
    isLoading.value = true;
    error.value = null;

    if (!VRP_API_URL || !VRP_API_KEY) {
      error.value = "VRP API nao configurada";
      logWarn("VRP API config ausente.");
      isLoading.value = false;
      return null;
    }

    try {
      const tasks = roteirosToVrpTasks(roteiros);

      if (tasks.length === 0) {
        error.value = "Nenhum ponto com coordenadas válidas para calcular a rota";
        return null;
      }

      // 1) Tenta com a localização do usuário (se houver)
      const resultWithUser = await callVrp(roteiros, tasks, userLocation);

      if (!resultWithUser && userLocation && tasks.length >= VRP_MIN_TASKS_WITHOUT_USER) {
        logWarn(
          "VRP nao conseguiu gerar polyline com localizacao do usuario; tentando sem localizacao.",
        );
        const fallback = await callVrp(roteiros, tasks, null);
        if (fallback) return fallback;
      }

      if (resultWithUser) return resultWithUser;

      error.value = "API VRP não retornou polyline";
      return null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao calcular polyline";
      logError("calcularPolyline error:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    calcularPolyline,
  };
}
