import { defineStore } from "pinia";

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

import type { DashboardData } from "~/schemas/api/dashboard";
import type {
  AniversarianteFornecedor,
  AtendentePerformance,
  Atendimento,
  CompradorPerformance,
  IndicadorItem,
  ProdutoMaisComprado,
} from "~/schemas/domain/dashboard";

/**
 * Schema para item de status (UI)
 */
interface StatusItem {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

/**
 * Schema para item de resumo (UI)
 */
interface SummaryItem {
  label: string;
  value: string | number;
}

/**
 * Schema para item de tabela (UI)
 */
interface TableItem {
  name: string;
  current: string;
  previous: string;
}

/**
 * Schema para item de aniversariante (UI)
 */
interface AniversarianteItem {
  name: string;
  location: string;
  status?: string;
  date?: string;
}

/**
 * Schema para badge de status (UI)
 */
interface StatusBadgeItem {
  value: string | number;
  label?: string;
  color: "red" | "green" | "yellow" | "blue" | "purple" | "gray" | "dark-red";
  icon?: string;
}

/**
 * Schema para item de atendente (UI)
 */
interface AtendenteItem {
  role: string;
  geral: number;
  periodo: number;
  concluidos: number;
  pendentes: number;
  statuses: StatusBadgeItem[];
}

/**
 * Schema para dados de gráficos (UI)
 */
interface ChartData {
  ocorrenciasPie: Array<{
    value: number;
    name: string;
    itemStyle?: { color: string };
  }>;
  ocorrenciasLine: {
    months: string[];
    values: number[];
  };
  metaDiaria: {
    days: string[];
    values: number[];
  };
  descontos: {
    months: string[];
    values: number[];
  };
  produtosBar: {
    names: string[];
    current: number[];
    previous: number[];
  };
}

/**
 * Store do Dashboard
 *
 * Gerencia estado e transformações dos dados do dashboard.
 * Recebe dados da API e os transforma para formato de UI.
 */
export const useDashboardStore = defineStore("dashboard", () => {
  // Estado
  const response = ref<DashboardData | null>(null);

  // Stats padrão
  const defaultStats: StatusItem[] = [
    { label: "Fornecedores", value: 0, icon: "Building2", color: "bg-primary" },
    { label: "Prospectos", value: 0, icon: "UserPlus", color: "bg-primary" },
    { label: "Ativos", value: 0, icon: "CheckCircle", color: "bg-primary" },
    { label: "Inativos", value: 0, icon: "XCircle", color: "bg-primary" },
    { label: "Atendimentos", value: 0, icon: "MessageSquare", color: "bg-primary" },
    { label: "Vencidos", value: 0, icon: "AlertTriangle", color: "bg-primary" },
    { label: "Agendados", value: 0, icon: "Calendar", color: "bg-primary" },
  ];

  // Computeds - Stats
  const stats = computed<StatusItem[]>(() => {
    const items = response.value?.indicadoresDashboard?.data ?? [];
    if (items.length === 0) return defaultStats;

    return items.map((item: IndicadorItem) => ({
      label: formatarLabel(item.tipo),
      value: item.count ?? 0,
      icon: mapIcon(item.tipo),
      color: "bg-primary",
    }));
  });

  // Computeds - Chart Data
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

  // Computeds - Compras
  const comprasMes = computed<SummaryItem[]>(() => {
    const data = response.value?.comprasMes?.data?.[0];
    if (!data) return [];
    return formatarResumoCompras(data);
  });

  const comprasMesAnterior = computed<SummaryItem[]>(() => {
    const data = response.value?.comprasMesAnterior?.data?.[0];
    if (!data) {
      return [
        { label: "Total Mês", value: 0 },
        { label: "Preço Médio", value: 0 },
        { label: "Média Diária", value: 0 },
        { label: "Descontos", value: "0" },
      ];
    }
    return formatarResumoCompras(data);
  });

  // Computeds - Tabelas
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
    return data.map((produto: ProdutoMaisComprado) => ({
      name: produto.produto ?? "Produto desc.",
      current: formatarMoeda(produto.mes_atual),
      previous: formatarMoeda(produto.mes_anterior),
    }));
  });

  const aniversariantesItems = computed<AniversarianteItem[]>(() => {
    const data = response.value?.aniversariantesFornecedores?.data ?? [];
    return data.map((aniversariante: AniversarianteFornecedor) => ({
      name: aniversariante.fornecedor,
      location: aniversariante.cidade,
      status: aniversariante.status,
      date: aniversariante.dat_nasc,
    }));
  });

  const atendentesItems = computed<AtendenteItem[]>(() => {
    const data = response.value?.atendentes?.data ?? [];
    return data.map((atendente: AtendentePerformance) => ({
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

  const atendimentosVencidos = computed<Atendimento[]>(() => {
    return response.value?.atendimentosVencidos?.data ?? [];
  });

  const isOcorrenciasPieEmpty = computed(() => {
    const list = chartData.value.ocorrenciasPie;
    return list.length === 0 || list.every((item) => item.value === 0);
  });

  const isOcorrenciasLineEmpty = computed(() => {
    const values = chartData.value.ocorrenciasLine.values;
    return values.length === 0 || values.every((value) => value === 0);
  });

  const isMetaDiariaEmpty = computed(() => {
    const values = chartData.value.metaDiaria.values;
    return values.length === 0 || values.every((value) => value === 0);
  });

  const isDescontosEmpty = computed(() => {
    const values = chartData.value.descontos.values;
    return values.length === 0 || values.every((value) => value === 0);
  });

  const isProdutosBarEmpty = computed(() => {
    const data = chartData.value.produtosBar;
    return (
      data.names.length === 0 ||
      (data.current.every((value) => value === 0) && data.previous.every((value) => value === 0))
    );
  });

  function setDashboardData(data: DashboardData | null) {
    response.value = data;
  }

  return {
    // Estado
    response,

    // Actions
    setDashboardData,

    // Computeds
    stats,
    chartData,
    comprasMes,
    comprasMesAnterior,
    compradorItems,
    produtosItems,
    aniversariantesItems,
    atendentesItems,
    atendimentosVencidos,

    // Verificações
    isOcorrenciasPieEmpty,
    isOcorrenciasLineEmpty,
    isMetaDiariaEmpty,
    isDescontosEmpty,
    isProdutosBarEmpty,
  };
});
