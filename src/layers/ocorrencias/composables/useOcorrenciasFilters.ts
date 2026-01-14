import { createFilterComposable } from "~/composables/factories/createFilterComposable";
import { FILTROS_PADRAO, SITUACAO_OPTIONS, STATUS_OPTIONS } from "../constants/ocorrencia.constants";

import type { FilterBadge } from "~/components/ui/UiFilterBadges.vue";

/**
 * Composable para gerenciar filtros de ocorrências
 */
export const useOcorrenciasFilters = () => {
  return createFilterComposable({
    defaults: FILTROS_PADRAO,
    fields: [
      { key: "atendente", label: "Atendente", default: "" },
      { key: "situacao", label: "Situação", default: "" },
      { key: "status", default: "", badgeVariant: "primary" },
      { key: "formaAtendimento", default: "" },
      { key: "ordenarPor", default: "data_desc" },
    ],
    createBadge: (key, value): FilterBadge | null => {
      if (key === "situacao" && value) {
        const situacaoOption = SITUACAO_OPTIONS.find((s) => s.value === value);
        return {
          key: "situacao",
          label: "Situação",
          value: situacaoOption?.label || String(value),
        };
      }
      if (key === "status" && value) {
        const statusOption = STATUS_OPTIONS.find((s) => s.value === value);
        return {
          key: "status",
          value: statusOption?.label || String(value),
          variant: "primary",
        };
      }
      return null;
    },
  });
};
