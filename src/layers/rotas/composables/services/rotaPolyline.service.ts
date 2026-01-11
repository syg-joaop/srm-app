import { logger } from "~/utils/logger";

import { getRoteirosWithCoords } from "../roteirosHelpers";

import type { RotaApiService } from "./rotaApi.service";
import type { VrpSummary } from "../../schemas/rotas.schema";
import type { Rota, Roteiro } from "../../schemas/rotas.schema";

const LOG_PREFIX = "[RotaPolylineService]";
const DEFAULT_ROTEIROS_PAGE_SIZE = 100;
const VRP_MIN_TASKS_WITH_USER = 1;
const VRP_MIN_TASKS_WITHOUT_USER = 2;

const logDebug = (...args: unknown[]) => logger.debug(LOG_PREFIX, ...args);
const logWarn = (...args: unknown[]) => logger.warn(LOG_PREFIX, ...args);
const logError = (...args: unknown[]) => logger.error(LOG_PREFIX, ...args);

/**
 * Serviço para cálculo de polylines e integração com VRP.
 * Responsabilidade: orquestrar buscas + cálculo de polylines.
 */
export class RotaPolylineService {
  constructor(
    private rotaApi: RotaApiService,
    private calcularPolylineFn: (
      roteiros: Roteiro[],
      userLocation?: { latitude: number; longitude: number } | null,
    ) => Promise<{ polyline: string; summary: VrpSummary } | null>,
  ) {}

  /**
   * Calcula polyline usando o serviço VRP.
   */
  async calcularPolyline(
    roteiros: Roteiro[],
    userLocation?: { latitude: number; longitude: number } | null,
  ): Promise<{ polyline: string; summary: VrpSummary } | null> {
    return this.calcularPolylineFn(roteiros, userLocation);
  }

  /**
   * Busca roteiros de uma rota e calcula a polyline.
   *
   * @param idRota - ID da rota
   * @param userLocation - Localização atual do usuário (GPS) para usar como ponto de partida
   * @returns Objeto com rota, roteiros, polyline e summary
   */
  async fetchRotaComPolyline(
    idRota: number,
    userLocation?: { latitude: number; longitude: number } | null,
  ): Promise<{
    rota: Rota | null;
    roteiros: Roteiro[];
    polyline: string | null;
    summary: VrpSummary | null;
  }> {
    // Busca rota
    const rota = await this.rotaApi.fetchRotaById(idRota);

    // Busca roteiros
    const roteirosResponse = await this.rotaApi.fetchRoteiros(idRota, {
      itens: DEFAULT_ROTEIROS_PAGE_SIZE,
    });
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
      const result = await this.calcularPolyline(roteirosValidos, userLocation);

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
  }
}
