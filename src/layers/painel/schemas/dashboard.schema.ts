import { z } from "zod";

const apiResponseBaseSchema = z.object({
  access: z.boolean(),
  message: z.string(),
});

export const indicadorDashboardItemSchema = z.object({
  count: z.union([z.string(), z.number()]),
  tipo: z.string(),
});

export const indicadoresDashboardSchema = apiResponseBaseSchema.extend({
  data: z.array(indicadorDashboardItemSchema),
});

export const atendimentoSchema = z.object({
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

export const proximosAtendimentosSchema = apiResponseBaseSchema.extend({
  data: z.array(atendimentoSchema),
});

export const atendimentosVencidosSchema = apiResponseBaseSchema.extend({
  data: z.array(atendimentoSchema),
});

function createAccessMessageDataSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return apiResponseBaseSchema.extend({
    data: z.array(dataSchema),
  });
}

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

export const ocorrencia12MesesItemSchema = z.object({
  atendimento_geral: z.coerce.string(),
  atendimento_periodo: z.coerce.string(),
  atendimento_ok: z.coerce.string(),
  atendimento_acompanhamento: z.coerce.string(),
  atendimento_pendente: z.coerce.string(),
  atendimento_vencido: z.coerce.string(),
});

export const ocorrencia6MesesItemSchema = z.object({
  count: z.coerce.number(),
  data_inicial: z.string(),
  data_final: z.string(),
  mes_ano: z.string(),
  date_part: z.number(),
});

export const aniversarianteFornecedorSchema = z.object({
  fornecedor: z.string(),
  fanta: z.string(),
  status: z.string(),
  cidade: z.string(),
  dat_nasc: z.string(),
  codfor: z.string(),
});

export const atendentePerformanceSchema = z.object({
  setor: z.coerce.string(),
  nomefun: z.coerce.string(),
  usuario: z.coerce.string(),
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

export const metaDiariaItemSchema = z.object({
  data: z.string(),
  peso: z.coerce.string(),
});

export const comprasMesItemSchema = z.object({
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

export const compradorPerformanceSchema = z.object({
  nome: z.string().nullable(),
  atual: z.coerce.string(),
  ant: z.coerce.string(),
});

export const produtoMaisCompradoSchema = z.object({
  produto: z.string().nullable(),
  mes_atual: z.coerce.string(),
  mes_anterior: z.coerce.string(),
});

export const descontoMensalSchema = z.object({
  mes: z.string(),
  desconto: z.coerce.number(),
});

export const dashboardApiResponseSchema = z
  .object({
    indicadoresDashboard: indicadoresDashboardSchema,
    indicadoresDashboardSemComprador: indicadoresDashboardSchema,
    proximosAtendimentos: proximosAtendimentosSchema,
    proximosAtendimentosNaoAdmin: proximosAtendimentosSchema,
    atendimentosVencidos: atendimentosVencidosSchema,
    atendimentosVencidosNaoAdmin: atendimentosVencidosSchema,
    ocorrencias12Meses: createAccessMessageDataSchema(ocorrencia12MesesItemSchema),
    ocorrencias12MesesNaoAdmin: createAccessMessageDataSchema(ocorrencia12MesesItemSchema),
    ocorrencias6Meses: createAccessMessageDataSchema(ocorrencia6MesesItemSchema),
    ocorrencias6MesesNaoAdmin: createAccessMessageDataSchema(ocorrencia6MesesItemSchema),
    aniversariantesFornecedores: createAccessMessageDataSchema(aniversarianteFornecedorSchema),
    aniversariantesContatos: createAccessMessageDataSchema(aniversarianteContatoSchema),
    atendentes: createAccessMessageDataSchema(atendentePerformanceSchema),
    metaDiaria: createAccessMessageDataSchema(metaDiariaItemSchema),
    comprasMes: createAccessMessageDataSchema(comprasMesItemSchema),
    comprasMesAnterior: createAccessMessageDataSchema(comprasMesItemSchema).optional().nullable(),
    comprasComprador: createAccessMessageDataSchema(compradorPerformanceSchema),
    prodsMaisCompradosMes: createAccessMessageDataSchema(produtoMaisCompradoSchema),
    totalDescontos: createAccessMessageDataSchema(descontoMensalSchema),
  })
  .passthrough();

export const statusItemSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  icon: z.string(),
  color: z.string(),
});

export const summaryItemSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
});

export const tableItemSchema = z.object({
  name: z.string(),
  current: z.string(),
  previous: z.string(),
});

export const aniversarianteItemSchema = z.object({
  name: z.string(),
  location: z.string(),
  status: z.string().optional(),
  date: z.string().optional(),
});

export const statusBadgeItemSchema = z.object({
  value: z.union([z.string(), z.number()]),
  label: z.string().optional(),
  color: z.enum(["red", "green", "yellow", "blue", "purple", "gray", "dark-red"]),
  icon: z.string().optional(),
});

export const atendenteItemSchema = z.object({
  role: z.string(),
  geral: z.number(),
  periodo: z.number(),
  concluidos: z.number(),
  pendentes: z.number(),
  statuses: z.array(statusBadgeItemSchema),
});

export const chartDataSchema = z.object({
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

export const dashboardDataSchema = z.object({
  stats: z.array(statusItemSchema),
  chartData: chartDataSchema,
  comprasMes: z.array(summaryItemSchema),
  comprasMesAnterior: z.array(summaryItemSchema),
  compradorItems: z.array(tableItemSchema),
  produtosItems: z.array(tableItemSchema),
  aniversariantesItems: z.array(aniversarianteItemSchema),
  atendentesItems: z.array(atendenteItemSchema),
});
