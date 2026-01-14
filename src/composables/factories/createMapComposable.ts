/**
 * Factory para criar composables de mapa com funcionalidades padronizadas.
 *
 * Elimina duplicacao entre useFornecedoresMap e useProspectosMap,
 * parametrizando a logica comum de conversao de entidades para pontos de mapa.
 *
 * @example
 * ```ts
 * export function useFornecedoresMap(fornecedores: Ref<Fornecedor[] | undefined>) {
 *   return createMapComposable({
 *     items: fornecedores,
 *     statusConfig: COMMON_MAP_STATUS_CONFIG,
 *     itemToPonto: (item) => ({
 *       id: item.fornecedor ?? "",
 *       titulo: item.fornecedor ?? "",
 *       subtitulo: item.fanta,
 *       status: item.status,
 *       latitude: item.latitude,
 *       longitude: item.longitude,
 *       linhas: [
 *         { rotulo: "Cidade", valor: item.cidade ?? "" },
 *         { rotulo: "Ultima carga", valor: item.ultima_carga ?? "" },
 *       ],
 *     }),
 *   });
 * }
 * ```
 */

import type { UiMapaPonto, UiMapaStatusConfig } from "~/components/ui/maps.types";

// =============================================================================
// TIPOS
// =============================================================================

/**
 * Item base que deve ter campos de coordenadas para ser mapeavel.
 */
interface ItemComCoordenadasBase {
  latlong?: boolean | string | null;
  latitude?: string | null;
  longitude?: string | null;
}

/**
 * Item com coordenadas validadas (type guard garante estes campos).
 */
type ItemComCoordenadasValidas<T extends ItemComCoordenadasBase> = T & {
  latitude: string;
  longitude: string;
};

/**
 * Funcao que converte um item com coordenadas validas em um ponto do mapa.
 */
type ItemToPontoFn<T extends ItemComCoordenadasBase> = (
  item: ItemComCoordenadasValidas<T>,
) => UiMapaPonto;

/**
 * Configuracao para criar um composable de mapa.
 */
interface MapComposableConfig<T extends ItemComCoordenadasBase> {
  /** Ref com array de items a serem mapeados */
  items: Ref<T[] | undefined>;

  /** Configuracao de cores e labels por status */
  statusConfig?: UiMapaStatusConfig;

  /** Funcao que converte um item em ponto do mapa */
  itemToPonto: ItemToPontoFn<T>;
}

/**
 * Retorno do composable de mapa.
 */
interface MapComposableReturn {
  /** Configuracao de status para o mapa */
  statusConfig: UiMapaStatusConfig;

  /** Array computado de pontos do mapa */
  pontos: ComputedRef<UiMapaPonto[]>;
}

// =============================================================================
// FACTORY
// =============================================================================

/**
 * Cria um composable de mapa com logica padronizada de conversao.
 *
 * @param config - Configuracao do composable
 * @returns Objeto com statusConfig e pontos computados
 */
export function createMapComposable<T extends ItemComCoordenadasBase>(
  config: MapComposableConfig<T>,
): MapComposableReturn {
  const statusConfig = config.statusConfig ?? {};

  const pontos = computed<UiMapaPonto[]>(() => {
    const items = config.items.value ?? [];

    return items.filter(temCoordenadasValidas).map(config.itemToPonto);
  });

  return {
    statusConfig,
    pontos,
  };
}

// =============================================================================
// FUNCOES AUXILIARES
// =============================================================================

/**
 * Type guard que verifica se um item possui coordenadas validas.
 * Centraliza a logica de validacao que antes estava duplicada.
 *
 * @param item - Item a ser verificado
 * @returns True se o item possui coordenadas validas
 */
function temCoordenadasValidas<T extends ItemComCoordenadasBase>(
  item: T,
): item is ItemComCoordenadasValidas<T> {
  if (!item.latlong) return false;
  if (typeof item.latitude !== "string") return false;
  if (typeof item.longitude !== "string") return false;
  if (!item.latitude || !item.longitude) return false;

  return true;
}

// Exporta para uso externo se necessario
export { temCoordenadasValidas };
export type {
  ItemComCoordenadasBase,
  ItemComCoordenadasValidas,
  ItemToPontoFn,
  MapComposableConfig,
  MapComposableReturn,
};
