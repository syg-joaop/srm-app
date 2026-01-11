import { z } from "zod";

import {
  schemaRota,
  schemaRotaResponse,
  schemaRoteiro,
  schemaRoteiroResponse,
} from "../../schemas/rotas.schema";
import { logger } from "~/utils/logger";

import type {
  CreateRoteiroPayload,
  RotaFilters,
  RoteiroFilters,
} from "../../schemas/rotas.schema";
import type {
  Rota,
  RotaResponse,
  Roteiro,
  RoteiroResponse,
} from "../../schemas/rotas.schema";

const LOG_PREFIX = "[RotaApiService]";
const ROTAS_ENDPOINT = "/srm/rotas";
const ROTEIRO_ENDPOINT = "/srm/roteiro";
const DEFAULT_ROTA_TIPO = "COMPRA";

const logDebug = (...args: unknown[]) => logger.debug(LOG_PREFIX, ...args);
const logError = (...args: unknown[]) => logger.error(LOG_PREFIX, ...args);

/**
 * Valida resposta com Zod e lança erro detalhado se falhar.
 */
const validateWithSchema = <T>(schema: z.ZodSchema<T>, data: unknown, context: string): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errorMessage = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    throw new Error(`Falha na validação da API (${context}): ${errorMessage}`);
  }

  return result.data as T;
};

/**
 * Schema para wrapper de resposta com { data: T }
 */
const createDataWrapperSchema = <T>(itemSchema: z.ZodSchema<T>) => {
  return z.object({
    data: itemSchema,
  });
};

/**
 * Adiciona query parameter se valor for válido.
 */
const appendQueryParam = (
  params: URLSearchParams,
  key: string,
  value?: string | number | null,
) => {
  if (value === undefined || value === null || value === "") return;
  params.append(key, String(value));
};

/**
 * Serviço API para operações de rotas e roteiros.
 * Responsabilidade: chamadas HTTP + validação Zod (sem estado reativo).
 */
export class RotaApiService {
  /**
   * Busca lista de rotas do comprador.
   */
  async fetchRotas(filters?: RotaFilters): Promise<RotaResponse> {
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
  }

  /**
   * Busca roteiros (pontos) de uma rota específica.
   */
  async fetchRoteiros(idRota: number, filters?: RoteiroFilters): Promise<RoteiroResponse> {
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
  }

  /**
   * Busca uma rota específica por ID.
   */
  async fetchRotaById(id: number): Promise<Rota | null> {
    const response = await this.fetchRotas();
    if (!response?.data) return null;
    return response.data.find((r) => r.id === id) || null;
  }

  /**
   * Cria uma nova rota.
   */
  async createRota(data: {
    tipo?: string;
    data_inicio: string;
    data_fim: string;
    observacao?: string;
  }): Promise<Rota> {
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

    if (!response?.data) {
      throw new Error("Resposta vazia ao criar rota");
    }

    const wrapperSchema = createDataWrapperSchema(schemaRota);
    const validated = validateWithSchema(wrapperSchema, response, "createRota");
    return validated.data;
  }

  /**
   * Cria um novo roteiro (ponto na rota).
   */
  async createRoteiro(payload: CreateRoteiroPayload): Promise<Roteiro> {
    const api = useMainApi(true);
    const response = await api<{ data: Roteiro }>(ROTEIRO_ENDPOINT, {
      method: "POST",
      body: payload,
    });

    if (!response?.data) {
      throw new Error("Resposta vazia ao criar roteiro");
    }

    const wrapperSchema = createDataWrapperSchema(schemaRoteiro);
    const validated = validateWithSchema(wrapperSchema, response, "createRoteiro");
    return validated.data;
  }

  /**
   * Deleta um roteiro.
   */
  async deleteRoteiro(id: number): Promise<void> {
    const api = useMainApi(true);
    await api(`${ROTEIRO_ENDPOINT}/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Atualiza a sequência de um roteiro.
   * Usa PUT conforme a API NestJS (não PATCH).
   */
  async updateRoteiroSequencia(id: number, sequencia: number): Promise<void> {
    const api = useMainApi(true);
    await api(`${ROTEIRO_ENDPOINT}/${id}`, {
      method: "PUT",
      body: { sequencia },
    });
  }
}
