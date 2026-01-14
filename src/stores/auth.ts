import { defineStore } from "pinia";

import { handleError, useApi } from "~/composables/http/useApi";

import {
  authResponseSchema,
  loginCredentialsSchema,
  type LoginCredentials,
  type Parametros,
  type Permissao,
  type Usuario,
} from "~/layers/login/schemas/login.schemas";

const STORAGE_KEY = "srm_auth_user";
const DEFAULT_ORIGEM = "SRM";

type LoginResult = { success: true; data: { user: Usuario[] } } | { success: false; error: string };

const isClient = () => import.meta.client;

const readStoredUsuario = (): Usuario | null => {
  if (!isClient()) return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as Usuario;
  } catch {
    return null;
  }
};

const writeStoredUsuario = (userData: Usuario) => {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
};

const clearStoredUsuario = () => {
  if (!isClient()) return;
  localStorage.removeItem(STORAGE_KEY);
};

const buildLoginPayload = (credentials: LoginCredentials) => {
  const payload: Record<string, unknown> = {
    email: credentials.email,
    password: credentials.password,
    origem: credentials.origem ?? DEFAULT_ORIGEM,
    homol: false,
  };

  if (credentials.colaborador) payload.colaborador = credentials.colaborador;
  if (credentials.password_colaborador) {
    payload.password_colaborador = credentials.password_colaborador;
  }

  return payload;
};

export const useAuthStore = defineStore("auth", () => {
  const user = ref<Usuario | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initialized = ref(false);

  const isAuthenticated = computed(() => Boolean(user.value?.token));
  const userEmail = computed(() => user.value?.email ?? "");
  const userName = computed(() => user.value?.usuario ?? "");
  const userPermissoes = computed<Permissao[]>(() => (user.value?.permissoes as Permissao[]) ?? []);
  const userParametros = computed<Partial<Parametros>>(
    () => (user.value?.parametros as Partial<Parametros>) ?? {},
  );

  const clearSession = () => {
    user.value = null;
    error.value = null;
    initialized.value = false;
    clearStoredUsuario();
  };

  const initAuth = async (): Promise<boolean> => {
    if (initialized.value) return isAuthenticated.value;

    const savedUsuario = readStoredUsuario();
    if (savedUsuario) {
      user.value = savedUsuario;
    }

    initialized.value = true;

    if (!user.value) return false;
    if (!isAuthenticated.value) {
      clearSession();
      return false;
    }

    return true;
  };

  const logout = async () => {
    clearSession();
    await navigateTo("/login");
  };

  const clearError = () => {
    error.value = null;
  };

  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    loading.value = true;
    error.value = null;

    try {
      const api = useApi("login");
      const response = await api.postValidated(
        "/login",
        loginCredentialsSchema,
        authResponseSchema,
        buildLoginPayload(credentials),
      );

      const loggedUsuario = response.user?.[0];

      if (!loggedUsuario) {
        error.value = "Credenciais inválidas";
        return { success: false, error: error.value };
      }

      user.value = loggedUsuario;
      writeStoredUsuario(loggedUsuario);

      return { success: true, data: { user: [loggedUsuario] } };
    } catch (err) {
      throw handleError(err, "/login", "POST");
    } finally {
      loading.value = false;
    }
  };

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    initialized: readonly(initialized),

    isAuthenticated,
    userEmail,
    userName,
    userPermissoes,
    userParametros,

    initAuth,
    login,
    logout,
    clearError,
  };
});
