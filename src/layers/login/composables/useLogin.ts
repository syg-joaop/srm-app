import { useAuthStore } from "~/stores/auth";
import { AuthStorage } from "~/utils/storage/AuthStorage";

import { loginCredentialsSchema } from "../schemas/login.schemas";

import type { z } from "zod";

export const useLogin = () => {
  const authStore = useAuthStore();

  const login = async (credentials: z.infer<typeof loginCredentialsSchema>) => {
    const result = await authStore.login(credentials);

    if (result.success) {
      AuthStorage.save({
        email: credentials.email,
        password: credentials.password,
        remember: credentials.remember,
        remember_colaborador: credentials.remember_colaborador,
        colaborador: credentials.colaborador,
        password_colaborador: credentials.password_colaborador,
      });
    }

    return result;
  };

  return { login };
};
