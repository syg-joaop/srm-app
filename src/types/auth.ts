/**
 * Tipos e Schemas de Autenticação
 * Define estruturas de dados para login, usuário e respostas de API
 */

import { z } from 'zod'

// ==================== PERMISSÕES E PARÂMETROS ====================

/**
 * Interface: Permissão do usuário
 */
export interface Permissao {
  idfuncao: number
  permissao: string
  alias: string
  acessoPermitido: boolean
}

/**
 * Interface: Parâmetros do sistema
 */
export interface Parametros {
  desc_pr2pr3_clifor: boolean
  fretebal: boolean
  hab_preco_nf: boolean
  bloq_difc: boolean
  bloq_pedc: boolean
  tab_serc: boolean
  tab_serc2: boolean
  comp_pesos: boolean
  ocultar_campos_tb_dif: boolean
  mod_pgto_fav: boolean
  hab_servicos_3_0: boolean
  registro_preco_div_por_ende: boolean
  valida_pre_fim_mes: boolean
  entrar_desaprovado_tabdif: boolean
  bloq_comp: boolean
  comp_ini: number
  aceita_conco: boolean
  nao_mostrar_arquivados: boolean
  nao_alt_comp_tabela: boolean
  sen_efrete_bloq_ordem: boolean
  hab_grupo_cont: boolean
  obriga_email_for: boolean
  obriga_categor_forne: boolean
  [key: string]: boolean | number // Permite parâmetros adicionais
}

/**
 * Interface: Empresa do usuário
 */
export interface Empresa {
  cnpj: string
  sistema: string
  nome_empresa: string
  nome_filial: string
  versao: string
}

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
  token: z.string().optional(),
  email: z.string().email(),
  usuario: z.string(),
  role: z.string().optional().default('user'),
  idempresa: z.string().optional(),
  iduser: z.string().optional(),
  setor: z.string().optional(),
  nomefun: z.string().optional(),
  empresa: z.string().optional(),
  empresas: z.array(z.any()).optional(),
  parametros: z.record(z.union([z.boolean(), z.number()])).optional(),
  permissoes: z.array(z.object({
    idfuncao: z.number(),
    permissao: z.string(),
    alias: z.string(),
    acessoPermitido: z.boolean()
  })).optional()
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
