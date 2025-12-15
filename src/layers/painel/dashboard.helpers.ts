import type { SummaryItem, ChartData, PurchasingStats } from "./dashboard.types";
import { formatarMoeda } from "~/utils/formatters/formatadores";

export function emptyChartData(): ChartData {
  return {
    ocorrenciasPie: [],
    ocorrenciasLine: { months: [], values: [] },
    metaDiaria: { days: [], values: [] },
    descontos: { months: [], values: [] },
    produtosBar: { names: [], current: [], previous: [] },
  };
}

export const formatarLabel = (tipo: string) => tipo.charAt(0).toUpperCase() + tipo.slice(1);

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
  const key = Object.keys(map).find((k) => k.toLowerCase() === tipo.toLowerCase());
  return key ? map[key] : "Info";
}

export function formatarResumoCompras(data?: PurchasingStats): SummaryItem[] {
  if (!data) return [];
  return [
    { label: "Total Mês", value: formatarMoeda(data.total) },
    { label: "Líquido", value: formatarMoeda(data.liquido) },
    { label: "Preço Médio", value: formatarMoeda(data.preco_medio) },
    { label: "Descontos", value: formatarMoeda(data.desconto) },
  ];
}

export function formatarResumoComprasAnterior(data?: any): SummaryItem[] {
  if (!data) return [];
  return [
    { label: "Total Mês", value: formatarMoeda(data.total_anterior ?? 0) },
    {
      label: "Preço Médio",
      value: formatarMoeda(data.preco_medio_anterior ?? 0),
    },
    {
      label: "Média Diária",
      value: formatarMoeda(data.media_diaria_anterior ?? 0),
    },
    { label: "Descontos", value: formatarMoeda(data.desconto_anterior ?? 0) },
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
    days: metaRaw.map((i: any) => {
      if (!i.data) return "";
      const parts = i.data.split("/");
      return parts.length === 3 ? `${parts[0]}/${parts[1]}` : i.data;
    }),
    values: metaRaw.map((i: any) => Number(i.peso)),
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
