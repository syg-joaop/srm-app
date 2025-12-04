import { z } from 'zod'

// Schema para credenciais de login
export const loginCredentialsSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
  origem: z.string().optional().default('web'),
  homol: z.boolean().optional().default(false),
  remember: z.boolean().optional(),
  terms: z.boolean().optional(),
  remember_colaborador: z.boolean().optional(),
  colaborador: z.string().optional(),
  password_colaborador: z.string().optional()
}).passthrough() // Permite campos adicionais

// Schema para usuário
export const userSchema = z.object({
  token: z.string(),
  email: z.string().email(),
  usuario: z.string()
}).passthrough() // Permite campos adicionais

// Schema para resposta de login
export const loginResponseSchema = z.object({
  user: z.array(userSchema)
}).passthrough()

// Schema para resposta de logout
export const logoutResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional()
})

// Types derivados dos schemas
export type LoginCredentials = z.infer<typeof loginCredentialsSchema>
export type User = z.infer<typeof userSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>
export type LogoutResponse = z.infer<typeof logoutResponseSchema>
