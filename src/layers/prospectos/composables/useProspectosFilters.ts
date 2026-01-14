import { createFilterComposable } from "~/composables/factories/createFilterComposable";
import { FILTROS_PADRAO, STATUS_OPTIONS } from "../constants/prospecto.constants";

import type { FilterBadge } from "~/components/ui/UiFilterBadges.vue";

/**
 * Composable para gerenciar filtros de prospectos
 */
export const useProspectosFilters = () => {
  return createFilterComposable({
    defaults: FILTROS_PADRAO,
    fields: [
      { key: "fantasia", label: "Fantasia", default: "" },
      { key: "cidade", label: "Cidade", default: "" },
      { key: "status", default: "todos", badgeVariant: "primary" },
      { key: "sortBy", default: "prospecto" },
    ],
    createBadge: (key, value): FilterBadge | null => {
      if (key === "status" && value !== "todos") {
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
