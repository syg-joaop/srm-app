import { FetchError } from "ofetch";
import { z, ZodError } from "zod";

import { HttpError, NetworkError, ValidationError } from "~/utils/errors";

const AUTH_KEY = "srm_auth_user";
const TIMEOUT_MS = 30000;

type ApiTarget = "login" | "api";

const getToken = (): string | null => {
  if (!import.meta.client) return null;
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as { token?: unknown };
    return typeof parsed?.token === "string" ? parsed.token : null;
  } catch {
    return null;
  }
};

const buildHeaders = (): Record<string, string> => {
  const config = useRuntimeConfig();
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  if (config.public.apiSecret) headers["x-secret"] = config.public.apiSecret as string;

  return headers;
};

export const handleError = (
  error: TypeError | Error | FetchError | ZodError | unknown,
  url: string,
  method: string,
): ValidationError | NetworkError | HttpError | never => {
  if (error instanceof TypeError && error.message.includes("fetch")) return NetworkError.offline();
  if (error instanceof ZodError) return ValidationError.fromZodError(error, "Dados inválidos");
  if (error instanceof Error)
    return new HttpError(error.message, error.cause as number, { url, method });
  if (error instanceof FetchError) {
    if (error.message.includes("timeout")) return NetworkError.timeout();
    return new HttpError(error.message, error.statusCode || 500, {
      url,
      method,
      response: error.data,
    });
  }

  return new HttpError("Erro desconhecido", 500, { url, method });
};

/**
 * Cliente HTTP unificado
 *
 * @param target - 'login' para apiBaseUrl, omitir para apiV2UrlHomol
 */
export const useApi = (target?: ApiTarget) => {
  const config = useRuntimeConfig();
  const baseURL =
    target === "login"
      ? (config.public.apiBaseUrl as string)
      : (config.public.apiV2UrlHomol as string);
  const headers = buildHeaders();

  const request = async <T>(method: string, url: string, body?: unknown): Promise<T> => {
    try {
      return (await $fetch(url, { baseURL, method, headers, body, timeout: TIMEOUT_MS })) as T;
    } catch (error) {
      throw handleError(error, url, method);
    }
  };

  const get = <T = unknown>(url: string) => request<T>("GET", url);
  const post = <T = unknown>(url: string, data: unknown) => request<T>("POST", url, data);
  const put = <T = unknown>(url: string, data: unknown) => request<T>("PUT", url, data);
  const patch = <T = unknown>(url: string, data: unknown) => request<T>("PATCH", url, data);
  const del = <T = unknown>(url: string) => request<T>("DELETE", url);

  const getValidated = async <S extends z.ZodTypeAny>(
    url: string,
    schema: S,
  ): Promise<z.infer<S>> => {
    const data = await request<unknown>("GET", url);
    const result = schema.safeParse(data);
    if (!result.success) throw ValidationError.fromZodError(result.error, "Resposta inválida");
    return result.data;
  };

  const postValidated = async <R extends z.ZodTypeAny, S extends z.ZodTypeAny>(
    url: string,
    requestSchema: R,
    responseSchema: S,
    data: unknown,
  ): Promise<z.infer<S>> => {
    const reqResult = requestSchema.safeParse(data);
    if (!reqResult.success) throw ValidationError.fromZodError(reqResult.error, "Dados inválidos");

    const response = await request<unknown>("POST", url, reqResult.data);

    const resResult = responseSchema.safeParse(response);
    if (!resResult.success)
      throw ValidationError.fromZodError(resResult.error, "Resposta inválida");

    return resResult.data;
  };

  return { get, post, put, patch, delete: del, getValidated, postValidated };
};

export const useHttpClient = useApi;
