import type { HttpRequest, HttpResponse } from "~/shared/schemas";

/**
 * Tipo do interceptor HTTP
 */
export type HttpInterceptor = (
  request: HttpRequest,
  response: HttpResponse | undefined,
  requestId?: string,
) => Promise<void> | void;

/**
 * Plugin de interceptor HTTP (client-only)
 *
 * Permite configurar interceptação de requisições HTTP de forma segura para SSR.
 * Usa provide/inject ao invés de useState para evitar vazamento de estado.
 */
export default defineNuxtPlugin(() => {
  // Ref local (não compartilhado entre requisições)
  const interceptor = ref<HttpInterceptor | null>(null);

  /**
   * Define o interceptor a ser executado
   */
  const setInterceptor = (fn: HttpInterceptor) => {
    interceptor.value = fn;
  };

  /**
   * Remove o interceptor
   */
  const clearInterceptor = () => {
    interceptor.value = null;
  };

  /**
   * Executa o interceptor se estiver definido
   */
  const executeInterceptor = async (
    request: HttpRequest,
    response?: HttpResponse,
    requestId?: string,
  ) => {
    if (interceptor.value) {
      try {
        await interceptor.value(request, response, requestId);
      } catch (error) {
        // Log do erro mas não propaga (interceptor não deve quebrar requisição)
        console.error("[HTTP Interceptor] Erro ao executar interceptor:", error);
      }
    }
  };

  /**
   * Verifica se há interceptor configurado
   */
  const hasInterceptor = computed(() => interceptor.value !== null);

  return {
    provide: {
      httpInterceptor: {
        set: setInterceptor,
        clear: clearInterceptor,
        execute: executeInterceptor,
        has: hasInterceptor,
      },
    },
  };
});
