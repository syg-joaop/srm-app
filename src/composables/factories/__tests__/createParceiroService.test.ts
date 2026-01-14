/**
 * Testes focados para createParceiroService
 *
 * NOTA: Este projeto nao possui vitest configurado.
 * Estes testes estao escritos no formato vitest para futura configuracao.
 * Para executar, instale vitest e configure conforme necessario.
 *
 * npm install -D vitest @vue/test-utils
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

import { createParceiroService, createParceiroServiceTyped } from "../createParceiroService";

// =============================================================================
// MOCKS
// =============================================================================

// Mock do useHttpClient
const mockPost = vi.fn();
vi.mock("~/composables/http/useHttpClient", () => ({
  useHttpClient: () => ({
    post: mockPost,
  }),
}));

// Mock de createListService para isolar os testes
vi.mock("../createListService", () => ({
  createListService: vi.fn((endpoint: string) => ({
    fetchList: vi.fn(async (page = 1, size = 50, filters = {}) => ({
      endpoint,
      page,
      size,
      filters,
      data: [],
    })),
  })),
}));

// =============================================================================
// TIPOS PARA TESTES
// =============================================================================

interface MockResponse {
  data: { id: string; nome: string }[];
  total: number;
}

interface MockFilters {
  status?: string;
  search?: string;
}

// =============================================================================
// TESTES
// =============================================================================

describe("createParceiroService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("com configuracao de fornecedor", () => {
    it("deve criar service com metodo nomeado corretamente", () => {
      // Act
      const service = createParceiroService<MockResponse, MockFilters>({
        endpoint: "/sygecom/chameleon-mode/SRM_GET_FORNECEDORES",
        fetchMethodName: "fetchFornecedor",
      });

      // Assert
      expect(service).toHaveProperty("fetchFornecedor");
      expect(typeof service.fetchFornecedor).toBe("function");
    });

    it("deve chamar fetchList com parametros corretos", async () => {
      // Arrange
      const service = createParceiroService<MockResponse, MockFilters>({
        endpoint: "/sygecom/chameleon-mode/SRM_GET_FORNECEDORES",
        fetchMethodName: "fetchFornecedor",
      });

      // Act
      const result = await service.fetchFornecedor(2, 100, { status: "ativo" });

      // Assert
      expect(result).toBeDefined();
      expect(result.page).toBe(2);
      expect(result.size).toBe(100);
      expect(result.filters).toEqual({ status: "ativo" });
    });
  });

  describe("com configuracao de prospecto", () => {
    it("deve criar service com nome diferente", () => {
      // Act
      const service = createParceiroService<MockResponse, MockFilters>({
        endpoint: "/sygecom/chameleon-mode/SRM_GET_PROSPECTO",
        fetchMethodName: "fetchProspectos",
      });

      // Assert
      expect(service).toHaveProperty("fetchProspectos");
      expect(service).not.toHaveProperty("fetchFornecedor");
    });
  });
});

describe("createParceiroServiceTyped", () => {
  it("deve criar service com metodo fetchParceiro", () => {
    // Act
    const service = createParceiroServiceTyped<MockResponse, MockFilters>(
      "/sygecom/chameleon-mode/SRM_GET_FORNECEDORES",
    );

    // Assert
    expect(service).toHaveProperty("fetchParceiro");
    expect(typeof service.fetchParceiro).toBe("function");
  });
});
