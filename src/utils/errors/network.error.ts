import { AppError } from "./base.error";

/**
 * Erro de rede/conectividade
 *
 * Lançado quando há problemas de conexão de rede.
 */
export class NetworkError extends AppError {
  readonly code = "NETWORK_ERROR";
  readonly statusCode = 0; // Sem status HTTP (erro de rede)

  /**
   * Indica se o dispositivo está offline
   */
  public readonly isOffline: boolean;

  constructor(message: string, isOffline: boolean = false, context?: unknown) {
    super(message, context);
    this.isOffline = isOffline;
  }

  /**
   * Factory method para erro de dispositivo offline
   */
  static offline(message: string = "Sem conexão com a internet"): NetworkError {
    return new NetworkError(message, true);
  }

  /**
   * Factory method para timeout
   */
  static timeout(message: string = "Tempo de requisição esgotado"): NetworkError {
    return new NetworkError(message, false, { type: "timeout" });
  }

  /**
   * Override toJSON para incluir status offline
   */
  override toJSON() {
    return {
      ...super.toJSON(),
      isOffline: this.isOffline,
    };
  }
}
