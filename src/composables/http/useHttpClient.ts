import { FetchError } from "ofetch";

import { httpClientConfigSchema } from "~/schemas/shared/http";
import { HttpError, NetworkError } from "~/utils/errors";

import type { HttpClientConfig, HttpRequest, HttpResponse } from "~/schemas/shared/http";

const AUTH_STORAGE_KEY = "srm_auth_user";

/**
 * Lê o token do localStorage
 */
const readTokenFromStorage = (): string | null => {
  if (!import.meta.client) return null;
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as { token?: unknown } | null;
    return typeof parsed?.token === "string" ? parsed.token : null;
  } catch {
    return null;
  }
};

/**
 * Composable base para cliente HTTP
 *
 * Encapsula $fetch com interceptação e tratamento de erros.
 * Use useTypedHttpClient para validação automática com Zod.
 */
export const useHttpClient = (baseURL: string) => {
  const runtimeConfig = useRuntimeConfig();

  const token = readTokenFromStorage();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (runtimeConfig.public.apiSecret) {
    headers["x-secret"] = runtimeConfig.public.apiSecret;
  }

  // Valida configuração
  const config: HttpClientConfig = httpClientConfigSchema.parse({
    baseURL,
    timeout: 300000,
    headers,
  });

  // Acessa interceptor do plugin (apenas no client)
  const { $httpInterceptor } = useNuxtApp();

  /**
   * Executa interceptor se disponível
   */
  const executeInterceptor = async (
    request: HttpRequest,
    response?: HttpResponse,
    requestId?: string,
  ) => {
    if (process.client && $httpInterceptor) {
      await $httpInterceptor.execute(request, response, requestId);
    }
  };

  /**
   * Trata erros HTTP e converte para erros tipados
   */
  const handleError = (error: unknown, url: string, method: string): never => {
    // Erro de rede/conectividade
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw NetworkError.offline();
    }

    // Erro do $fetch (ofetch)
    if (error instanceof FetchError) {
      const statusCode = error.statusCode || 500;

      // Timeout
      if (error.message.includes("timeout")) {
        throw NetworkError.timeout();
      }

      // Erro HTTP
      throw new HttpError(error.message, statusCode, {
        response: error.data,
        url,
        method,
      });
    }

    // Erro desconhecido
    throw new HttpError("Erro desconhecido na requisição", 500, {
      url,
      method,
      context: error,
    });
  };

  /**
   * GET request
   */
  const get = async <T = unknown>(
    url: string,
    options?: RequestInit,
    requestId?: string,
  ): Promise<T> => {
    try {
      const response = (await $fetch(url, {
        baseURL: config.baseURL,
        method: "GET",
        headers: config.headers,
        timeout: config.timeout,
        ...options,
      })) as T;

      await executeInterceptor(
        { url, method: "GET" },
        { status: 200, statusText: "OK", data: response, headers: {} },
        requestId,
      );

      return response;
    } catch (error) {
      await executeInterceptor({ url, method: "GET" }, undefined, requestId);
      return handleError(error, url, "GET");
    }
  };

  /**
   * POST request
   */
  const post = async <T = unknown>(
    url: string,
    data: unknown,
    options?: RequestInit,
    requestId?: string,
  ): Promise<T> => {
    try {
      const response = (await $fetch(url, {
        baseURL: config.baseURL,
        method: "POST",
        headers: config.headers,
        body: data,
        timeout: config.timeout,
        ...options,
      })) as T;

      await executeInterceptor(
        { url, method: "POST", data },
        { status: 200, statusText: "OK", data: response, headers: {} },
        requestId,
      );

      return response;
    } catch (error) {
      await executeInterceptor({ url, method: "POST", data }, undefined, requestId);
      return handleError(error, url, "POST");
    }
  };

  /**
   * PUT request
   */
  const put = async <T = unknown>(
    url: string,
    data: unknown,
    options?: RequestInit,
    requestId?: string,
  ): Promise<T> => {
    try {
      const response = (await $fetch(url, {
        baseURL: config.baseURL,
        method: "PUT",
        headers: config.headers,
        body: data,
        timeout: config.timeout,
        ...options,
      })) as T;

      await executeInterceptor(
        { url, method: "PUT", data },
        { status: 200, statusText: "OK", data: response, headers: {} },
        requestId,
      );

      return response;
    } catch (error) {
      await executeInterceptor({ url, method: "PUT", data }, undefined, requestId);
      return handleError(error, url, "PUT");
    }
  };

  /**
   * PATCH request
   */
  const patch = async <T = unknown>(
    url: string,
    data: unknown,
    options?: RequestInit,
    requestId?: string,
  ): Promise<T> => {
    try {
      const response = (await $fetch(url, {
        baseURL: config.baseURL,
        method: "PATCH",
        headers: config.headers,
        body: data,
        timeout: config.timeout,
        ...options,
      })) as T;

      await executeInterceptor(
        { url, method: "PATCH", data },
        { status: 200, statusText: "OK", data: response, headers: {} },
        requestId,
      );

      return response;
    } catch (error) {
      await executeInterceptor({ url, method: "PATCH", data }, undefined, requestId);
      return handleError(error, url, "PATCH");
    }
  };

  /**
   * DELETE request
   */
  const del = async <T = unknown>(
    url: string,
    options?: RequestInit,
    requestId?: string,
  ): Promise<T> => {
    try {
      const response = (await $fetch(url, {
        baseURL: config.baseURL,
        method: "DELETE",
        headers: config.headers,
        timeout: config.timeout,
        ...options,
      })) as T;

      await executeInterceptor(
        { url, method: "DELETE" },
        { status: 200, statusText: "OK", data: response, headers: {} },
        requestId,
      );

      return response;
    } catch (error) {
      await executeInterceptor({ url, method: "DELETE" }, undefined, requestId);
      return handleError(error, url, "DELETE");
    }
  };

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    config,
  };
};
