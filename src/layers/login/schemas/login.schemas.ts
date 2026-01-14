import { z } from "zod";

// =============================================================================
// LOGIN CREDENTIALS
// =============================================================================

export const loginCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  origem: z.string().optional().default("SRM"),
  colaborador: z.string().optional(),
  password_colaborador: z.string().optional(),
  remember: z.boolean().optional(),
  terms: z.boolean().optional().default(true),
  remember_colaborador: z.boolean().optional(),
});

// =============================================================================
// EMPRESA
// =============================================================================

export const empresaSchema = z.object({
  cnpj: z.string(),
  sistema: z.string(),
  nome_empresa: z.string(),
  nome_filial: z.string(),
  versao: z.string(),
});

// =============================================================================
// PARÂMETROS
// =============================================================================

export const parametrosSchema = z.record(z.string(), z.unknown());

// =============================================================================
// PERMISSÕES
// =============================================================================

export const permissaoSchema = z.object({
  idfuncao: z.number(),
  permissao: z.string(),
  alias: z.string(),
  acessoPermitido: z.boolean(),
});

// =============================================================================
// COLABORADOR
// =============================================================================

export const colaboradorSchema = z.object({
  nome: z.string(),
  setor: z.string(),
});

// =============================================================================
// USUÁRIO
// =============================================================================

export const usuarioSchema = z.object({
  idempresa: z.string(),
  nome_empresa: z.string(),
  setor: z.string(),
  codcom: z.number(),
  codven: z.number(),
  codcatfor: z.number(),
  regiao: z.number(),
  nomefun: z.string(),
  iduser: z.string(),
  usuario: z.string(),
  email: z.string().email(),
  empresa: z.string(),
  bloqueia: z.string(),
  bloq_portal_cli: z.boolean(),
  empresas: z.array(empresaSchema),
  parametros: parametrosSchema,
  permissoes: z.array(permissaoSchema),
  colaborador: colaboradorSchema,
  token: z.string(),
});

// =============================================================================
// RESPONSE DE AUTENTICAÇÃO
// =============================================================================

export const authResponseSchema = z.object({
  user: z.array(usuarioSchema),
});

// =============================================================================
// TIPOS
// =============================================================================

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
export type Empresa = z.infer<typeof empresaSchema>;
export type Parametros = z.infer<typeof parametrosSchema>;
export type Permissao = z.infer<typeof permissaoSchema>;
export type Colaborador = z.infer<typeof colaboradorSchema>;
export type Usuario = z.infer<typeof usuarioSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
