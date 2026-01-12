import { z } from "zod";

import { ValidationError } from "~/utils/errors";

import { useHttpClient } from "./useHttpClient";

/**
 * Cliente HTTP com validação automática via Zod
 *
 * Wrapper sobre useHttpClient que adiciona validação automática de entrada/saída.
 * Use este composable ao invés de useHttpClient diretamente.
 *
 * @example
 * ```ts
 * const client = useTypedHttpClient('https://api.example.com')
 *
 * // GET com validação automática
 * const user = await client.get('/users/1', userSchema)
 *
 * // POST com validação de entrada e saída
 * const newUser = await client.post(
 *   '/users',
 *   createUserRequestSchema,
 *   userSchema,
 *   { name: 'John', email: 'john@example.com' }
 * )
 * ```
 */
export const useTypedHttpClient = (baseURL: string) => {
  const baseClient = useHttpClient(baseURL);

  /**
   * GET com validação automática de resposta
   */
  const get = async <TSchema extends z.ZodTypeAny>(
    url: string,
    responseSchema: TSchema,
    options?: RequestInit,
    requestId?: string,
  ): Promise<z.infer<TSchema>> => {
    const data = await baseClient.get<unknown>(url, options, requestId);

    try {
      return responseSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw ValidationError.fromZodError(error, "Resposta da API inválida");
      }
      throw error;
    }
  };

  /**
   * POST com validação de entrada e saída
   */
  const post = async <TRequestSchema extends z.ZodTypeAny, TResponseSchema extends z.ZodTypeAny>(
    url: string,
    requestSchema: TRequestSchema,
    responseSchema: TResponseSchema,
    data: unknown,
    options?: RequestInit,
    requestId?: string,
  ): Promise<z.infer<TResponseSchema>> => {
    // Valida dados de entrada
    let validData: z.infer<TRequestSchema>;
    try {
      validData = requestSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw ValidationError.fromZodError(error, "Dados de entrada inválidos");
      }
      throw error;
    }

    // Faz requisição
    const response = await baseClient.post<unknown>(url, validData, options, requestId);

    // Valida resposta
    try {
      return responseSchema.parse(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw ValidationError.fromZodError(error, "Resposta da API inválida");
      }
      throw error;
    }
  };

  /**
   * PUT com validação de entrada e saída
   */
  const put = async <TRequestSchema extends z.ZodTypeAny, TResponseSchema extends z.ZodTypeAny>(
    url: string,
    requestSchema: TRequestSchema,
    responseSchema: TResponseSchema,
    data: unknown,
    options?: RequestInit,
    requestId?: string,
  ): Promise<z.infer<TResponseSchema>> => {
    // Valida dados de entrada
    let validData: z.infer<TRequestSchema>;
    try {
      validData = requestSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw ValidationError.fromZodError(error, "Dados de entrada inválidos");
      }
      throw error;
    }

    // Faz requisição
    const response = await baseClient.put<unknown>(url, validData, options, requestId);

    // Valida resposta
    try {
      return responseSchema.parse(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw ValidationError.fromZodError(error, "Resposta da API inválida");
      }
      throw error;
    }
  };

  /**
   * PATCH com validação de entrada e saída
   */
  const patch = async <TRequestSchema extends z.ZodTypeAny, TResponseSchema extends z.ZodTypeAny>(
    url: string,
    requestSchema: TRequestSchema,
    responseSchema: TResponseSchema,
    data: unknown,
    options?: RequestInit,
    requestId?: string,
  ): Promise<z.infer<TResponseSchema>> => {
    // Valida dados de entrada
    let validData: z.infer<TRequestSchema>;
    try {
      validData = requestSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw ValidationError.fromZodError(error, "Dados de entrada inválidos");
      }
      throw error;
    }

    // Faz requisição
    const response = await baseClient.patch<unknown>(url, validData, options, requestId);

    // Valida resposta
    try {
      return responseSchema.parse(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw ValidationError.fromZodError(error, "Resposta da API inválida");
      }
      throw error;
    }
  };

  /**
   * DELETE com validação de resposta
   */
  const del = async <TSchema extends z.ZodTypeAny>(
    url: string,
    responseSchema: TSchema,
    options?: RequestInit,
    requestId?: string,
  ): Promise<z.infer<TSchema>> => {
    const data = await baseClient.delete<unknown>(url, options, requestId);

    try {
      return responseSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw ValidationError.fromZodError(error, "Resposta da API inválida");
      }
      throw error;
    }
  };

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    config: baseClient.config,
  };
};
