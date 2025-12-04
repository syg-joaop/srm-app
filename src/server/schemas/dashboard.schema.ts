import { z } from 'zod'

export const statItemSchema = z.object({
  icon: z.string(),
  value: z.string(),
  label: z.string(),
  color: z.string().optional()
})

export const summaryItemSchema = z.object({
  label: z.string(),
  value: z.string()
})

export const compradorItemSchema = z.object({
  name: z.string(),
  current: z.string(),
  previous: z.string()
})

export const productItemSchema = z.object({
  name: z.string(),
  current: z.string(),
  previous: z.string()
})

export const birthdayItemSchema = z.object({
  date: z.string(),
  name: z.string(),
  location: z.string(),
  status: z.string()
})

export const attendantItemSchema = z.object({
  role: z.string(),
  s1: z.number(),
  s2: z.number(),
  s3: z.number(),
  s4: z.number()
})

export const chartDataSchema = z.object({
  ocorrenciasPie: z.array(z.object({
    value: z.number(),
    name: z.string(),
    itemStyle: z.object({
      color: z.string()
    })
  })),
  ocorrenciasLine: z.object({
    months: z.array(z.string()),
    values: z.array(z.number())
  }),
  metaDiaria: z.object({
    days: z.array(z.string()),
    values: z.array(z.number())
  }),
  descontos: z.object({
    months: z.array(z.string()),
    values: z.array(z.number())
  })
})

export const dashboardDataSchema = z.object({
  stats: z.array(statItemSchema),
  comprasMes: z.array(summaryItemSchema),
  comprasMesAnterior: z.array(summaryItemSchema),
  compradorItems: z.array(compradorItemSchema),
  produtosItems: z.array(productItemSchema),
  aniversariantesItems: z.array(birthdayItemSchema),
  atendentesItems: z.array(attendantItemSchema),
  chartData: chartDataSchema
})

export const apiIndicadorSchema = z.object({
  count: z.string(),
  tipo: z.string()
})

export const apiCompraSchema = z.object({
  total: z.string(),
  liquido: z.string(),
  preco_medio: z.string(),
  desconto: z.string(),
  media_diaria: z.string(),
  preco_sem_icms: z.string(),
  icms: z.string(),
  totaldiasuteis: z.string(),
  totalsabados: z.string()
})

export const apiCompradorSchema = z.object({
  nome: z.string().nullable(),
  atual: z.string(),
  ant: z.string()
})

export const apiProdutoSchema = z.object({
  produto: z.string().nullable(),
  mes_atual: z.string(),
  mes_anterior: z.string()
})

export const apiAniversarianteSchema = z.object({
  fornecedor: z.string(),
  cidade: z.string(),
  uf: z.string(),
  dat_nasc: z.string(),
  status: z.string()
})

export const apiAtendenteSchema = z.object({
  setor: z.string(),
  atendimento_ok: z.string(),
  atendimento_acompanhamento: z.string(),
  atendimento_pendente: z.string(),
  atendimento_vencido: z.string()
})

export const apiOcorrencia12MesesSchema = z.object({
  atendimento_ok: z.number(),
  atendimento_acompanhamento: z.number(),
  atendimento_pendente: z.number(),
  atendimento_vencido: z.number()
})

export const apiOcorrencia6MesesSchema = z.object({
  count: z.number(),
  mes_ano: z.string()
})

export const apiMetaDiariaSchema = z.object({
  sum: z.string()
})

export const apiDescontoSchema = z.object({
  desconto: z.number()
})

export const dashboardApiResponseSchema = z.object({
  indicadoresDashboard: z.object({ data: z.array(apiIndicadorSchema) }),
  comprasMes: z.object({ data: z.array(apiCompraSchema) }),
  comprasComprador: z.object({ data: z.array(apiCompradorSchema) }),
  prodsMaisCompradosMes: z.object({ data: z.array(apiProdutoSchema) }),
  aniversariantesFornecedores: z.object({ data: z.array(apiAniversarianteSchema) }),
  atendentes: z.object({ data: z.array(apiAtendenteSchema) }),
  ocorrencias12Meses: z.object({ data: z.array(apiOcorrencia12MesesSchema) }),
  ocorrencias6Meses: z.object({ data: z.array(apiOcorrencia6MesesSchema) }),
  metaDiaria: z.object({ data: z.array(apiMetaDiariaSchema) }),
  totalDescontos: z.object({ data: z.array(apiDescontoSchema) })
})

export type DashboardData = z.infer<typeof dashboardDataSchema>
export type DashboardApiResponse = z.infer<typeof dashboardApiResponseSchema>
export type StatItem = z.infer<typeof statItemSchema>
export type SummaryItem = z.infer<typeof summaryItemSchema>
export type CompradorItem = z.infer<typeof compradorItemSchema>
export type ProductItem = z.infer<typeof productItemSchema>
export type BirthdayItem = z.infer<typeof birthdayItemSchema>
export type AttendantItem = z.infer<typeof attendantItemSchema>
export type ChartData = z.infer<typeof chartDataSchema>
