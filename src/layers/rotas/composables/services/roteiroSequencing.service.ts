import { logger } from "~/utils/logger";

const LOG_PREFIX = "[RoteiroSequencingService]";
const TEMP_SEQUENCE_BASE = 10000;

const logDebug = (...args: unknown[]) => logger.debug(LOG_PREFIX, ...args);
const logError = (...args: unknown[]) => logger.error(LOG_PREFIX, ...args);

/**
 * Serviço para lógica de sequenciamento e reordenação de roteiros.
 * Responsabilidade: manipulação de sequências sem estado (funções puras).
 */
export class RoteiroSequencingService {
  /**
   * Atualiza a sequência de um único roteiro na lista.
   * Função pura - retorna nova lista sem modificar a original.
   */
  updateRoteiroSequencia<T extends { id: number; sequencia: number }>(
    roteiros: T[],
    roteiroId: number,
    novaSequencia: number,
  ): T[] {
    const roteiroIndex = roteiros.findIndex((r) => r.id === roteiroId);

    if (roteiroIndex === -1) {
      logError(`Roteiro ${roteiroId} não encontrado na lista`);
      return roteiros;
    }

    const roteiroAlvo = roteiros[roteiroIndex];
    const sequenciaAntiga = roteiroAlvo.sequencia;

    if (sequenciaAntiga === novaSequencia) {
      return roteiros;
    }

    const novaLista = [...roteiros];
    novaLista[roteiroIndex] = { ...roteiroAlvo, sequencia: novaSequencia };

    // Reajusta sequências dos outros roteiros
    const direcao = novaSequencia < sequenciaAntiga ? 1 : -1;

    novaLista.forEach((roteiro) => {
      if (roteiro.id === roteiroId) return;

      const sequenciaEstaNoRange =
        direcao === 1
          ? roteiro.sequencia >= novaSequencia && roteiro.sequencia < sequenciaAntiga
          : roteiro.sequencia > sequenciaAntiga && roteiro.sequencia <= novaSequencia;

      if (sequenciaEstaNoRange) {
        roteiro.sequencia += direcao;
      }
    });

    logDebug(
      `Roteiro ${roteiroId}: sequência ${sequenciaAntiga} -> ${novaSequencia}`,
    );

    return novaLista;
  }

  /**
   * Gera lista de operações para reordenar múltiplos roteiros.
   * Retorna lista de pares [id, novaSequencia] para executar na API.
   *
   * Estratégia: usar sequências temporárias altas para evitar conflitos
   * 1. Primeiro move todos para sequências temporárias (10000+)
   * 2. Depois move para as sequências finais
   */
  gerarOperacoesReordenacao(
    roteiros: Array<{ id: number; sequencia: number }>,
  ): { tempOps: Array<{ id: number; sequencia: number }>; finalOps: Array<{ id: number; sequencia: number }> } {
    const tempOps = roteiros.map((roteiro, index) => ({
      id: roteiro.id,
      sequencia: TEMP_SEQUENCE_BASE + index,
    }));

    const finalOps = roteiros.map((roteiro) => ({
      id: roteiro.id,
      sequencia: roteiro.sequencia,
    }));

    return { tempOps, finalOps };
  }

  /**
   * Reordena lista de roteiros localmente (sem chamar API).
   * Função pura - retorna nova lista ordenada.
   */
  reordenarRoteirosLocal<T extends { sequencia: number }>(roteiros: T[]): T[] {
    return [...roteiros].sort((a, b) => a.sequencia - b.sequencia);
  }
}
