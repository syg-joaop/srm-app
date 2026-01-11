/**
 * Funções utilitárias diversas para processamento de parceiros.
 */

import { ALL_TABS } from "./config";

import type { ParceiroData, ParceiroTabOption, ParceiroVariant, TabId } from "~/types/parceiro";
/**
 * Filtra as tabs disponíveis baseado na variante do parceiro.
 * @param variant - Variante do parceiro
 * @returns Array de opções de tabs filtradas
 */
export const filterTabs = (variant: ParceiroVariant): ParceiroTabOption[] => {
  if (variant === "atendente" || variant === "time") {
    return ALL_TABS.filter((t) => ["agendamentos", "atendimentos", "checkins"].includes(t.id));
  }
  return ALL_TABS.filter((t) => t.id !== "agendamentos");
};

/**
 * Retorna a tab inicial baseado na variante do parceiro.
 * @param variant - Variante do parceiro
 * @returns ID da tab inicial
 */
export const getInitialTab = (variant: ParceiroVariant): TabId => {
  if (variant === "atendente" || variant === "time") {
    return "agendamentos";
  }
  return "atendimentos";
};

/**
 * Verifica se um parceiro está inativo.
 * @param parceiro - Dados do parceiro
 * @returns true se o parceiro estiver inativo
 */
export const isParceiroInactive = (parceiro: ParceiroData | null): boolean => {
  return (parceiro?.status || "").toLowerCase().trim() === "inativo";
};

/**
 * Retorna o label de uma tab pelo seu ID.
 * @param tabId - ID da tab
 * @returns Label da tab ou string vazia se não encontrada
 */
export const getTabLabel = (tabId: TabId): string => {
  return ALL_TABS.find((t) => t.id === tabId)?.label || "";
};

/**
 * Retorna uma label formatada para contagem de itens.
 * @param count - Número de itens
 * @returns String formatada ("1 item" ou "N itens")
 */
export const getCountLabel = (count: number): string => {
  return count === 1 ? "1 item" : `${count} itens`;
};


