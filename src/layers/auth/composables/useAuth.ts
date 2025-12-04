import type { LoginCredentials } from '../types'
import { useUserStore } from '../stores/user'

export const useAuth = () => {
  const userStore = useUserStore()
  const router = useRouter()

  const login = async (credentials: LoginCredentials) => {
    const result = await userStore.login(credentials)

    if (result.success) {
      console.log('Login successful, redirecting to /')
      await navigateTo('/')
    } else {
      console.error('Login failed in composable:', result)
    }

    return result
  }

  const logout = async () => {
    await userStore.logout()
  }

  const checkAuth = async () => {
    return await userStore.fetchCurrentUser()
  }

  return {
    // State
    user: computed(() => userStore.user),
    isAuthenticated: computed(() => userStore.isAuthenticated),
    userEmail: computed(() => userStore.userEmail),
    userName: computed(() => userStore.userName),
    loading: computed(() => userStore.loading),
    error: computed(() => userStore.error),

    // Actions
    login,
    logout,
    checkAuth
  }
}
