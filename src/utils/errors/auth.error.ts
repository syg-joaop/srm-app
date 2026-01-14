import { AppError } from "./base.error";

/**
 * Tipos de erros de autenticação
 */
export type AuthErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "TOKEN_EXPIRED"
  | "INVALID_TOKEN"
  | "SESSION_EXPIRED"
  | "INVALID_CREDENTIALS";

/**
 * Erro de autenticação/autorização
 *
 * Lançado quando há problemas com autenticação ou autorização.
 */
export class AuthError extends AppError {
  readonly code: AuthErrorCode;
  readonly statusCode: number;

  // Mapeamento de códigos de erro para status HTTP
  static readonly ERROR_CODE_TO_STATUS = {
    UNAUTHORIZED: 401,
    INVALID_CREDENTIALS: 401,
    TOKEN_EXPIRED: 401,
    INVALID_TOKEN: 401,
    SESSION_EXPIRED: 401,
    FORBIDDEN: 403,
  } as const;

  constructor(message: string, code: AuthErrorCode, context?: unknown) {
    super(message, context);
    this.code = code;
    // Define status code baseado no tipo de erro
    this.statusCode = AuthError.ERROR_CODE_TO_STATUS[code] ?? 401;
  }

  /**
   * Factory methods para erros de autenticação comuns
   */
  static unauthorized(message: string = "Não autorizado"): AuthError {
    return new AuthError(message, "UNAUTHORIZED");
  }

  static forbidden(message: string = "Acesso negado"): AuthError {
    return new AuthError(message, "FORBIDDEN");
  }

  static tokenExpired(message: string = "Token expirado"): AuthError {
    return new AuthError(message, "TOKEN_EXPIRED");
  }

  static invalidToken(message: string = "Token inválido"): AuthError {
    return new AuthError(message, "INVALID_TOKEN");
  }

  static sessionExpired(message: string = "Sessão expirada"): AuthError {
    return new AuthError(message, "SESSION_EXPIRED");
  }

  static invalidCredentials(message: string = "Credenciais inválidas"): AuthError {
    return new AuthError(message, "INVALID_CREDENTIALS");
  }
}
