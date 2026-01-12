import { z } from "zod";

import { AppError } from "./base.error";

/**
 * Erro de validação de dados (Zod)
 *
 * Lançado quando dados não passam na validação de schema Zod.
 */
export class ValidationError extends AppError {
  readonly code = "VALIDATION_ERROR";
  readonly statusCode = 400;

  /**
   * Erro Zod original
   */
  public readonly zodError: z.ZodError;

  /**
   * Erros formatados para exibição
   */
  public readonly errors: Array<{
    path: string;
    message: string;
    code: string;
  }>;

  constructor(message: string, zodError: z.ZodError) {
    super(message, zodError.format());
    this.zodError = zodError;

    // Formata erros do Zod para estrutura mais amigável
    this.errors = zodError.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
      code: err.code,
    }));
  }

  /**
   * Factory method para criar ValidationError a partir de ZodError
   */
  static fromZodError(error: z.ZodError, customMessage?: string): ValidationError {
    const message = customMessage || "Dados inválidos";
    return new ValidationError(message, error);
  }

  /**
   * Retorna mensagem de erro formatada
   */
  getFormattedMessage(): string {
    const errorList = this.errors.map((err) => `  - ${err.path}: ${err.message}`).join("\n");
    return `${this.message}:\n${errorList}`;
  }

  /**
   * Override toJSON para incluir erros formatados
   */
  override toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}
