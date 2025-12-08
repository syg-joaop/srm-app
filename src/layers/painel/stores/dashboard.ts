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
  const stats = computed<StatItem[]>(() => {
    const items = rawData.value?.indicadoresDashboard?.data ?? [];
    return items.map((item: DashboardCount) => ({
      label: formatarLabel(item.tipo),
      value: item.count,
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
      location: `${a.cidade}/${a.uf}`,
      status: a.status,
      date: new Date(a.dat_nasc).toLocaleDateString("pt-BR"),
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
  };
});
