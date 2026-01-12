import { z } from "zod";

import {
  aniversarianteContatoSchema,
  aniversarianteFornecedorSchema,
  atendentePerformanceSchema,
  atendimentoSchema,
  compradorPerformanceSchema,
  comprasMesSchema,
  descontoMensalSchema,
  indicadorItemSchema,
  metaDiariaSchema,
  ocorrencia12MesesSchema,
  ocorrencia6MesesSchema,
  produtoMaisCompradoSchema,
} from "~/schemas/domain/dashboard";

/**
 * Schema base para respostas da API com access/message
 */
const apiResponseBaseSchema = z.object({
  access: z.boolean(),
  message: z.string(),
});

/**
 * Helper para criar schema de resposta com array de dados
 */
function createApiDataArraySchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return apiResponseBaseSchema.extend({
    data: z.array(dataSchema),
  });
}

/**
 * Schema dos dados internos do dashboard (dentro do envelope)
 */
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
  .passthrough(); // Permite campos extras sem falhar validação

/**
 * Schema completo da resposta da API de dashboard (com envelope)
 */
export const dashboardApiResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  suggestion: z.string().optional(),
  data: dashboardDataSchema,
});

export type DashboardApiResponse = z.infer<typeof dashboardApiResponseSchema>;

/**
 * Tipo dos dados internos do dashboard (sem envelope)
 */
export type DashboardData = z.infer<typeof dashboardDataSchema>;

/**
 * Schema para filtros de dashboard
 */
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
