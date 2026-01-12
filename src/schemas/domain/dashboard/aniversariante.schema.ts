import { z } from "zod";

/**
 * Schema para aniversariante (contato)
 */
export const aniversarianteContatoSchema = z.object({
  for_cfn: z.string(),
  cod_cfn: z.string(),
  nom_cfn: z.string(),
  dep_cfn: z.string(),
  fornecedor: z.string(),
  fanta: z.string(),
  cidade: z.string(),
  data_nasc: z.string(),
});

export type AniversarianteContato = z.infer<typeof aniversarianteContatoSchema>;

/**
 * Schema para aniversariante (fornecedor)
 */
export const aniversarianteFornecedorSchema = z.object({
  fornecedor: z.string(),
  fanta: z.string(),
  status: z.string(),
  cidade: z.string(),
  dat_nasc: z.string(),
  codfor: z.string(),
});

export type AniversarianteFornecedor = z.infer<typeof aniversarianteFornecedorSchema>;
