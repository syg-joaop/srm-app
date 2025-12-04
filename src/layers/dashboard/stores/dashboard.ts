import { defineStore } from "pinia";
import type {
  DashboardApiResponse,
  Attendance,
  DashboardCount,
  PurchasingStats,
} from "../types/dashboard";

export interface DashboardData {
  stats: StatItem[];
  chartData: ChartData;
  comprasMes: SummaryItem[];
  comprasMesAnterior: SummaryItem[];
  compradorItems: TableItem[];
  produtosItems: TableItem[];
  aniversariantesItems: AniversarianteItem[];
  atendentesItems: AtendenteItem[];
}

export interface StatItem {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

export interface SummaryItem {
  label: string;
  value: string;
}

export interface TableItem {
  name: string;
  current: string;
  previous: string;
}

export interface AniversarianteItem {
  name: string;
  location: string;
  status: string;
  date: string;
}

export interface AtendenteItem {
  role: string;
  s1: number; // Geral
  s2: number; // Periodo
  s3: number; // OK
  s4: number; // Pendente
  statuses: StatusBadgeItem[];
}

interface StatusBadgeItem {
  value: string | number;
  label?: string;
  color: "red" | "green" | "yellow" | "blue" | "purple" | "gray" | "dark-red";
  icon?: string;
}

export type AtendimentosVencidos = Attendance;

export interface ChartData {
  ocorrenciasPie: {
    value: number;
    name: string;
    itemStyle: { color: string };
  }[];
  ocorrenciasLine: { months: string[]; values: number[] };
  metaDiaria: { days: string[]; values: number[] };
  descontos: { months: string[]; values: number[] };
  produtosBar: { names: string[]; current: number[]; previous: number[] };
}

export const useDashboardStore = defineStore("dashboard", () => {
  // ==================== ESTADO ====================
  const rawData = ref<DashboardApiResponse | null>(null);

  // ==================== COMPUTED (NORMALIZAÇÃO) ====================

  // 1. Indicadores (Cards do Topo)
  const stats = computed<StatItem[]>(() => {
    const items = rawData.value?.indicadoresDashboard?.data ?? [];
    return items.map((item: DashboardCount) => ({
      label: formatarLabel(item.tipo),
      value: item.count,
      icon: mapIcon(item.tipo),
      color: "bg-primary", // Tailwind class placeholder
    }));
  });

  // 2. Gráficos
  const chartData = computed<ChartData>(() => {
    const apiData = rawData.value;
    if (!apiData) return emptyChartData();

    // Pizza: Ocorrencias 12 Meses
    // O JSON retorna um array com 1 objeto contendo as chaves
    const pieRaw = apiData.ocorrencias12Meses?.data?.[0];
    const pieData = pieRaw
      ? [
          {
            value: Number(pieRaw.atendimento_ok),
            name: "Finalizado",
            itemStyle: { color: "#4ade80" },
          },
          {
            value: Number(pieRaw.atendimento_acompanhamento),
            name: "Em Acompanhamento",
            itemStyle: { color: "#fbbf24" },
          },
          {
            value: Number(pieRaw.atendimento_pendente),
            name: "Pendente",
            itemStyle: { color: "#f87171" },
          },
          {
            value: Number(pieRaw.atendimento_vencido),
            name: "Vencido",
            itemStyle: { color: "#ef4444" },
          },
        ]
      : [];

    // Linha: Ocorrencias 6 Meses
    const lineRaw = apiData.ocorrencias6Meses?.data ?? [];
    // Ordenar por date_part ou data se necessário, assumindo que vem ordenado
    const lineData = {
      months: lineRaw.map((i) => i.mes_ano),
      values: lineRaw.map((i) => i.count),
    };

    // Meta Diaria
    const metaRaw = apiData.metaDiaria?.data ?? [];
    const metaData = {
      days: metaRaw.map((i) =>
        new Date(i.data).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        })
      ),
      values: metaRaw.map((i) => Number(i.sum)),
    };

    // Descontos
    const descRaw = apiData.totalDescontos?.data ?? [];
    const descData = {
      months: descRaw.map((i) => i.mes),
      values: descRaw.map((i) => i.desconto),
    };

    return {
      ocorrenciasPie: pieData,
      ocorrenciasLine: lineData,
      metaDiaria: metaData,
      descontos: descData,
      produtosBar: {
        names: (rawData.value?.prodsMaisCompradosMes?.data ?? [])
          .slice(0, 10)
          .map((p) => p.produto ?? "Produto Desc."),
        current: (rawData.value?.prodsMaisCompradosMes?.data ?? [])
          .slice(0, 10)
          .map((p) => Number(p.mes_atual)),
        previous: (rawData.value?.prodsMaisCompradosMes?.data ?? [])
          .slice(0, 10)
          .map((p) => Number(p.mes_anterior)),
      },
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
      current: formatMoeda(c.atual),
      previous: formatMoeda(c.ant),
    }));
  });

  const produtosItems = computed<TableItem[]>(() => {
    const data = rawData.value?.prodsMaisCompradosMes?.data ?? [];
    return data.map((p) => ({
      name: p.produto ?? "Produto Desc.",
      current: formatMoeda(p.mes_atual), // Assumindo que vem valor monetário ou quantidade
      previous: formatMoeda(p.mes_anterior),
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
    // State Raw (para debug se precisar)
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

// ==================== HELPERS ====================
function emptyChartData(): ChartData {
  return {
    ocorrenciasPie: [],
    ocorrenciasLine: { months: [], values: [] },
    metaDiaria: { days: [], values: [] },
    descontos: { months: [], values: [] },
    produtosBar: { names: [], current: [], previous: [] },
  };
}

const formatMoeda = (val: string | number | undefined) => {
  if (val === undefined || val === null) return "R$ 0,00";
  const num = typeof val === "string" ? parseFloat(val) : val;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
};

const formatarLabel = (tipo: string) =>
  tipo.charAt(0).toUpperCase() + tipo.slice(1);

function mapIcon(tipo: string): string {
  const map: Record<string, string> = {
    Fornecedores: "Building2",
    Prospectos: "UserPlus",
    Ativos: "CheckCircle",
    Inativos: "XCircle",
    Atendimentos: "MessageSquare",
    Vencidos: "AlertTriangle",
    Agendados: "Calendar",
  };
  // Fallback case insensitive
  const key = Object.keys(map).find(
    (k) => k.toLowerCase() === tipo.toLowerCase()
  );
  return key ? map[key] : "Info";
}

function formatarResumoCompras(data?: PurchasingStats): SummaryItem[] {
  if (!data) return [];
  return [
    { label: "Total Mês", value: formatMoeda(data.total) },
    { label: "Líquido", value: formatMoeda(data.liquido) },
    { label: "Preço Médio", value: formatMoeda(data.preco_medio) },
    { label: "Descontos", value: formatMoeda(data.desconto) },
  ];
}

function formatarResumoComprasAnterior(data?: any): SummaryItem[] {
  // O tipo é 'any' aqui propositalmente pois o JSON tipado não tem esses campos,
  // mas precisamos evitar o crash se o backend mandar ou se a UI esperar
  if (!data) return [];
  return [
    { label: "Total Mês", value: formatMoeda(data.total_anterior ?? 0) },
    {
      label: "Preço Médio",
      value: formatMoeda(data.preco_medio_anterior ?? 0),
    },
    {
      label: "Média Diária",
      value: formatMoeda(data.media_diaria_anterior ?? 0),
    },
    { label: "Descontos", value: formatMoeda(data.desconto_anterior ?? 0) },
  ];
}
