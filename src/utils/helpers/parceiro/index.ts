/**
 * Helpers para processamento de dados de parceiros.
 * VERSÃO REFACTORADA - Decomposta em múltiplos módulos coesos.
 *
 * Este arquivo re-exporta todas as funções e constantes dos submódulos
 * para manter backward compatibility total com imports existentes.
 */

// Re-export de configurações e constantes
export * from "./config";

// Re-export de funções de normalização
export * from "./normalizers";

// Re-export de funções de construção
export * from "./builders";

// Re-export de funções utilitárias
export * from "./utils";
