/**
 * UI Constants - Constantes compartilhadas de interface do usuário
 */

// =============================================================================
// VIEW MODE
// =============================================================================

export const VIEW_MODE_OPTIONS = [
  { label: "Lista", value: "list", icon: "List" },
  { label: "Mapa", value: "map", icon: "Map" },
] as const;

export type ViewMode = "list" | "map";
