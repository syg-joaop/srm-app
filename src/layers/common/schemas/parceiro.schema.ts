import { z } from "zod";

/**
 * Schema base para Parceiro (Fornecedor/Prospecto)
 *
 * Este schema define os campos comuns entre fornecedores e prospectos.
 * Os schemas específicos de cada entidade devem estender este.
 *
 * Campos da API (nomes abreviados do legado):
 * - codfor: Código do parceiro (identificador único)
 * - fanta: Nome fantasia
 * - ende: Endereço completo
 * - comp: Complemento do endereço
 * - uf: Unidade federativa (estado)
 * - tel3: Terceiro telefone de contato
 * - oco2: Campo de observação secundária
 * - tf: Tipo
 * - latlong: Flag indicando se possui coordenadas GPS
 * - ultima_carga: Data da última carga/entrega
 */

// =============================================================================
// SCHEMA BASE
// =============================================================================

export const parceiroBaseSchema = z
  .object({
    codfor: z.union([z.string(), z.number()]).optional(),
    fornecedor: z.string().optional(),
    fanta: z.string().optional(),
    status: z.string().optional(),
    categoria: z.string().optional(),
    tf: z.string().optional(),
    cidade: z.string().optional(),
    uf: z.string().optional(),
    ende: z.string().optional(),
    comp: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    latlong: z.boolean().optional(),
    fone: z.string().optional(),
    celular: z.string().optional(),
    tel3: z.string().optional(),
    email: z.string().optional(),
    data: z.string().optional(),
    ultima_carga: z.string().optional(),
    oco2: z.string().optional(),
  })
  .passthrough();

export const parceiroMapSchema = parceiroBaseSchema.pick({
  fornecedor: true,
  fanta: true,
  status: true,
  cidade: true,
  ultima_carga: true,
  latitude: true,
  longitude: true,
  latlong: true,
});

export const parceiroFiltersSchema = z
  .object({
    search: z.string().optional(),
    fantasia: z.string().optional(),
    cidade: z.string().optional(),
    status: z.string().optional(),
    sortBy: z.string().optional(),
  })
  .passthrough();

// =============================================================================
// TIPOS
// =============================================================================

export type ParceiroBase = z.infer<typeof parceiroBaseSchema>;
export type ParceiroMap = z.infer<typeof parceiroMapSchema>;
export type ParceiroFilters = z.infer<typeof parceiroFiltersSchema>;
