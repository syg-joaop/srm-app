import { defineStore } from "pinia";
import type { User, LoginCredentials } from "@/types/auth";

const STORAGE_KEY = "srm_auth_user";

export const useAuthStore = defineStore("auth", () => {
  // Estado
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initialized = ref(false);

  // Propriedades computadas
  const isAuthenticated = computed(() => user.value !== null);
  const userEmail = computed(() => user.value?.email ?? "");
  const userName = computed(() => user.value?.usuario ?? "");
  const userRole = computed(() => user.value?.role ?? "user");

  // Salvar usuário no localStorage
  function saveUserToStorage(userData: User) {
    if (!import.meta.client) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      console.log("Usuário salvo no localStorage");
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
    }
  }

  // Carregar usuário do localStorage
  function loadUserFromStorage(): User | null {
    if (!import.meta.client) return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const userData = JSON.parse(stored);
      console.log("Usuário carregado do localStorage");
      return userData;
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
      return null;
    }
  }

  // Remover usuário do localStorage
  function removeUserFromStorage() {
    if (!import.meta.client) return;

    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log("Usuário removido do localStorage");
    } catch (err) {
      console.error("Erro ao remover usuário:", err);
    }
  }

  // Inicializar autenticação (carrega dados salvos)
  async function initAuth(): Promise<boolean> {
    // Já foi inicializado
    if (initialized.value) {
      return isAuthenticated.value;
    }

    // Tenta carregar usuário salvo
    const savedUser = loadUserFromStorage();

    if (savedUser) {
      user.value = savedUser;
      initialized.value = true;
      return true;
    }

    // Sem usuário salvo
    user.value = null;
    initialized.value = true;
    return false;
  }

  // Fazer login
  async function login(credentials: LoginCredentials) {
    loading.value = true;
    error.value = null;

    try {
      // Preparar dados para enviar
      const requestBody = {
        email: credentials.email,
        password: credentials.password,
        origem: credentials.origem ?? "SRM",
        remember: credentials.remember,
        terms: credentials.terms,
        colaborador: credentials.colaborador,
        password_colaborador: credentials.password_colaborador,
        remember_colaborador: credentials.remember_colaborador,
      };

      // Chamar API
      const apiLogin = useAuthApi();
      const response = await apiLogin<{ user: User[] }>("/login", {
        method: "POST",
        body: requestBody,
        headers: {
          "x-secret": "ZThiMGYzZjhkNGNjNjhmMmViY2Q1NjgwY2FlMGM0ZTU=",
        },
      });

      // Verificar se login foi bem sucedido
      if (!response.user || response.user.length === 0) {
        error.value = "Credenciais inválidas";
        return { success: false, error: error.value };
      }

      // Salvar usuário
      const loggedUser = response.user[0];
      user.value = loggedUser;
      saveUserToStorage(loggedUser);

      // Salvar credenciais se "lembrar-me" estiver marcado (qualquer um dos dois)
      if (credentials.remember || credentials.remember_colaborador) {
        const { persistCredentials } = useAuthPersistence();
        persistCredentials(credentials);
      }

      return { success: true, data: response };
    } catch (err: any) {
      const errorMessage =
        err.data?.message ?? err.message ?? "Erro ao fazer login";
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  }

  // Fazer logout
  async function logout() {
    // Limpar dados
    user.value = null;
    error.value = null;
    initialized.value = false;

    // Remover do storage
    removeUserFromStorage();

    // Redirecionar para login
    await navigateTo("/login");
  }

  // Limpar mensagem de erro
  function clearError() {
    error.value = null;
  }

  // Expor estado e métodos
  return {
    // Estado (somente leitura)
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    initialized: readonly(initialized),

    // Propriedades computadas
    isAuthenticated,
    userEmail,
    userName,
    userRole,

    // Métodos
    initAuth,
    login,
    logout,
    clearError,
  };
});
