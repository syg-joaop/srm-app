/**
 * Sistema de logging centralizado para a aplicação SRM
 *
 * Características:
 * - Prefixo consistente [SRM] para facilitar debugging
 * - Logs de debug apenas em modo DEV
 * - Preparado para futura integração com serviços externos (Sentry, etc.)
 */

const LOG_PREFIX = '[SRM]';

export const logger = {
  /**
   * Log informativo - apenas em DEV
   */
  info: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.log(LOG_PREFIX, '[INFO]', ...args);
    }
  },

  /**
   * Log de aviso - sempre visível
   */
  warn: (...args: unknown[]) => {
    console.warn(LOG_PREFIX, '[WARN]', ...args);
  },

  /**
   * Log de erro - sempre visível
   */
  error: (...args: unknown[]) => {
    console.error(LOG_PREFIX, '[ERROR]', ...args);
  },

  /**
   * Log de debug - apenas em DEV
   */
  debug: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.log(LOG_PREFIX, '[DEBUG]', ...args);
    }
  },
};
