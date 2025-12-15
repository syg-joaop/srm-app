import { defineStore } from "pinia";
import type { LoginCredentials, Parametros, Permissao, User } from "@/types/auth";

const STORAGE_KEY = "srm_auth_user";

type LoginResult =
  | { success: true; data: { user: User[] } }
  | { success: false; error: string };

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initialized = ref(false);

  const isAuthenticated = computed(() => Boolean(user.value));
  const userEmail = computed(() => user.value?.email ?? "");
  const userName = computed(() => user.value?.usuario ?? "");
  const userRole = computed(() => user.value?.role ?? "user");
  const userPermissoes = computed<Permissao[]>(
    () => (user.value?.permissoes as Permissao[]) ?? []
  );
  const userParametros = computed<Partial<Parametros>>(
    () => (user.value?.parametros as Partial<Parametros>) ?? {}
  );

  const saveUserToStorage = (userData: User) => {
    if (!import.meta.client) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const loadUserFromStorage = (): User | null => {
    if (!import.meta.client) return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  };

  const removeUserFromStorage = () => {
    if (!import.meta.client) return;
    localStorage.removeItem(STORAGE_KEY);
  };

  const checkSession = async (): Promise<boolean> => {
    if (!import.meta.client) return isAuthenticated.value;
    try {
      await $fetch("/api/session", { credentials: "include" });
      return true;
    } catch {
      return false;
    }
  };

  const initAuth = async (): Promise<boolean> => {
    if (initialized.value) return isAuthenticated.value;

    const savedUser = loadUserFromStorage();
    if (savedUser) {
      user.value = savedUser;
    }

    initialized.value = true;

    if (!user.value) return false;

    const sessionOk = await checkSession();
    if (!sessionOk) {
      user.value = null;
      removeUserFromStorage();
      return false;
    }

    return true;
  };

  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    loading.value = true;
    error.value = null;

    try {
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

      const api = useAuthApi();
      const response = await api<{ user: User[] }>("/login", {
        method: "POST",
        body: requestBody,
      });

      const loggedUser = response.user?.[0];
      if (!loggedUser) {
        error.value = "Credenciais inválidas";
        return { success: false, error: error.value };
      }

      const { token: _token, ...safeUser } = loggedUser as any;
      const storedUser = safeUser as User;
      user.value = storedUser;
      initialized.value = true;
      saveUserToStorage(storedUser);

      if (credentials.remember || credentials.remember_colaborador) {
        useAuthPersistence().persistCredentials(credentials);
      }

      return { success: true, data: { user: [storedUser] } };
    } catch (err: any) {
      const errorMessage =
        err.data?.message ?? err.message ?? "Erro ao fazer login";
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await $fetch("/api/logout", { method: "POST", credentials: "include" });
    } catch {
    } finally {
      user.value = null;
      error.value = null;
      initialized.value = false;
      removeUserFromStorage();
      await navigateTo("/login");
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    initialized: readonly(initialized),

    isAuthenticated,
    userEmail,
    userName,
    userRole,
    userPermissoes,
    userParametros,

    initAuth,
    login,
    logout,
    clearError,
  };
});
