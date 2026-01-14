/**
 * Tests for useParceiroTabs composable
 *
 * These tests verify tab navigation and data building functionality.
 */

import { describe, it, expect } from 'vitest';
import { ref, computed } from 'vue';
import { useParceiroTabs } from '../useParceiroTabs';
import type { ParceiroData } from '~/shared/schemas/parceiro.schema';
import type { ParceiroVariant } from '~/components/ui/ui.types';

describe('useParceiroTabs', () => {
  it('should initialize with correct tab for parceiro variant', () => {
    const propsRef = computed(() => ({
      modelValue: true,
      parceiro: null,
      variant: 'parceiro' as ParceiroVariant,
    }));

    const { activeTab, tabs } = useParceiroTabs(propsRef);

    expect(activeTab.value).toBe('atendimentos');
    expect(tabs.value.length).toBeGreaterThan(0);
  });

  it('should initialize with agendamentos tab for atendente variant', () => {
    const propsRef = computed(() => ({
      modelValue: true,
      parceiro: null,
      variant: 'atendente' as ParceiroVariant,
    }));

    const { activeTab, tabs } = useParceiroTabs(propsRef);

    expect(activeTab.value).toBe('agendamentos');
    expect(tabs.value.some((t) => t.id === 'agendamentos')).toBe(true);
  });

  it('should filter tabs correctly for atendente variant', () => {
    const propsRef = computed(() => ({
      modelValue: true,
      parceiro: null,
      variant: 'atendente' as ParceiroVariant,
    }));

    const { tabs } = useParceiroTabs(propsRef);

    const tabIds = tabs.value.map((t) => t.id);
    expect(tabIds).toContain('agendamentos');
    expect(tabIds).toContain('atendimentos');
    expect(tabIds).toContain('checkins');
    expect(tabIds.length).toBe(3);
  });

  it('should detect inactive parceiro correctly', () => {
    const propsRef = computed(() => ({
      modelValue: true,
      parceiro: {
        codfor: '123',
        status: 'Inativo',
      } as ParceiroData,
      variant: 'parceiro' as ParceiroVariant,
    }));

    const { isInactive } = useParceiroTabs(propsRef);

    expect(isInactive.value).toBe(true);
  });

  it('should build cadastro items from parceiro data', () => {
    const propsRef = computed(() => ({
      modelValue: true,
      parceiro: {
        codfor: '123',
        fornecedor: 'Test Fornecedor',
        cidade: 'São Paulo',
        uf: 'SP',
        status: 'Ativo',
      } as ParceiroData,
      variant: 'parceiro' as ParceiroVariant,
    }));

    const { itemsMap } = useParceiroTabs(propsRef);

    const cadastroItems = itemsMap.value.cadastro;
    expect(cadastroItems.length).toBeGreaterThan(0);
    expect(cadastroItems[0].title).toContain('Test Fornecedor');
  });
});
