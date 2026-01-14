import type { LoginCredentials } from "~/layers/login/schemas/login.schemas";

/**
 * Classe para persistência de credenciais do "lembrar-me" do login.
 */

const KEYS = {
  email: "srm_saved_email",
  password: "srm_saved_password",
  sygecomUser: "srm_saved_sygecom_user",
  sygecomPassword: "srm_saved_sygecom_password",
} as const;

const encode = (str: string): string => btoa(str);

const decode = (str: string): string => {
  try {
    return atob(str);
  } catch {
    return "";
  }
};

const setItem = (key: string, value: string | null | undefined, condition = true) => {
  if (!import.meta.client) return;

  if (condition && value) {
    localStorage.setItem(key, value);
  } else {
    localStorage.removeItem(key);
  }
};

export class AuthStorage {
  static save(credentials: Partial<LoginCredentials>): void {
    if (!import.meta.client) return;

    setItem(KEYS.email, credentials.email, credentials.remember);
    setItem(
      KEYS.password,
      credentials.password ? encode(credentials.password) : undefined,
      credentials.remember,
    );

    const saveSygecom = Boolean(credentials.remember_colaborador && credentials.colaborador);
    setItem(KEYS.sygecomUser, credentials.colaborador, saveSygecom);
    setItem(
      KEYS.sygecomPassword,
      credentials.password_colaborador ? encode(credentials.password_colaborador) : undefined,
      saveSygecom,
    );
  }

  static load(): Partial<LoginCredentials> {
    if (!import.meta.client) return {};

    const result: Partial<LoginCredentials> = {};
    const email = localStorage.getItem(KEYS.email);
    const passwordEncoded = localStorage.getItem(KEYS.password);

    if (email) {
      result.email = email;
      result.remember = true;
      if (passwordEncoded) {
        result.password = decode(passwordEncoded);
      }
    }

    const sygecomUser = localStorage.getItem(KEYS.sygecomUser);
    const sygecomPasswordEncoded = localStorage.getItem(KEYS.sygecomPassword);

    if (sygecomUser) {
      result.colaborador = sygecomUser;
      result.remember_colaborador = true;
      if (sygecomPasswordEncoded) {
        result.password_colaborador = decode(sygecomPasswordEncoded);
      }
    }

    return result;
  }

  static clear(): void {
    if (!import.meta.client) return;
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
  }
}
