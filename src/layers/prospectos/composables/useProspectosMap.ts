import { z } from "zod";

import { COMMON_MAP_STATUS_CONFIG } from "~/components/ui/utils/status";

import { MAP_STATUS_CONFIG } from "../constants/prospecto.constants";
import { prospectoItemSchema } from "../schemas/prospectos.schema";

import type { UiMapaPonto } from "~/components/ui/maps.types";

type Prospecto = z.infer<typeof prospectoItemSchema>;

/**
 * Composable para converter prospectos em pontos do mapa
 *
 * Encapsula a lógica de transformação e configuração do mapa.
 */
export function useProspectosMap(prospectos: Ref<Prospecto[] | undefined>) {
  // Merge config padrão com status específico de prospectos (novo)
  const statusConfig = {
    ...COMMON_MAP_STATUS_CONFIG,
    ...MAP_STATUS_CONFIG,
  };

  // Filtra prospectos com coordenadas válidas e transforma em pontos
  const pontosProspectos = computed<UiMapaPonto[]>(() => {
    const items = prospectos.value ?? [];

    return items.filter(temCoordenadasValidas).map(prospectoParaPonto);
  });

  return {
    statusConfig,
    pontosProspectos,
  };
}

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

type ProspectoComCoordenadas = Prospecto & {
  latitude: string;
  longitude: string;
};

function temCoordenadasValidas(prospecto: Prospecto): prospecto is ProspectoComCoordenadas {
  if (!prospecto.latlong) return false;
  if (typeof prospecto.latitude !== "string") return false;
  if (typeof prospecto.longitude !== "string") return false;
  if (!prospecto.latitude || !prospecto.longitude) return false;

  return true;
}

function prospectoParaPonto(prospecto: ProspectoComCoordenadas): UiMapaPonto {
  return {
    id: prospecto.fornecedor ?? "",
    titulo: prospecto.fornecedor ?? "",
    subtitulo: prospecto.fanta,
    status: prospecto.status,
    latitude: prospecto.latitude,
    longitude: prospecto.longitude,
    linhas: [
      { rotulo: "Nome", valor: prospecto.fornecedor ?? "" },
      { rotulo: "Cidade", valor: prospecto.cidade ?? "" },
      { rotulo: "Última carga", valor: prospecto.ultima_carga ?? "Nenhuma" },
    ],
  };
}
