/**
 * Error Classes - Hierarquia de erros da aplicação
 *
 * Este módulo exporta todas as classes de erro customizadas.
 * Use estas classes ao invés de lançar Error genérico.
 *
 * Hierarquia:
 * - AppError (base abstrata)
 *   - ValidationError (erros de validação Zod)
 *   - HttpError (erros HTTP)
 *   - AuthError (erros de autenticação/autorização)
 *   - NetworkError (erros de rede/conectividade)
 *   - BusinessError (erros de regra de negócio)
 */

export * from "./auth.error";
export * from "./base.error";
export * from "./business.error";
export * from "./http.error";
export * from "./network.error";
export * from "./validation.error";

/**
 * Type guard para verificar se é um AppError
 */
export function isAppError(error: unknown): error is import("./base.error").AppError {
  return error instanceof Error && "code" in error && "statusCode" in error;
}

/**
 * Type guard para verificar se é um ValidationError
 */
export function isValidationError(
  error: unknown,
): error is import("./validation.error").ValidationError {
  return isAppError(error) && error.code === "VALIDATION_ERROR";
}

/**
 * Type guard para verificar se é um HttpError
 */
export function isHttpError(error: unknown): error is import("./http.error").HttpError {
  return isAppError(error) && error.code === "HTTP_ERROR";
}

/**
 * Type guard para verificar se é um AuthError
 */
export function isAuthError(error: unknown): error is import("./auth.error").AuthError {
  return (
    isAppError(error) &&
    [
      "UNAUTHORIZED",
      "FORBIDDEN",
      "TOKEN_EXPIRED",
      "INVALID_TOKEN",
      "SESSION_EXPIRED",
      "INVALID_CREDENTIALS",
    ].includes(error.code)
  );
}

/**
 * Type guard para verificar se é um NetworkError
 */
export function isNetworkError(error: unknown): error is import("./network.error").NetworkError {
  return isAppError(error) && error.code === "NETWORK_ERROR";
}

/**
 * Type guard para verificar se é um BusinessError
 */
export function isBusinessError(error: unknown): error is import("./business.error").BusinessError {
  return isAppError(error) && error.statusCode === 422;
}
