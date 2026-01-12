import { AppError } from "./base.error";

/**
 * Erro de regra de negócio
 *
 * Lançado quando uma regra de negócio é violada.
 */
export class BusinessError extends AppError {
  readonly statusCode = 422; // Unprocessable Entity

  constructor(
    message: string,
    public readonly code: string,
    context?: unknown,
  ) {
    super(message, context);
  }

  /**
   * Factory method para criar erro de negócio
   */
  static create(code: string, message: string, context?: unknown): BusinessError {
    return new BusinessError(message, code, context);
  }
}
