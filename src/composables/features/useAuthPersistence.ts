/**
 * Composable useAuthPersistence - Persistência de Credenciais para "Lembrar-me"
 *
 * PROPÓSITO: Salvar credenciais no localStorage para AUTOFILL de formulário APENAS.
 * NÃO é usado para gerenciar sessão (isso é feito via cookie HttpOnly).
 *
 * SEGURANÇA:
 * - Senhas são codificadas em base64 (NÃO é criptografia, apenas obfuscação)
 * - Aceitável apenas porque:
 *   1. É para conveniência, não segurança
 *   2. Usuário opta explicitamente via checkbox "Lembrar-me"
 *   3. É como o comportamento de password managers do navegador
 *
 * IMPORTANTE:
 * - localStorage é client-side e NÃO deve ser usado para gerenciar sessão
 * - Sessão é gerenciada via cookie HttpOnly no servidor
 */

import type { SavedCredentials } from '@/types/auth'

export const useAuthPersistence = () => {
  // ==================== CONFIGURAÇÃO ====================

  const STORAGE_KEYS = {
    email: 'srm_saved_email',
    password: 'srm_saved_password',
    sygecomUser: 'srm_saved_sygecom_user',
    sygecomPassword: 'srm_saved_sygecom_password'
  } as const

  // ==================== HELPERS ====================

  /**
   * Codifica string em base64
   */
  const encode = (str: string): string => btoa(str)

  /**
   * Decodifica string de base64
   */
  const decode = (str: string): string => {
    try {
      return atob(str)
    } catch {
      return ''
    }
  }

  /**
   * Salva ou remove item do localStorage condicionalmente
   */
  const setOrRemove = (
    key: string,
    value: string | undefined | null,
    condition: boolean = true
  ): void => {
    if (!import.meta.client) return

    if (condition && value) {
      localStorage.setItem(key, value)
    } else {
      localStorage.removeItem(key)
    }
  }

  // ==================== FUNÇÕES PÚBLICAS ====================

  /**
   * Persiste credenciais no localStorage para autofill
   *
   * @param credentials - Credenciais a serem salvas
   */
  const persistCredentials = (credentials: SavedCredentials): void => {
    if (!import.meta.client) return

    setOrRemove(STORAGE_KEYS.email, credentials.email, credentials.remember)
    setOrRemove(
      STORAGE_KEYS.password,
      credentials.password ? encode(credentials.password) : undefined,
      credentials.remember
    )

    const saveSygecom = Boolean(credentials.remember_colaborador && credentials.colaborador)
    setOrRemove(STORAGE_KEYS.sygecomUser, credentials.colaborador, saveSygecom)
    setOrRemove(
      STORAGE_KEYS.sygecomPassword,
      credentials.password_colaborador ? encode(credentials.password_colaborador) : undefined,
      saveSygecom
    )
  }

  /**
   * Carrega credenciais salvas do localStorage
   *
   * @returns Credenciais salvas ou objeto vazio
   */
  const loadSavedCredentials = (): SavedCredentials => {
    if (!import.meta.client) return {}

    const result: SavedCredentials = {}

    const email = localStorage.getItem(STORAGE_KEYS.email)
    const passwordEncoded = localStorage.getItem(STORAGE_KEYS.password)

    if (email) {
      result.email = email
      result.remember = true
      if (passwordEncoded) {
        result.password = decode(passwordEncoded)
      }
    }

    const sygecomUser = localStorage.getItem(STORAGE_KEYS.sygecomUser)
    const sygecomPasswordEncoded = localStorage.getItem(STORAGE_KEYS.sygecomPassword)

    if (sygecomUser) {
      result.colaborador = sygecomUser
      result.remember_colaborador = true
      if (sygecomPasswordEncoded) {
        result.password_colaborador = decode(sygecomPasswordEncoded)
      }
    }

    return result
  }

  /**
   * Limpa todas as credenciais salvas do localStorage
   */
  const clearSavedCredentials = (): void => {
    if (!import.meta.client) return

    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }

  // ==================== RETURN ====================

  return {
    persistCredentials,
    loadSavedCredentials,
    clearSavedCredentials
  }
}
