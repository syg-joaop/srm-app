import { defineStore } from "pinia";
import { z } from "zod";

import {
  EMPTY_CHART_DATA,
  formatarLabel,
  formatarResumoCompras,
  mapIcon,
  transformDescData,
  transformLineData,
  transformMetaData,
  transformPieData,
  transformProdutosData,
} from "../dashboard.helpers";
import {
  aniversarianteFornecedorSchema,
  aniversarianteItemSchema,
  atendenteItemSchema,
  atendentePerformanceSchema,
  atendimentoSchema,
  chartDataSchema,
  compradorPerformanceSchema,
  dashboardApiResponseSchema,
  indicadorDashboardItemSchema,
  produtoMaisCompradoSchema,
  statusItemSchema,
  summaryItemSchema,
  tableItemSchema,
} from "../schemas/dashboard.schema";

type AniversarianteItem = z.infer<typeof aniversarianteItemSchema>;
type Atendente = z.infer<typeof atendimentoSchema>;
type AtendenteItem = z.infer<typeof atendenteItemSchema>;
type Atendentes = z.infer<typeof atendentePerformanceSchema>;
type ChartData = z.infer<typeof chartDataSchema>;
type CompradorPerformance = z.infer<typeof compradorPerformanceSchema>;
type DashboardApiResponse = z.infer<typeof dashboardApiResponseSchema>;
type DashboardCount = z.infer<typeof indicadorDashboardItemSchema>;
type StatusItem = z.infer<typeof statusItemSchema>;
type SummaryItem = z.infer<typeof summaryItemSchema>;
type SupplierBirthday = z.infer<typeof aniversarianteFornecedorSchema>;
type TableItem = z.infer<typeof tableItemSchema>;
type TopProduct = z.infer<typeof produtoMaisCompradoSchema>;

export const useDashboardStore = defineStore("dashboard", () => {
  const response = ref<DashboardApiResponse | null>(null);

  const defaultStats: StatusItem[] = [
    { label: "Fornecedores", value: 0, icon: "Building2", color: "bg-primary" },
    { label: "Prospectos", value: 0, icon: "UserPlus", color: "bg-primary" },
    { label: "Ativos", value: 0, icon: "CheckCircle", color: "bg-primary" },
    { label: "Inativos", value: 0, icon: "XCircle", color: "bg-primary" },
    { label: "Atendimentos", value: 0, icon: "MessageSquare", color: "bg-primary" },
    { label: "Vencidos", value: 0, icon: "AlertTriangle", color: "bg-primary" },
    { label: "Agendados", value: 0, icon: "Calendar", color: "bg-primary" },
  ];

  const stats = computed<StatusItem[]>(() => {
    const items = response.value?.indicadoresDashboard?.data ?? [];
    if (items.length === 0) return defaultStats;

    return items.map((item: DashboardCount) => ({
      label: formatarLabel(item.tipo),
      value: item.count ?? 0,
      icon: mapIcon(item.tipo),
      color: "bg-primary",
    }));
  });

  const chartData = computed<ChartData>(() => {
    const apiData = response.value;
    if (!apiData) return EMPTY_CHART_DATA;

    return {
      ocorrenciasPie: transformPieData(apiData),
      ocorrenciasLine: transformLineData(apiData),
      metaDiaria: transformMetaData(apiData),
      descontos: transformDescData(apiData),
      produtosBar: transformProdutosData(apiData),
    };
  });

  const comprasMes = computed<SummaryItem[]>(() => {
    const data = response.value?.comprasMes?.data?.[0];
    if (!data) return [];
    return formatarResumoCompras(data);
  });

  const comprasMesAnterior = computed<SummaryItem[]>(() => {
    const data = response.value?.comprasMesAnterior?.data?.[0];
    if (!data)
      return [
        { label: "Total Mês", value: 0 },
        { label: "Preço Médio", value: 0 },
        { label: "Média Diária", value: 0 },
        { label: "Descontos", value: "0" },
      ] as SummaryItem[];
    return formatarResumoCompras(data);
  });

  const compradorItems = computed<TableItem[]>(() => {
    const data = response.value?.comprasComprador?.data ?? [];
    return data.map((comprador: CompradorPerformance) => ({
      name: comprador.nome ?? "Não identificado",
      current: formatarMoeda(comprador.atual),
      previous: formatarMoeda(comprador.ant),
    }));
  });

  const produtosItems = computed<TableItem[]>(() => {
    const data = response.value?.prodsMaisCompradosMes?.data ?? [];
    return data.map((produto: TopProduct) => ({
      name: produto.produto ?? "Produto desc.",
      current: formatarMoeda(produto.mes_atual),
      previous: formatarMoeda(produto.mes_anterior),
    }));
  });

  const aniversariantesItems = computed<AniversarianteItem[]>(() => {
    const data = response.value?.aniversariantesFornecedores?.data ?? [];
    return data.map((aniversariante: SupplierBirthday) => ({
      name: aniversariante.fornecedor,
      location: aniversariante.cidade,
      status: aniversariante.status,
      date: aniversariante.dat_nasc,
    }));
  });

  const atendentesItems = computed<AtendenteItem[]>(() => {
    const data = response.value?.atendentes?.data ?? [];
    return data.map((atendente: Atendentes) => ({
      role: atendente.setor || "Geral",
      geral: Number(atendente.atendimento_geral),
      periodo: Number(atendente.atendimento_periodo),
      concluidos: Number(atendente.atendimento_ok),
      pendentes: Number(atendente.atendimento_pendente),
      statuses: [
        {
          value: Number(atendente.atendimento_periodo),
          label: "Período",
          color: "gray",
          icon: "calendar",
        },
        {
          value: Number(atendente.atendimento_ok),
          label: "OK",
          color: "green",
          icon: "check",
        },
        {
          value: Number(atendente.atendimento_pendente),
          label: "Pendente",
          color: "yellow",
          icon: "clock",
        },
        {
          value: Number(atendente.atendimento_geral),
          label: "Geral",
          color: "red",
          icon: "x",
        },
      ],
    }));
  });

  const atendimentosVencidos = computed<Atendente[]>(() => {
    return response.value?.atendimentosVencidos?.data ?? [];
  });

  const isOcorrenciasPieEmpty = computed(() => {
    const list = chartData.value.ocorrenciasPie;
    return list.length === 0 || list.every((item: { value: number }) => item.value === 0);
  });

  const isOcorrenciasLineEmpty = computed(() => {
    const values = chartData.value.ocorrenciasLine.values;
    return values.length === 0 || values.every((value: number) => value === 0);
  });

  const isMetaDiariaEmpty = computed(() => {
    const values = chartData.value.metaDiaria.values;
    return values.length === 0 || values.every((value: number) => value === 0);
  });

  const isDescontosEmpty = computed(() => {
    const values = chartData.value.descontos.values;
    return values.length === 0 || values.every((value: number) => value === 0);
  });

  const isProdutosBarEmpty = computed(() => {
    const data = chartData.value.produtosBar;
    return (
      data.names.length === 0 ||
      (data.current.every((value: number) => value === 0) &&
        data.previous.every((value: number) => value === 0))
    );
  });

  function setDashboardData(data: DashboardApiResponse | null) {
    response.value = data;
  }

  return {
    response,
    setDashboardData,
    stats,
    chartData,
    comprasMes,
    comprasMesAnterior,
    compradorItems,
    produtosItems,
    aniversariantesItems,
    atendentesItems,
    atendimentosVencidos,
    isOcorrenciasPieEmpty,
    isOcorrenciasLineEmpty,
    isMetaDiariaEmpty,
    isDescontosEmpty,
    isProdutosBarEmpty,
  };
});
