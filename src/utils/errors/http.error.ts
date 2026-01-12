import { AppError } from "./base.error";

/**
 * Erro HTTP genérico
 *
 * Lançado quando uma requisição HTTP falha.
 */
export class HttpError extends AppError {
  readonly code = "HTTP_ERROR";

  /**
   * Resposta HTTP (se disponível)
   */
  public readonly response?: unknown;

  /**
   * URL da requisição que falhou
   */
  public readonly url?: string;

  /**
   * Método HTTP da requisição
   */
  public readonly method?: string;

  constructor(
    message: string,
    public readonly statusCode: number,
    options?: {
      response?: unknown;
      url?: string;
      method?: string;
      context?: unknown;
    },
  ) {
    super(message, options?.context);
    this.response = options?.response;
    this.url = options?.url;
    this.method = options?.method;
  }

  /**
   * Factory methods para erros HTTP comuns
   */
  static badRequest(message: string, response?: unknown): HttpError {
    return new HttpError(message, 400, { response });
  }

  static unauthorized(message: string = "Não autorizado"): HttpError {
    return new HttpError(message, 401);
  }

  static forbidden(message: string = "Acesso negado"): HttpError {
    return new HttpError(message, 403);
  }

  static notFound(message: string = "Recurso não encontrado"): HttpError {
    return new HttpError(message, 404);
  }

  static serverError(message: string = "Erro interno do servidor"): HttpError {
    return new HttpError(message, 500);
  }

  /**
   * Override toJSON para incluir informações HTTP
   */
  override toJSON() {
    return {
      ...super.toJSON(),
      url: this.url,
      method: this.method,
      response: this.response,
    };
  }
}
