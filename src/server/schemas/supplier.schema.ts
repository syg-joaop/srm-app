import { z } from 'zod'

// Schema para fornecedor
export const supplierSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cnpj: z.string().optional(),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().optional(),
  status: z.string().optional()
}).passthrough() // Permite campos adicionais

// Schema para lista de fornecedores
export const suppliersListSchema = z.object({
  data: z.array(supplierSchema),
  total: z.number().optional(),
  page: z.number().optional(),
  limit: z.number().optional()
})

// Schema para query parameters de busca
export const supplierQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional(),
  status: z.string().optional()
})

// Types exportados
export type Supplier = z.infer<typeof supplierSchema>
export type SuppliersList = z.infer<typeof suppliersListSchema>
export type SupplierQuery = z.infer<typeof supplierQuerySchema>
