/**
 * Middleware Global de Autenticação
 *
 * Protege rotas e redireciona baseado no estado da auth store.
 *
 * IMPORTANTE:
 * - A store usa localStorage para persistir dados do usuário (SPA mode)
 * - A store é inicializada via plugin (auth.client.ts) que carrega dados do localStorage
 * - Apenas verifica authStore.isAuthenticated
 * - Token de autenticação é gerenciado via cookie HttpOnly pelo servidor
 *
 * Fluxo:
 * 1. Plugin executa no app load → authStore.initAuth() → carrega dados do localStorage
 * 2. Middleware executa em cada navegação → verifica authStore.initialized
 * 3. Se initialized, usa authStore.isAuthenticated para decidir
 * 4. Redireciona conforme necessário
 */

export default defineNuxtRouteMiddleware(async (to) => {
  // ==================== CONFIGURAÇÃO ====================

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ['/login']
  const isPublicRoute = publicRoutes.includes(to.path)

  // ==================== SSR CHECK ====================

  // Apenas executar no client-side (projeto tem ssr: false)
  if (!import.meta.client) {
    return
  }

  // ==================== VALIDAÇÃO DE AUTH ====================

  const authStore = useAuthStore()

  // Aguarda inicialização da auth store (caso plugin ainda não tenha terminado)
  if (!authStore.initialized) {
    await authStore.initAuth()
  }

  // ==================== LÓGICA DE REDIRECIONAMENTO ====================

  // Usuário autenticado tentando acessar /login → redirecionar para home
  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }

  // Usuário NÃO autenticado tentando acessar rota protegida → redirecionar para login
  if (!authStore.isAuthenticated && !isPublicRoute) {
    return navigateTo('/login')
  }

  // Permitir navegação
})
