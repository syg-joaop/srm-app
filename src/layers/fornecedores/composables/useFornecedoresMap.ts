import { z } from "zod";

import { COMMON_MAP_STATUS_CONFIG } from "~/components/ui/utils/status";

import { fornecedorItemSchema } from "../schemas/fornecedores.schema";

import type { UiMapaPonto } from "~/components/ui/maps.types";

type Fornecedor = z.infer<typeof fornecedorItemSchema>;

/**
 * Composable para converter fornecedores em pontos do mapa
 *
 * Encapsula a lógica de transformação e configuração do mapa.
 */
export function useFornecedoresMap(fornecedores: Ref<Fornecedor[] | undefined>) {
  const statusConfig = { ...COMMON_MAP_STATUS_CONFIG };

  // Filtra fornecedores com coordenadas válidas e transforma em pontos
  const pontosFornecedores = computed<UiMapaPonto[]>(() => {
    const items = fornecedores.value ?? [];

    return items.filter(temCoordenadasValidas).map(fornecedorParaPonto);
  });

  return {
    statusConfig,
    pontosFornecedores,
  };
}

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

type FornecedorComCoordenadas = Fornecedor & {
  latitude: string;
  longitude: string;
};

function temCoordenadasValidas(fornecedor: Fornecedor): fornecedor is FornecedorComCoordenadas {
  if (!fornecedor.latlong) return false;
  if (typeof fornecedor.latitude !== "string") return false;
  if (typeof fornecedor.longitude !== "string") return false;
  if (!fornecedor.latitude || !fornecedor.longitude) return false;

  return true;
}

function fornecedorParaPonto(fornecedor: FornecedorComCoordenadas): UiMapaPonto {
  return {
    id: fornecedor.fornecedor ?? "",
    titulo: fornecedor.fornecedor ?? "",
    subtitulo: fornecedor.fanta,
    status: fornecedor.status,
    latitude: fornecedor.latitude,
    longitude: fornecedor.longitude,
    linhas: [
      { rotulo: "Cidade", valor: fornecedor.cidade ?? "" },
      { rotulo: "Última carga", valor: fornecedor.ultima_carga ?? "" },
    ],
  };
}
