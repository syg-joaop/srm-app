/**
 * Tests for useParceiroDetalhesData composable
 *
 * These tests verify the critical functionality of loading and enriching
 * parceiro details data.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, computed } from 'vue';
import { useParceiroDetalhesData } from '../useParceiroDetalhesData';
import type { ParceiroData } from '~/shared/schemas/parceiro.schema';

describe('useParceiroDetalhesData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should correctly identify prospecto based on tf field', () => {
    const parceiro = ref<ParceiroData | null>({
      codfor: '123',
      tf: 'PRO-001',
    } as ParceiroData);

    const { isProspecto, isFornecedor } = useParceiroDetalhesData(() => parceiro.value);

    expect(isProspecto.value).toBe(true);
    expect(isFornecedor.value).toBe(false);
  });

  it('should correctly identify fornecedor when tf does not start with PRO', () => {
    const parceiro = ref<ParceiroData | null>({
      codfor: '456',
      tf: 'FOR-001',
    } as ParceiroData);

    const { isProspecto, isFornecedor } = useParceiroDetalhesData(() => parceiro.value);

    expect(isProspecto.value).toBe(false);
    expect(isFornecedor.value).toBe(true);
  });

  it('should enrich parceiro with loaded details', () => {
    const parceiro = ref<ParceiroData | null>({
      codfor: '789',
      name: 'Test Parceiro',
    } as ParceiroData);

    const { enrichParceiroWithDetalhes, detalhesData } = useParceiroDetalhesData(
      () => parceiro.value
    );

    // Simulate loaded details
    detalhesData.value = {
      contatos: [{ nome: 'Contact 1' }] as any,
      cargas: [{ boleto: '123' }] as any,
    };

    const enriched = enrichParceiroWithDetalhes(parceiro.value);

    expect(enriched).toMatchObject({
      codfor: '789',
      name: 'Test Parceiro',
      contatos: [{ nome: 'Contact 1' }],
      cargas: [{ boleto: '123' }],
    });
  });

  it('should return null when enriching null parceiro', () => {
    const parceiro = ref<ParceiroData | null>(null);

    const { enrichParceiroWithDetalhes } = useParceiroDetalhesData(() => parceiro.value);

    const result = enrichParceiroWithDetalhes(null);

    expect(result).toBeNull();
  });

  it('should clear details when clearDetalhes is called', () => {
    const parceiro = ref<ParceiroData | null>({
      codfor: '999',
    } as ParceiroData);

    const { clearDetalhes, detalhesData, error } = useParceiroDetalhesData(
      () => parceiro.value
    );

    // Set some data
    detalhesData.value = {
      contatos: [{ nome: 'Test' }] as any,
    };
    error.value = 'Some error';

    clearDetalhes();

    expect(detalhesData.value).toEqual({});
    expect(error.value).toBeNull();
  });
});
