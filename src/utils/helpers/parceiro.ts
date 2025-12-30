/**
 * Helpers para processamento de dados de parceiros.
 *
 * BACKWARD COMPATIBILITY LAYER
 *
 * Este arquivo foi refatorado e decomposto em múltiplos módulos coesos
 * localizados no subdiretório './parceiro/'.
 *
 * Todas as exportações públicas foram movidas para:
 * - ./parceiro/config.ts - Constantes e configurações
 * - ./parceiro/normalizers.ts - Funções de formatação/normalização
 * - ./parceiro/builders.ts - Funções de construção de TabItem
 * - ./parceiro/utils.ts - Funções utilitárias diversas
 * - ./parceiro/index.ts - Re-exports consolidados
 *
 * Este arquivo mantém backward compatibility 100% re-exportando tudo
 * do subdiretório. Imports existentes continuarão funcionando sem alterações.
 */

// Re-exporta tudo do subdiretório para manter backward compatibility
export * from "./parceiro";
