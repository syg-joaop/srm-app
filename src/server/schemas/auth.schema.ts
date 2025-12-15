import { z } from "zod";

export const loginCredentialsSchema = z
  .object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
    origem: z.string().optional().default("web"),
    homol: z.boolean().optional().default(false),
    remember: z.boolean().optional(),
    terms: z.boolean().optional(),
    remember_colaborador: z.boolean().optional(),
    colaborador: z.string().optional(),
    password_colaborador: z.string().optional(),
  })
  .passthrough();

export const userSchema = z
  .object({
    token: z.string(),
    email: z.string().email(),
    usuario: z.string(),
  })
  .passthrough();

export const loginResponseSchema = z
  .object({
    user: z.array(userSchema),
  })
  .passthrough();

export const logoutResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
export type User = z.infer<typeof userSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
