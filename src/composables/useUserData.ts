import { useAuthStore } from "~/stores/auth";

import type { Permissao } from "~/layers/login/schemas/login.schemas";

/**
 * Composable dados do usuário logado (permissões e parâmetros).
 *
 */
export const useUserData = () => {
  const authStore = useAuthStore();

  // ============================================================================
  // PERMISSÕES
  // ============================================================================

  const permissoes = computed<Permissao[]>(() => (authStore.user?.permissoes as Permissao[]) ?? []);

  const temPermissao = (alias: string): boolean => {
    const permissao = permissoes.value.find((p) => p.alias === alias);
    return permissao?.acessoPermitido ?? false;
  };

  const temPermissaoPorId = (idfuncao: number): boolean => {
    const permissao = permissoes.value.find((p) => p.idfuncao === idfuncao);
    return permissao?.acessoPermitido ?? false;
  };

  const temTodasPermissoes = (aliases: string[]): boolean => aliases.every(temPermissao);

  const temAlgumaPermissao = (aliases: string[]): boolean => aliases.some(temPermissao);

  // ============================================================================
  // PARÂMETROS
  // ============================================================================

  const parametros = computed<Record<string, unknown>>(() => authStore.user?.parametros ?? {});

  const parametro = (nome: string): unknown => parametros.value[nome];

  const parametroAtivo = (nome: string): boolean => Boolean(parametros.value[nome]);

  const todosParametrosAtivos = (nomes: string[]): boolean => nomes.every(parametroAtivo);

  const algumParametroAtivo = (nomes: string[]): boolean => nomes.some(parametroAtivo);

  return {
    // Permissões
    permissoes,
    temPermissao,
    temPermissaoPorId,
    temTodasPermissoes,
    temAlgumaPermissao,
    // Parâmetros
    parametros,
    parametro,
    parametroAtivo,
    todosParametrosAtivos,
    algumParametroAtivo,
  };
};
