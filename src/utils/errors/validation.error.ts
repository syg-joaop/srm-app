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
    expected?: string;
    received?: string;
  }>;

  constructor(message: string, zodError: z.ZodError) {
    super(message, zodError);
    this.zodError = zodError;

    this.errors = Array.isArray(zodError.issues)
      ? zodError.issues.map((err) => ({
          path: Array.isArray(err.path) ? err.path.join(".") : String(err.path || ""),
          message: err.message || "Erro de validação",
          code: err.code || "invalid",
          expected: "expected" in err ? String(err.expected) : undefined,
          received: "received" in err ? String(err.received) : undefined,
        }))
      : [];

    // Log detalhado do erro no console para debug
    console.error("[ValidationError] Detalhes do erro Zod:", {
      message: this.message,
      errors: this.errors,
      rawIssues: zodError.issues,
    });
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
    const errorList = this.errors
      .map((err) => {
        let detail = `  - ${err.path || "(root)"}: ${err.message}`;
        if (err.expected || err.received) {
          detail += ` (esperado: ${err.expected ?? "?"}, recebido: ${err.received ?? "?"})`;
        }
        return detail;
      })
      .join("\n");
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
