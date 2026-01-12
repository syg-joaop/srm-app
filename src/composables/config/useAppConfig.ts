import { ambienteSchema } from "~/schemas/shared/config";

import type { Ambiente } from "~/schemas/shared/config";

/**
 * Composable para acessar configuração da aplicação
 *
 * Fornece acesso centralizado às configurações de ambiente e URLs da API.
 * Valida configurações em runtime usando Zod.
 *
 * @example
 * ```ts
 * const { ambiente, getApiUrl, isProd } = useApiConfig()
 *
 * // Obter URL da API no ambiente atual
 * const url = getApiUrl()
 *
 * // Verificar se está em produção
 * if (isProd.value) {
 *   // Lógica de produção
 * }
 * ```
 */
export const useApiConfig = () => {
  const config = useRuntimeConfig();

  /**
   * Ambiente atual (validado)
   */
  const ambiente = computed<Ambiente>(() => {
    try {
      return ambienteSchema.parse(config.public.ambiente);
    } catch {
      // Fallback para HOMO se ambiente inválido
      console.warn("[useApiConfig] Ambiente inválido, usando HOMO como fallback");
      return "HOMO";
    }
  });

  /**
   * Obtém URL da API para o ambiente especificado (ou atual)
   *
   * @param amb - Ambiente específico (opcional, usa ambiente atual se não especificado)
   * @returns URL da API
   */
  const getApiUrl = (amb?: Ambiente): string => {
    const ambienteAtual = amb || ambiente.value;

    // HOMO e DEV usam a URL de homologação
    if (ambienteAtual === "HOMO" || ambienteAtual === "DEV") {
      return (config.public.apiV2UrlHomol as string) || (config.public.apiV2Url as string);
    }

    // PROD usa a URL de produção
    return config.public.apiV2Url as string;
  };

  /**
   * Verifica se está em ambiente de homologação
   */
  const isHomo = computed(() => ambiente.value === "HOMO");

  /**
   * Verifica se está em ambiente de desenvolvimento
   */
  const isDev = computed(() => ambiente.value === "DEV");

  /**
   * Verifica se está em ambiente de produção
   */
  const isProd = computed(() => ambiente.value === "PROD");

  return {
    ambiente,
    getApiUrl,
    isHomo,
    isDev,
    isProd,
  };
};
