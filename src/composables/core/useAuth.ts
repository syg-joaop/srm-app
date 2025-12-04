/**
 * Composable useAuth - Facade para Auth Store
 *
 * Fornece API conveniente para autenticação em componentes.
 * Encapsula lógica adicional (ex: navegação após login).
 *
 * Uso nos componentes:
 * ```ts
 * const { user, isAuthenticated, login, logout } = useAuth()
 * ```
 */

import type { LoginCredentials } from '@/types/auth'

export const useAuth = () => {
  const authStore = useAuthStore()

  /**
   * Login com credenciais
   * Redireciona automaticamente para home após sucesso
   */
  const login = async (credentials: LoginCredentials) => {
    const result = await authStore.login(credentials)

    if (result.success) {
      // Redireciona para home após login bem-sucedido
      await navigateTo('/')
    }

    return result
  }

  /**
   * Logout
   * Redireciona para login (já feito na action da store)
   */
  const logout = async () => {
    await authStore.logout()
  }

  /**
   * Inicializa autenticação
   * Geralmente chamado pelo plugin, mas exposto para casos especiais
   */
  const initAuth = async () => {
    return await authStore.initAuth()
  }

  // ==================== RETURN ====================

  return {
    // State (computed refs para reatividade)
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    userEmail: computed(() => authStore.userEmail),
    userName: computed(() => authStore.userName),
    userRole: computed(() => authStore.userRole),
    loading: computed(() => authStore.loading),
    error: computed(() => authStore.error),
    initialized: computed(() => authStore.initialized),

    // Actions
    login,
    logout,
    initAuth,
    clearError: authStore.clearError
  }
}
