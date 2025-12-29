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
  num: z.string(),
  codcli: z.string(),
  codfor: z.string(),
  nome: z.string(),
  data_oco: z.string(),
  atendente: z.string(),
  tipo_ate: z.string(),
  situacao: z.string(),
  status: z.string(),
  data_pro: z.string(),
  oco: z.string(),
  solucao: z.string(),
  usuario: z.string(),
  data: z.string(),
  hora: z.string(),
  empresa: z.string(),
  sr_recno: z.string(),
  hora_oco: z.string(),
  apelido: z.string(),
  atendente_enc: z.string(),
  user_diagnostico: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  problema: z.string(),
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
  fanta: z.string(),
  oco2: z.string(),
  celular: z.string(),
  tel3: z.string(),
  data: z.string(),
  fone: z.string(),
  email: z.string(),
  status: z.string(),
  ende: z.string(),
  cidade: z.string(),
  uf: z.string().optional(),
  categoria: z.string(),
  tf: z.string(),
  dat_nasc: z.string(),
  codfor: z.string(),
  dia_nasc: z.coerce.number(),
  dia_atual: z.coerce.number(),
  ultima_carga: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  latlong: z.boolean(),
});

// Schema para StaffPerformance
const staffPerformanceSchema = z.object({
  setor: z.string(),
  nomefun: z.string(),
  sr_recno: z.string(),
  email: z.boolean(),
  iduser: z.string(),
  codven: z.string(),
  codcom: z.string(),
  codcla: z.string(),
  codcatfor: z.string(),
  atendimento_geral: z.string(),
  atendimento_periodo: z.string(),
  atendimento_ok: z.string(),
  atendimento_acompanhamento: z.string(),
  atendimento_pendente: z.string(),
  atendimento_vencido: z.string(),
});

// Schema para DailyGoal
const dailyGoalSchema = z.object({
  data: z.string(),
  peso: z.string(),
});

// Schema para PurchasingStats
const purchasingStatsSchema = z.object({
  total: z.string(),
  liquido: z.string(),
  preco_medio: z.string(),
  desconto: z.string(),
  media_diaria: z.string(),
  preco_sem_icms: z.string(),
  icms: z.string(),
  totaldiasuteis: z.string(),
  totalsabados: z.string(),
});

// Schema para BuyerPerformance
const buyerPerformanceSchema = z.object({
  nome: z.string().nullable(),
  atual: z.string(),
  ant: z.string(),
});

// Schema para TopProduct
const topProductSchema = z.object({
  produto: z.string().nullable(),
  mes_atual: z.string(),
  mes_anterior: z.string(),
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
      data: z.array(atendenteSchema),
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
    }),
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

export type DashboardApiResponseValidation = z.infer<typeof schemaDashboardApiResponse>;
