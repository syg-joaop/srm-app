import type {
  ChartData,
  PurchasingStats,
  SummaryItem,
} from "~/layers/dashboard/types/dashboard";

export function emptyChartData(): ChartData {
  return {
    ocorrenciasPie: [],
    ocorrenciasLine: { months: [], values: [] },
    metaDiaria: { days: [], values: [] },
    descontos: { months: [], values: [] },
    produtosBar: { names: [], current: [], previous: [] },
  };
}

export const formatMoeda = (val: string | number | undefined) => {
  if (val === undefined || val === null) return "R$ 0,00";
  const num = typeof val === "string" ? parseFloat(val) : val;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
};

export const formatarLabel = (tipo: string) =>
  tipo.charAt(0).toUpperCase() + tipo.slice(1);

export function mapIcon(tipo: string): string {
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

export function formatarResumoCompras(data?: PurchasingStats): SummaryItem[] {
  if (!data) return [];
  return [
    { label: "Total Mês", value: formatMoeda(data.total) },
    { label: "Líquido", value: formatMoeda(data.liquido) },
    { label: "Preço Médio", value: formatMoeda(data.preco_medio) },
    { label: "Descontos", value: formatMoeda(data.desconto) },
  ];
}

export function formatarResumoComprasAnterior(data?: any): SummaryItem[] {
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

export function transformPieData(apiData: any) {
  const pieRaw = apiData.ocorrencias12Meses?.data?.[0];
  return pieRaw
    ? [
        {
          value: Number(pieRaw.atendimento_ok),
          name: "Finalizado",
        },
        {
          value: Number(pieRaw.atendimento_acompanhamento),
          name: "Em Acompanhamento",
        },
        {
          value: Number(pieRaw.atendimento_pendente),
          name: "Pendente",
        },
        {
          value: Number(pieRaw.atendimento_vencido),
          name: "Vencido",
        },
      ]
    : [];
}

export function transformLineData(apiData: any) {
  const lineRaw = apiData.ocorrencias6Meses?.data ?? [];
  return {
    months: lineRaw.map((i: any) => i.mes_ano),
    values: lineRaw.map((i: any) => i.count),
  };
}

export function transformMetaData(apiData: any) {
  const metaRaw = apiData.metaDiaria?.data ?? [];
  return {
    days: metaRaw.map((i: any) =>
      new Date(i.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })
    ),
    values: metaRaw.map((i: any) => Number(i.sum)),
  };
}

export function transformDescData(apiData: any) {
  const descRaw = apiData.totalDescontos?.data ?? [];
  return {
    months: descRaw.map((i: any) => i.mes),
    values: descRaw.map((i: any) => i.desconto),
  };
}

export function transformProdutosData(apiData: any) {
  const raw = apiData.prodsMaisCompradosMes?.data ?? [];
  return {
    names: raw.slice(0, 10).map((p: any) => p.produto ?? "Produto Desc."),
    current: raw.slice(0, 10).map((p: any) => Number(p.mes_atual)),
    previous: raw.slice(0, 10).map((p: any) => Number(p.mes_anterior)),
  };
}
