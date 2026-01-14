import { createFilterComposable } from "~/composables/factories/createFilterComposable";
import { FILTROS_PADRAO } from "../constants/fornecedor.constants";

/**
 * Composable para gerenciar filtros de fornecedores
 */
export const useFornecedoresFilters = () => {
  return createFilterComposable({
    defaults: FILTROS_PADRAO,
    fields: [
      { key: "fantasia", label: "Fantasia", default: "" },
      { key: "cidade", label: "Cidade", default: "" },
      { key: "status", default: "todos", badgeVariant: "primary" },
      { key: "sortBy", default: "fornecedor" },
    ],
  });
};
