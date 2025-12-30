/**
 * Composable para gerenciar estado de loading e error em modais.
 * Reutilizável para qualquer modal que precisa carregar dados.
 */

export const useParceiroModalData = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Carrega dados com tratamento de erro.
   * @param loadFn - Função assíncrona para carregar dados
   */
  const loadData = async (loadFn: () => Promise<void>) => {
    isLoading.value = true;
    error.value = null;

    try {
      await loadFn();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar dados';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Reseta o estado para valores iniciais.
   */
  const reset = () => {
    isLoading.value = false;
    error.value = null;
  };

  return {
    isLoading,
    error,
    loadData,
    reset,
  };
};
