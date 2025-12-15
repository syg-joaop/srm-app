import type { LoginCredentials } from '@/types/auth'
import { useAuthStore } from '../stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()

  const login = async (credentials: LoginCredentials) => {
    const result = await authStore.login(credentials)
    if (result.success) await navigateTo('/')
    return result
  }

  const logout = async () => {
    await authStore.logout()
  }

  const checkAuth = async () => {
    return await authStore.initAuth()
  }

  return {
    // State
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    userEmail: computed(() => authStore.userEmail),
    userName: computed(() => authStore.userName),
    loading: computed(() => authStore.loading),
    error: computed(() => authStore.error),

    // Actions
    login,
    logout,
    checkAuth
  }
}
