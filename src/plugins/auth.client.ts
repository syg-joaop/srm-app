/**
 * Plugin de Inicialização de Autenticação (Client-Side Only)
 *
 * Este plugin executa quando o app carrega (apenas no client-side)
 * e carrega os dados do usuário persistidos no localStorage.
 *
 * Garante que o estado de autenticação esteja pronto antes que
 * o middleware de rotas seja executado.
 */

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  // Inicializa autenticação validando cookie HttpOnly
  // Se cookie válido: authStore.user será populado
  // Se cookie inválido: authStore.user será null
  await authStore.initAuth()
})
