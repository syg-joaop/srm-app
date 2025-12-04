/**
 * Tipos e Schemas de Autenticação
 * Define estruturas de dados para login, usuário e respostas de API
 */

import { z } from 'zod'

// ==================== ZOD SCHEMAS ====================

/**
 * Schema de validação para credenciais de login
 */
export const loginCredentialsSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
  origem: z.string().optional(),
  colaborador: z.string().optional(),
  password_colaborador: z.string().optional(),
  remember: z.boolean().optional(),
  terms: z.boolean().optional(),
  remember_colaborador: z.boolean().optional()
})

/**
 * Schema de validação para objeto de usuário
 */
export const userSchema = z.object({
  token: z.string(),
  email: z.string().email(),
  usuario: z.string(),
  role: z.string().optional().default('user')
}).passthrough() // Permite campos adicionais da API

/**
 * Schema de validação para resposta de login
 */
export const loginResponseSchema = z.object({
  user: z.array(userSchema)
}).passthrough()

/**
 * Schema de validação para resposta de /api/auth/me
 */
export const meResponseSchema = z.object({
  user: userSchema
})

/**
 * Schema de validação para resposta de logout
 */
export const logoutResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional()
})

// ==================== TYPESCRIPT TYPES ====================

/**
 * Tipo: Credenciais de Login
 */
export type LoginCredentials = z.infer<typeof loginCredentialsSchema>

/**
 * Tipo: Usuário autenticado
 */
export type User = z.infer<typeof userSchema>

/**
 * Tipo: Resposta de login da API
 */
export type LoginResponse = z.infer<typeof loginResponseSchema>

/**
 * Tipo: Resposta de /api/auth/me
 */
export type MeResponse = z.infer<typeof meResponseSchema>

/**
 * Tipo: Resposta de logout
 */
export type LogoutResponse = z.infer<typeof logoutResponseSchema>

// ==================== AUTH STATE ====================

/**
 * Interface: Estado de autenticação na store
 */
export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  initialized: boolean
}

// ==================== SAVED CREDENTIALS (LEMBRAR-ME) ====================

/**
 * Interface: Credenciais salvas no localStorage (apenas para autofill)
 * IMPORTANTE: Não usado para gerenciar sessão, apenas conveniência
 */
export interface SavedCredentials {
  email?: string
  password?: string
  remember?: boolean
  colaborador?: string
  password_colaborador?: string
  remember_colaborador?: boolean
}
