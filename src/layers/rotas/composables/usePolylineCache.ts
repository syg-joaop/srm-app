import { logger } from "~/utils/logger";

import type { PolylineCache, VrpSummary } from "../types/rotas.types";

const LOG_PREFIX = "[usePolylineCache]";
const CACHE_PREFIX = "polyline:";
const POLYLINE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

const logWarn = (...args: unknown[]) => logger.warn(LOG_PREFIX, ...args);

/**
 * Composable para gerenciar cache de polylines em localStorage.
 */
export function usePolylineCache() {
  /**
   * Gera chave de cache baseada nos IDs dos roteiros
   */
  const generateCacheKey = (
    roteiros: Array<{ id: number; sequencia?: number }>,
    userLocationStr?: string,
  ): string => {
    const ids = roteiros
      .sort((a, b) => (a.sequencia ?? 0) - (b.sequencia ?? 0))
      .map((r) => `${r.id}:${r.sequencia ?? 0}`)
      .join("-");
    return `${CACHE_PREFIX}${ids}${userLocationStr ? `:user:${userLocationStr}` : ""}`;
  };

  /**
   * Busca polyline do cache localStorage
   */
  const getPolylineFromCache = (cacheKey: string): PolylineCache | null => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const data: PolylineCache = JSON.parse(cached);
      const now = Date.now();

      // Verifica se o cache expirou
      if (now - data.timestamp > data.ttl) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  };

  /**
   * Salva polyline no cache localStorage
   */
  const savePolylineToCache = (
    cacheKey: string,
    polyline: string,
    summary: VrpSummary,
  ): void => {
    try {
      const data: PolylineCache = {
        polyline,
        summary,
        timestamp: Date.now(),
        ttl: POLYLINE_CACHE_TTL_MS,
      };
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (err) {
      logWarn("Erro ao salvar cache:", err);
    }
  };

  /**
   * Limpa todas as polylines do cache
   */
  const clearPolylineCache = (): void => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  };

  return {
    generateCacheKey,
    getPolylineFromCache,
    savePolylineToCache,
    clearPolylineCache,
  };
}
