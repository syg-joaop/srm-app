import { defineStore } from "pinia";
import type {
  DashboardApiResponse,
  Attendance,
  DashboardCount,
  StatItem,
  SummaryItem,
  TableItem,
  AniversarianteItem,
  ChartData,
  AtendenteItem,
} from "../types/dashboard";
import { formatarMoeda } from "~/utils/formatters/formatadores";
import {
  emptyChartData,
  formatarLabel,
  mapIcon,
  formatarResumoCompras,
  formatarResumoComprasAnterior,
  transformPieData,
  transformLineData,
  transformMetaData,
  transformDescData,
  transformProdutosData,
} from "~/utils/helpers";

export const useDashboardStore = defineStore("dashboard", () => {
  // ==================== ESTADO ====================
  const rawData = ref<DashboardApiResponse | null>(null);

  // ==================== COMPUTED ====================

  // 1. Indicadores (Cards do Topo)
  const defaultStats: StatItem[] = [
    { label: "Fornecedores", value: 0, icon: "Building2", color: "bg-primary" },
    { label: "Prospectos", value: 0, icon: "UserPlus", color: "bg-primary" },
    { label: "Ativos", value: 0, icon: "CheckCircle", color: "bg-primary" },
    { label: "Inativos", value: 0, icon: "XCircle", color: "bg-primary" },
    { label: "Atendimentos", value: 0, icon: "MessageSquare", color: "bg-primary" },
    { label: "Vencidos", value: 0, icon: "AlertTriangle", color: "bg-primary" },
    { label: "Agendados", value: 0, icon: "Calendar", color: "bg-primary" },
  ];

  const stats = computed<StatItem[]>(() => {
    const items = rawData.value?.indicadoresDashboard?.data ?? [];
    if (items.length === 0) return defaultStats;

    return items.map((item: DashboardCount) => ({
      label: formatarLabel(item.tipo),
      value: item.count ?? 0,
      icon: mapIcon(item.tipo),
      color: "bg-primary",
    }));
  });

  // 2. Gráficos
  const chartData = computed<ChartData>(() => {
    const apiData = rawData.value;
    if (!apiData) return emptyChartData();

    return {
      ocorrenciasPie: transformPieData(apiData),
      ocorrenciasLine: transformLineData(apiData),
      metaDiaria: transformMetaData(apiData),
      descontos: transformDescData(apiData),
      produtosBar: transformProdutosData(apiData),
    };
  });

  // 3. Tabelas de Compras
  const comprasMes = computed<SummaryItem[]>(() => {
    const data = rawData.value?.comprasMes?.data?.[0];
    return formatarResumoCompras(data);
  });

  const comprasMesAnterior = computed<SummaryItem[]>(() => {
    const data = rawData.value?.comprasMes?.data?.[0];
    return formatarResumoComprasAnterior(data);
  });

  const compradorItems = computed<TableItem[]>(() => {
    const data = rawData.value?.comprasComprador?.data ?? [];
    return data.map((c) => ({
      name: c.nome ?? "Não Identificado",
      current: formatarMoeda(c.atual),
      previous: formatarMoeda(c.ant),
    }));
  });

  const produtosItems = computed<TableItem[]>(() => {
    const data = rawData.value?.prodsMaisCompradosMes?.data ?? [];
    return data.map((p) => ({
      name: p.produto ?? "Produto Desc.",
      current: formatarMoeda(p.mes_atual),
      previous: formatarMoeda(p.mes_anterior),
    }));
  });

  // 4. Outras Tabelas
  const aniversariantesItems = computed<AniversarianteItem[]>(() => {
    const data = rawData.value?.aniversariantesFornecedores?.data ?? [];
    return data.map((a) => ({
      name: a.fornecedor,
      location: a.uf ? `${a.cidade}/${a.uf}` : a.cidade,
      status: a.status,
      date: a.dat_nasc,
    }));
  });

  const atendentesItems = computed<AtendenteItem[]>(() => {
    const data = rawData.value?.atendentes?.data ?? [];
    return data.map((a) => ({
      role: a.setor || "Geral",
      s1: Number(a.atendimento_geral),
      s2: Number(a.atendimento_periodo),
      s3: Number(a.atendimento_ok),
      s4: Number(a.atendimento_pendente),
      statuses: [
        {
          value: Number(a.atendimento_periodo),
          label: "Período",
          color: "gray",
          icon: "calendar",
        },
        {
          value: Number(a.atendimento_ok),
          label: "OK",
          color: "green",
          icon: "check",
        },
        {
          value: Number(a.atendimento_pendente),
          label: "Pendente",
          color: "yellow",
          icon: "clock",
        },
        {
          value: Number(a.atendimento_geral), // Usando Geral como o 4º item (X)
          label: "Geral",
          color: "red",
          icon: "x",
        },
      ],
    }));
  });

  const atendimentosVencidos = computed<Attendance[]>(() => {
    const data = rawData.value?.atendimentosVencidos?.data ?? [];
    return data;
  });

  // 5. Verificações de dados vazios para gráficos
  const isOcorrenciasPieEmpty = computed(() => {
    return chartData.value.ocorrenciasPie.length === 0 ||
      chartData.value.ocorrenciasPie.every((item) => item.value === 0);
  });

  const isOcorrenciasLineEmpty = computed(() => {
    return chartData.value.ocorrenciasLine.values.length === 0 ||
      chartData.value.ocorrenciasLine.values.every((v) => v === 0);
  });

  const isMetaDiariaEmpty = computed(() => {
    return chartData.value.metaDiaria.values.length === 0 ||
      chartData.value.metaDiaria.values.every((v) => v === 0);
  });

  const isDescontosEmpty = computed(() => {
    return chartData.value.descontos.values.length === 0 ||
      chartData.value.descontos.values.every((v) => v === 0);
  });

  const isProdutosBarEmpty = computed(() => {
    return chartData.value.produtosBar.names.length === 0 ||
      (chartData.value.produtosBar.current.every((v) => v === 0) &&
        chartData.value.produtosBar.previous.every((v) => v === 0));
  });

  // ==================== ACTIONS ====================
  function setDashboardData(data: DashboardApiResponse | null) {
    rawData.value = data;
  }

  return {
    rawData,

    // Actions
    setDashboardData,

    // Getters (UI Ready)
    stats,
    chartData,
    comprasMes,
    comprasMesAnterior,
    compradorItems,
    produtosItems,
    aniversariantesItems,
    atendentesItems,
    atendimentosVencidos,

    // Empty state flags
    isOcorrenciasPieEmpty,
    isOcorrenciasLineEmpty,
    isMetaDiariaEmpty,
    isDescontosEmpty,
    isProdutosBarEmpty,
  };
});
