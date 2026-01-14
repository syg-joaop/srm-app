/**
 * Factory para criar composables de filtro com funcionalidades padronizadas.
 *
 *
 * @example
 * ```ts
 * export const useFornecedoresFilters = () => {
 *   return createFilterComposable({
 *     defaults: FILTROS_PADRAO,
 *     fields: [
 *       { key: "fantasia", label: "Fantasia", default: "" },
 *       { key: "status", default: "todos", badgeVariant: "primary" },
 *     ],
 *   });
 * };
 * ```
 */

import type { FilterBadge } from "~/components/ui/UiFilterBadges.vue";

type FilterField = {
  key: string;
  label?: string;
  default: string | number;
  badgeVariant?: "default" | "primary";
};

type FilterConfig<T> = {
  defaults: T;
  fields: FilterField[];
  createBadge?: (key: string, value: unknown) => FilterBadge | null;
};

export const createFilterComposable = <T extends Record<string, unknown>>(
  config: FilterConfig<T>,
) => {
  const search = ref("");
  const showFilters = ref(false);
  const filters = ref<T>({ ...config.defaults });

  const totalFiltrosAtivos = computed(
    () =>
      Object.entries(filters.value).filter(
        ([key, value]) => value !== config.defaults[key as keyof T],
      ).length,
  );

  const hasActiveFilters = computed(() => search.value || totalFiltrosAtivos.value > 0);

  const filterBadges = computed<FilterBadge[]>(() => {
    const badges: FilterBadge[] = [];

    if (search.value) {
      badges.push({ key: "search", label: "Busca", value: search.value });
    }

    config.fields.forEach((field) => {
      const value = filters.value[field.key];
      if (value !== field.default) {
        if (config.createBadge) {
          const badge = config.createBadge(field.key, value);
          if (badge) badges.push(badge);
        } else {
          badges.push({
            key: field.key,
            label: field.label,
            value: String(value),
            variant: field.badgeVariant,
          });
        }
      }
    });

    return badges;
  });

  const resetMap = config.fields.reduce(
    (map, field) => {
      map[field.key] = () => {
        filters.value[field.key as keyof T] = field.default as T[keyof T];
      };
      return map;
    },
    { search: () => (search.value = "") } as Record<string, () => void>,
  );

  const removeFilter = (key: string) => resetMap[key]?.();

  const clearAllFilters = () => {
    search.value = "";
    Object.assign(filters.value, config.defaults);
  };

  const apiFilters = computed(() => ({
    search: search.value,
    ...filters.value,
  }));

  return {
    search,
    filters,
    showFilters,
    totalFiltrosAtivos,
    hasActiveFilters,
    filterBadges,
    apiFilters,
    removeFilter,
    clearAllFilters,
  };
};
