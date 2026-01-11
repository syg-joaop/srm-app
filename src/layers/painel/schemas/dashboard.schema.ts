import { z } from "zod";

/**
 * Schemas Zod para validação de respostas da API de Dashboard
 */

// Schema base para respostas da API de dashboard
const dashboardApiResponseSchemaBase = z.object({
  access: z.boolean(),
  message: z.string(),
});

// Schema para DashboardCount
const dashboardCountSchema = z.object({
  count: z.union([z.string(), z.number()]),
  tipo: z.string(),
});

// Schema para DashboardIndicatorResponse
const dashboardIndicatorResponseSchema = dashboardApiResponseSchemaBase.extend({
  data: z.array(dashboardCountSchema),
});

// Schema para Atendente
const atendenteSchema = z.object({
  num: z.coerce.string(),
  codcli: z.coerce.string(),
  codfor: z.coerce.string(),
  nome: z.coerce.string(),
  data_oco: z.coerce.string(),
  atendente: z.coerce.string(),
  tipo_ate: z.coerce.string(),
  situacao: z.coerce.string(),
  status: z.coerce.string(),
  data_pro: z.coerce.string(),
  oco: z.coerce.string(),
  solucao: z.coerce.string(),
  usuario: z.coerce.string(),
  data: z.coerce.string(),
  hora: z.coerce.string(),
  empresa: z.coerce.string(),
  sr_recno: z.coerce.string(),
  hora_oco: z.coerce.string(),
  apelido: z.coerce.string(),
  atendente_enc: z.coerce.string(),
  user_diagnostico: z.coerce.string(),
  latitude: z.coerce.string().optional().nullable(),
  longitude: z.coerce.string().optional().nullable(),
  problema: z.string().nullable().optional(),
});

// Schema para AtendenteResponse
const atendenteResponseSchema = dashboardApiResponseSchemaBase.extend({
  data: z.array(atendenteSchema),
});

// Schema para OccurrenceStat
const occurrenceStatSchema = z.object({
  atendimento_geral: z.union([z.number(), z.string()]),
  atendimento_periodo: z.union([z.number(), z.string()]),
  atendimento_ok: z.union([z.number(), z.string()]),
  atendimento_acompanhamento: z.union([z.number(), z.string()]),
  atendimento_pendente: z.union([z.number(), z.string()]),
  atendimento_vencido: z.union([z.number(), z.string()]),
});

// Schema para OccurrenceHistory
const occurrenceHistorySchema = z.object({
  count: z.coerce.number(),
  data_inicial: z.string(),
  data_final: z.string(),
  mes_ano: z.string(),
  date_part: z.number(),
});

// Schema para SupplierBirthday
const supplierBirthdaySchema = z.object({
  fornecedor: z.string(),
  fanta: z.string().optional(),
  oco2: z.string().optional(),
  celular: z.string().optional(),
  tel3: z.string().optional(),
  data: z.string().optional(),
  fone: z.string().optional(),
  email: z.string().optional(),
  status: z.string().optional(),
  ende: z.string().optional(),
  cidade: z.string(),
  uf: z.string().optional(),
  categoria: z.string().optional(),
  tf: z.string().optional(),
  dat_nasc: z.string().optional(),
  codfor: z.string(),
  dia_nasc: z.union([z.coerce.number(), z.nan()]).optional(),
  dia_atual: z.union([z.coerce.number(), z.nan()]).optional(),
  ultima_carga: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  latlong: z.boolean().optional(),
});

// Schema para StaffPerformance
const staffPerformanceSchema = z.object({
  setor: z.coerce.string(),
  nomefun: z.coerce.string(),
  sr_recno: z.coerce.string(),
  email: z.boolean(),
  iduser: z.coerce.string(),
  codven: z.coerce.string(),
  codcom: z.coerce.string(),
  codcla: z.coerce.string(),
  codcatfor: z.coerce.string(),
  atendimento_geral: z.coerce.string(),
  atendimento_periodo: z.coerce.string(),
  atendimento_ok: z.coerce.string(),
  atendimento_acompanhamento: z.coerce.string(),
  atendimento_pendente: z.coerce.string(),
  atendimento_vencido: z.coerce.string(),
});

// Schema para DailyGoal
const dailyGoalSchema = z.object({
  data: z.string(),
  peso: z.coerce.string(),
});

// Schema para PurchasingStats
const purchasingStatsSchema = z.object({
  total: z.coerce.string(),
  liquido: z.coerce.string(),
  preco_medio: z.coerce.string(),
  desconto: z.coerce.string(),
  media_diaria: z.coerce.string(),
  preco_sem_icms: z.coerce.string(),
  icms: z.coerce.string(),
  totaldiasuteis: z.coerce.string(),
  totalsabados: z.coerce.string(),
});

// Schema para BuyerPerformance
const buyerPerformanceSchema = z.object({
  nome: z.string().nullable(),
  atual: z.coerce.string(),
  ant: z.coerce.string(),
});

// Schema para TopProduct
const topProductSchema = z.object({
  produto: z.string().nullable(),
  mes_atual: z.coerce.string(),
  mes_anterior: z.coerce.string(),
});

// Schema para desconto mensal
const monthlyDiscountSchema = z.object({
  mes: z.string(),
  desconto: z.coerce.number(),
});

/**
 * Schema principal para a resposta da API de Dashboard
 * Valida todos os 37 tipos de gráficos retornados pelo endpoint
 */
export const schemaDashboardApiResponse = z
  .object({
    indicadoresDashboard: dashboardIndicatorResponseSchema,
    indicadoresDashboardSemComprador: dashboardIndicatorResponseSchema,
    proximosAtendimentos: atendenteResponseSchema,
    proximosAtendimentosNaoAdmin: atendenteResponseSchema,
    atendimentosVencidos: atendenteResponseSchema,
    atendimentosVencidosNaoAdmin: atendenteResponseSchema,
    ocorrencias12Meses: dashboardApiResponseSchemaBase.extend({
      data: z.array(occurrenceStatSchema),
    }),
    ocorrencias12MesesNaoAdmin: dashboardApiResponseSchemaBase.extend({
      data: z.array(occurrenceStatSchema),
    }),
    ocorrencias6Meses: dashboardApiResponseSchemaBase.extend({
      data: z.array(occurrenceHistorySchema),
    }),
    ocorrencias6MesesNaoAdmin: dashboardApiResponseSchemaBase.extend({
      data: z.array(occurrenceHistorySchema),
    }),
    aniversariantesFornecedores: dashboardApiResponseSchemaBase.extend({
      data: z.array(supplierBirthdaySchema),
    }),
    aniversariantesContatos: dashboardApiResponseSchemaBase.extend({
      data: z.array(z.any()),
    }),
    atendentes: dashboardApiResponseSchemaBase.extend({
      data: z.array(staffPerformanceSchema),
    }),
    metaDiaria: dashboardApiResponseSchemaBase.extend({
      data: z.array(dailyGoalSchema),
    }),
    comprasMes: dashboardApiResponseSchemaBase.extend({
      data: z.array(purchasingStatsSchema),
    }),
    comprasMesAnterior: dashboardApiResponseSchemaBase.extend({
      data: z.array(purchasingStatsSchema),
    }).optional().nullable(),
    comprasComprador: dashboardApiResponseSchemaBase.extend({
      data: z.array(buyerPerformanceSchema),
    }),
    prodsMaisCompradosMes: dashboardApiResponseSchemaBase.extend({
      data: z.array(topProductSchema),
    }),
    totalDescontos: dashboardApiResponseSchemaBase.extend({
      data: z.array(monthlyDiscountSchema),
    }),
  })
  .passthrough();

export type DashboardCount = z.infer<typeof dashboardCountSchema>;
export type DashboardIndicatorResponse = z.infer<
  typeof dashboardIndicatorResponseSchema
>;
export type Atendente = z.infer<typeof atendenteSchema>;
export type AtendenteResponse = z.infer<typeof atendenteResponseSchema>;
export type OccurrenceStat = z.infer<typeof occurrenceStatSchema>;
export type OccurrenceHistory = z.infer<typeof occurrenceHistorySchema>;
export type SupplierBirthday = z.infer<typeof supplierBirthdaySchema>;
export type StaffPerformance = z.infer<typeof staffPerformanceSchema>;
export type DailyGoal = z.infer<typeof dailyGoalSchema>;
export type PurchasingStats = z.infer<typeof purchasingStatsSchema>;
export type BuyerPerformance = z.infer<typeof buyerPerformanceSchema>;
export type TopProduct = z.infer<typeof topProductSchema>;
export type DashboardApiResponse = z.infer<typeof schemaDashboardApiResponse>;
export type DashboardApiResponseValidation = DashboardApiResponse;

export const schemaStatItem = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  icon: z.string(),
  color: z.string(),
});

export const schemaSummaryItem = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
});

export const schemaTableItem = z.object({
  name: z.string(),
  current: z.string(),
  previous: z.string(),
});

export const schemaAniversarianteItem = z.object({
  name: z.string(),
  location: z.string(),
  status: z.string().optional(),
  date: z.string().optional(),
});

export const schemaStatusBadgeItem = z.object({
  value: z.union([z.string(), z.number()]),
  label: z.string().optional(),
  color: z.enum(["red", "green", "yellow", "blue", "purple", "gray", "dark-red"]),
  icon: z.string().optional(),
});

export const schemaAtendenteItem = z.object({
  role: z.string(),
  geral: z.number(),
  periodo: z.number(),
  concluidos: z.number(),
  pendentes: z.number(),
  statuses: z.array(schemaStatusBadgeItem),
});

export const schemaChartData = z.object({
  ocorrenciasPie: z.array(
    z.object({
      value: z.number(),
      name: z.string(),
      itemStyle: z.object({ color: z.string() }).optional(),
    }),
  ),
  ocorrenciasLine: z.object({
    months: z.array(z.string()),
    values: z.array(z.number()),
  }),
  metaDiaria: z.object({
    days: z.array(z.string()),
    values: z.array(z.number()),
  }),
  descontos: z.object({
    months: z.array(z.string()),
    values: z.array(z.number()),
  }),
  produtosBar: z.object({
    names: z.array(z.string()),
    current: z.array(z.number()),
    previous: z.array(z.number()),
  }),
});

export const schemaDashboardData = z.object({
  stats: z.array(schemaStatItem),
  chartData: schemaChartData,
  comprasMes: z.array(schemaSummaryItem),
  comprasMesAnterior: z.array(schemaSummaryItem),
  compradorItems: z.array(schemaTableItem),
  produtosItems: z.array(schemaTableItem),
  aniversariantesItems: z.array(schemaAniversarianteItem),
  atendentesItems: z.array(schemaAtendenteItem),
});

export type StatItem = z.infer<typeof schemaStatItem>;
export type SummaryItem = z.infer<typeof schemaSummaryItem>;
export type TableItem = z.infer<typeof schemaTableItem>;
export type AniversarianteItem = z.infer<typeof schemaAniversarianteItem>;
export type StatusBadgeItem = z.infer<typeof schemaStatusBadgeItem>;
export type AtendenteItem = z.infer<typeof schemaAtendenteItem>;
export type AtendimentosVencidos = Atendente;
export type ChartData = z.infer<typeof schemaChartData>;
export type DashboardData = z.infer<typeof schemaDashboardData>;
