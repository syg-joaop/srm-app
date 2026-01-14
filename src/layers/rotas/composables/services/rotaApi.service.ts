import { z } from "zod";

import {
  schemaRota,
  schemaRotaResponse,
  schemaRoteiro,
  schemaRoteiroResponse,
} from "../../schemas/rotas.schema";

import type {
  CreateRoteiroPayload,
  Rota,
  RotaFilters,
  RotaResponse,
  Roteiro,
  RoteiroFilters,
  RoteiroResponse,
} from "../../schemas/rotas.schema";

const ROTAS_ENDPOINT = "/srm/rotas";
const ROTEIRO_ENDPOINT = "/srm/roteiro";
const DEFAULT_ROTA_TIPO = "COMPRA";

const validateWithSchema = <T>(schema: z.ZodSchema<T>, data: unknown, context: string): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errorMessage = result.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ");
    throw new Error(`Falha na validação da API (${context}): ${errorMessage}`);
  }
  return result.data as T;
};

const createDataWrapperSchema = <T>(itemSchema: z.ZodSchema<T>) => z.object({ data: itemSchema });

const appendQueryParam = (params: URLSearchParams, key: string, value?: string | number | null) => {
  if (value !== undefined && value !== null && value !== "") params.append(key, String(value));
};

export class RotaApiService {
  async fetchRotas(filters?: RotaFilters): Promise<RotaResponse> {
    const api = useHttpClient();
    const queryParams = new URLSearchParams();

    appendQueryParam(queryParams, "page", filters?.page);
    appendQueryParam(queryParams, "itens", filters?.itens);
    appendQueryParam(queryParams, "status", filters?.status);
    appendQueryParam(queryParams, "data_inicio", filters?.data_inicio);
    appendQueryParam(queryParams, "data_fim", filters?.data_fim);

    const url = queryParams.toString() ? `${ROTAS_ENDPOINT}?${queryParams}` : ROTAS_ENDPOINT;
    const response = await api.get<RotaResponse>(url);

    return validateWithSchema(schemaRotaResponse, response, "fetchRotas");
  }

  async fetchRoteiros(idRota: number, filters?: RoteiroFilters): Promise<RoteiroResponse> {
    const api = useHttpClient();
    const queryParams = new URLSearchParams();

    appendQueryParam(queryParams, "id_rota", idRota);
    appendQueryParam(queryParams, "page", filters?.page);
    appendQueryParam(queryParams, "itens", filters?.itens);
    appendQueryParam(queryParams, "id_usuario", filters?.id_usuario);

    const response = await api.get<RoteiroResponse>(`${ROTEIRO_ENDPOINT}?${queryParams}`);
    return validateWithSchema(schemaRoteiroResponse, response, "fetchRoteiros");
  }

  async fetchRotaById(id: number): Promise<Rota | null> {
    const response = await this.fetchRotas();
    return response?.data?.find((r) => r.id === id) ?? null;
  }

  async createRota(data: { tipo?: string; data_inicio: string; data_fim: string; observacao?: string }): Promise<Rota> {
    const api = useHttpClient();
    const response = await api.post<{ data: Rota }>(ROTAS_ENDPOINT, {
      tipo: data.tipo || DEFAULT_ROTA_TIPO,
      data_inicio: data.data_inicio,
      data_fim: data.data_fim,
      observacao: data.observacao || "",
    });

    if (!response?.data) throw new Error("Resposta vazia ao criar rota");

    const validated = validateWithSchema(createDataWrapperSchema(schemaRota), response, "createRota");
    return validated.data;
  }

  async createRoteiro(payload: CreateRoteiroPayload): Promise<Roteiro> {
    const api = useHttpClient();
    const response = await api.post<{ data: Roteiro }>(ROTEIRO_ENDPOINT, payload);

    if (!response?.data) throw new Error("Resposta vazia ao criar roteiro");

    const validated = validateWithSchema(createDataWrapperSchema(schemaRoteiro), response, "createRoteiro");
    return validated.data;
  }

  async deleteRoteiro(id: number): Promise<void> {
    const api = useHttpClient();
    await api.delete(`${ROTEIRO_ENDPOINT}/${id}`);
  }

  async updateRoteiroSequencia(id: number, sequencia: number): Promise<void> {
    const api = useHttpClient();
    await api.put(`${ROTEIRO_ENDPOINT}/${id}`, { sequencia });
  }
}
