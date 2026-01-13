import { z } from "zod";

// =============================================================================
// INDICADORES
// =============================================================================

export const indicadorItemSchema = z.object({
  count: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  tipo: z.string(),
});

export type IndicadorItem = z.infer<typeof indicadorItemSchema>;

// =============================================================================
// ANIVERSARIANTES
// =============================================================================

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

export const aniversarianteFornecedorSchema = z.object({
  fornecedor: z.string(),
  fanta: z.string(),
  status: z.string(),
  cidade: z.string(),
  dat_nasc: z.string(),
  codfor: z.string(),
});

export type AniversarianteFornecedor = z.infer<typeof aniversarianteFornecedorSchema>;

// =============================================================================
// ATENDENTES
// =============================================================================

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

export type AtendentePerformance = z.infer<typeof atendentePerformanceSchema>;

// =============================================================================
// ATENDIMENTOS
// =============================================================================

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

export type Atendimento = z.infer<typeof atendimentoSchema>;

// =============================================================================
// COMPRAS
// =============================================================================

export const metaDiariaSchema = z.object({
  data: z.string(),
  peso: z.coerce.string(),
});

export type MetaDiaria = z.infer<typeof metaDiariaSchema>;

export const comprasMesSchema = z.object({
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

export type ComprasMes = z.infer<typeof comprasMesSchema>;

export const compradorPerformanceSchema = z.object({
  nome: z.string().nullable(),
  atual: z.coerce.string(),
  ant: z.coerce.string(),
});

export type CompradorPerformance = z.infer<typeof compradorPerformanceSchema>;

export const produtoMaisCompradoSchema = z.object({
  produto: z.string().nullable(),
  mes_atual: z.coerce.string(),
  mes_anterior: z.coerce.string(),
});

export type ProdutoMaisComprado = z.infer<typeof produtoMaisCompradoSchema>;

export const descontoMensalSchema = z.object({
  mes: z.string(),
  desconto: z.coerce.number(),
});

export type DescontoMensal = z.infer<typeof descontoMensalSchema>;

// =============================================================================
// OCORRÊNCIAS
// =============================================================================

export const ocorrencia12MesesSchema = z.object({
  atendimento_geral: z.coerce.string(),
  atendimento_periodo: z.coerce.string(),
  atendimento_ok: z.coerce.string(),
  atendimento_acompanhamento: z.coerce.string(),
  atendimento_pendente: z.coerce.string(),
  atendimento_vencido: z.coerce.string(),
});

export type Ocorrencia12Meses = z.infer<typeof ocorrencia12MesesSchema>;

export const ocorrencia6MesesSchema = z.object({
  count: z.coerce.number(),
  data_inicial: z.string(),
  data_final: z.string(),
  mes_ano: z.string(),
  date_part: z.number(),
});

export type Ocorrencia6Meses = z.infer<typeof ocorrencia6MesesSchema>;

// =============================================================================
// RESPOSTA DA API
// =============================================================================

const apiResponseBaseSchema = z.object({
  access: z.boolean(),
  message: z.string(),
});

function createApiDataArraySchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return apiResponseBaseSchema.extend({
    data: z.array(dataSchema),
  });
}

const dashboardDataSchema = z
  .object({
    indicadoresDashboard: createApiDataArraySchema(indicadorItemSchema),
    indicadoresDashboardSemComprador: createApiDataArraySchema(indicadorItemSchema),
    proximosAtendimentos: createApiDataArraySchema(atendimentoSchema),
    proximosAtendimentosNaoAdmin: createApiDataArraySchema(atendimentoSchema),
    atendimentosVencidos: createApiDataArraySchema(atendimentoSchema),
    atendimentosVencidosNaoAdmin: createApiDataArraySchema(atendimentoSchema),
    ocorrencias12Meses: createApiDataArraySchema(ocorrencia12MesesSchema),
    ocorrencias12MesesNaoAdmin: createApiDataArraySchema(ocorrencia12MesesSchema),
    ocorrencias6Meses: createApiDataArraySchema(ocorrencia6MesesSchema),
    ocorrencias6MesesNaoAdmin: createApiDataArraySchema(ocorrencia6MesesSchema),
    aniversariantesFornecedores: createApiDataArraySchema(aniversarianteFornecedorSchema),
    aniversariantesContatos: createApiDataArraySchema(aniversarianteContatoSchema),
    atendentes: createApiDataArraySchema(atendentePerformanceSchema),
    metaDiaria: createApiDataArraySchema(metaDiariaSchema),
    comprasMes: createApiDataArraySchema(comprasMesSchema),
    comprasMesAnterior: createApiDataArraySchema(comprasMesSchema).optional().nullable(),
    comprasComprador: createApiDataArraySchema(compradorPerformanceSchema),
    prodsMaisCompradosMes: createApiDataArraySchema(produtoMaisCompradoSchema),
    totalDescontos: createApiDataArraySchema(descontoMensalSchema),
  })
  .passthrough();

export const dashboardApiResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  suggestion: z.string().optional(),
  data: dashboardDataSchema,
});

export type DashboardApiResponse = z.infer<typeof dashboardApiResponseSchema>;
export type DashboardData = z.infer<typeof dashboardDataSchema>;

// =============================================================================
// FILTROS
// =============================================================================

export const dashboardFiltersSchema = z.object({
  data_inicial: z.string(),
  data_final: z.string(),
  data_inicial2: z.string(),
  data_final2: z.string(),
  categoriaFornecedor: z.string(),
  filial: z.string(),
  mes_grafico: z.string(),
});

export type DashboardFilters = z.infer<typeof dashboardFiltersSchema>;
