/**
 * Classe base para todos os erros da aplicação
 *
 * Extenda esta classe para criar erros customizados específicos.
 */
export abstract class AppError extends Error {
  /**
   * Código único do erro (ex: 'VALIDATION_ERROR', 'HTTP_ERROR')
   */
  abstract readonly code: string;

  /**
   * Status HTTP associado ao erro
   */
  abstract readonly statusCode: number;

  /**
   * Contexto adicional do erro
   */
  public readonly context?: unknown;

  /**
   * Timestamp de quando o erro ocorreu
   */
  public readonly timestamp: Date;

  constructor(message: string, context?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
    this.timestamp = new Date();

    // Mantém stack trace correto
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Serializa o erro para JSON
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }

  /**
   * Retorna representação string do erro
   */
  override toString(): string {
    return `[${this.code}] ${this.message}`;
  }
}
