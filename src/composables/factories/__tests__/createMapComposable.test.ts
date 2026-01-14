/**
 * Testes focados para createMapComposable
 *
 * NOTA: Este projeto nao possui vitest configurado.
 * Estes testes estao escritos no formato vitest para futura configuracao.
 * Para executar, instale vitest e configure conforme necessario.
 *
 * npm install -D vitest @vue/test-utils
 */

import { describe, it, expect, vi } from "vitest";
import { ref, nextTick } from "vue";

import {
  createMapComposable,
  temCoordenadasValidas,
  type ItemComCoordenadasBase,
} from "../createMapComposable";

// =============================================================================
// MOCKS E FIXTURES
// =============================================================================

interface MockParceiro extends ItemComCoordenadasBase {
  id: string;
  nome: string;
  status?: string;
}

const createMockParceiro = (
  id: string,
  hasCoords: boolean,
  status = "ativo",
): MockParceiro => ({
  id,
  nome: `Parceiro ${id}`,
  status,
  latlong: hasCoords,
  latitude: hasCoords ? "-23.5505" : null,
  longitude: hasCoords ? "-46.6333" : null,
});

const MOCK_STATUS_CONFIG = {
  ativo: { color: "#10b981", label: "Ativo" },
  inativo: { color: "#ef4444", label: "Inativo" },
};

// =============================================================================
// TESTES
// =============================================================================

describe("createMapComposable", () => {
  describe("com configuracao padrao", () => {
    it("deve filtrar items sem coordenadas e converter para pontos", async () => {
      // Arrange
      const items = ref<MockParceiro[]>([
        createMockParceiro("1", true),
        createMockParceiro("2", false), // sem coordenadas
        createMockParceiro("3", true),
      ]);

      const itemToPonto = vi.fn((item: MockParceiro) => ({
        id: item.id,
        titulo: item.nome,
        status: item.status,
        latitude: item.latitude!,
        longitude: item.longitude!,
        linhas: [],
      }));

      // Act
      const { pontos, statusConfig } = createMapComposable({
        items,
        statusConfig: MOCK_STATUS_CONFIG,
        itemToPonto,
      });

      // Assert
      expect(pontos.value).toHaveLength(2);
      expect(pontos.value[0].id).toBe("1");
      expect(pontos.value[1].id).toBe("3");
      expect(itemToPonto).toHaveBeenCalledTimes(2);
      expect(statusConfig).toEqual(MOCK_STATUS_CONFIG);
    });

    it("deve atualizar pontos quando items mudam", async () => {
      // Arrange
      const items = ref<MockParceiro[]>([createMockParceiro("1", true)]);

      const { pontos } = createMapComposable({
        items,
        itemToPonto: (item) => ({
          id: item.id,
          titulo: item.nome,
          latitude: item.latitude!,
          longitude: item.longitude!,
          linhas: [],
        }),
      });

      // Assert inicial
      expect(pontos.value).toHaveLength(1);

      // Act - adicionar item
      items.value = [...items.value, createMockParceiro("2", true)];
      await nextTick();

      // Assert
      expect(pontos.value).toHaveLength(2);
    });
  });

  describe("sem statusConfig", () => {
    it("deve usar objeto vazio como statusConfig padrao", () => {
      // Arrange
      const items = ref<MockParceiro[]>([]);

      // Act
      const { statusConfig } = createMapComposable({
        items,
        itemToPonto: () => ({ id: "", titulo: "", latitude: "", longitude: "", linhas: [] }),
      });

      // Assert
      expect(statusConfig).toEqual({});
    });
  });
});

describe("temCoordenadasValidas", () => {
  it("deve retornar true para item com coordenadas validas", () => {
    const item = createMockParceiro("1", true);
    expect(temCoordenadasValidas(item)).toBe(true);
  });

  it("deve retornar false para item sem latlong", () => {
    const item = { ...createMockParceiro("1", true), latlong: false };
    expect(temCoordenadasValidas(item)).toBe(false);
  });

  it("deve retornar false para item sem latitude", () => {
    const item = { ...createMockParceiro("1", true), latitude: null };
    expect(temCoordenadasValidas(item)).toBe(false);
  });

  it("deve retornar false para item com latitude vazia", () => {
    const item = { ...createMockParceiro("1", true), latitude: "" };
    expect(temCoordenadasValidas(item)).toBe(false);
  });
});
