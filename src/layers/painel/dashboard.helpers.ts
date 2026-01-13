import { formatarMoeda } from "~/utils/formatters/formatadores";

import { getIconByTipo } from "./constants/painel.constants";

import type { DashboardData } from "./schemas/dashboard.schema";
import type { ChartData, ComprasMesItem, SummaryItem } from "./schemas/ui.schema";

export const EMPTY_CHART_DATA: ChartData = {
  ocorrenciasPie: [],
  ocorrenciasLine: { months: [], values: [] },
  metaDiaria: { days: [], values: [] },
  descontos: { months: [], values: [] },
  produtosBar: { names: [], current: [], previous: [] },
};

export const formatarLabel = (tipo: string) => tipo.charAt(0).toUpperCase() + tipo.slice(1);

/**
 * @deprecated Use getIconByTipo from constants/painel.constants.ts
 */
export const mapIcon = getIconByTipo;

export function formatarResumoCompras(data: ComprasMesItem): SummaryItem[] {
  return [
    { label: "Total Mês", value: formatarMoeda(data.total) },
    { label: "Líquido", value: formatarMoeda(data.liquido) },
    { label: "Preço Médio", value: formatarMoeda(data.preco_medio) },
    { label: "Descontos", value: formatarMoeda(data.desconto) },
  ];
}

export function transformPieData(apiData: DashboardData) {
  const pieRaw = apiData.ocorrencias12Meses.data[0];
  return [
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
  ];
}

export function transformLineData(apiData: DashboardData) {
  const lineRaw = apiData.ocorrencias6Meses.data;
  return {
    months: lineRaw.map((i: { mes_ano: string }) => i.mes_ano),
    values: lineRaw.map((i: { count: number }) => i.count),
  };
}

export function transformMetaData(apiData: DashboardData) {
  const metaRaw = apiData.metaDiaria.data;
  return {
    days: metaRaw.map((i: { data: string }) => {
      if (!i.data) return "";
      const parts = i.data.split("/");
      return parts.length === 3 ? `${parts[0]}/${parts[1]}` : i.data;
    }),
    values: metaRaw.map((i: { peso: string }) => Number(i.peso)),
  };
}

export function transformDescData(apiData: DashboardData) {
  const descRaw = apiData.totalDescontos.data;
  return {
    months: descRaw.map((i: { mes: string }) => i.mes),
    values: descRaw.map((i: { desconto: number }) => i.desconto),
  };
}

export function transformProdutosData(apiData: DashboardData) {
  const raw = apiData.prodsMaisCompradosMes.data;
  return {
    names: raw.slice(0, 10).map((p: { produto: string | null }) => p.produto ?? "Produto Desc."),
    current: raw.slice(0, 10).map((p: { mes_atual: string }) => Number(p.mes_atual)),
    previous: raw.slice(0, 10).map((p: { mes_anterior: string }) => Number(p.mes_anterior)),
  };
}
