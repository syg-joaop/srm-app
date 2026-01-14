/**
 * Tests for parceiro helper functions
 *
 * These tests verify critical helper functions for data normalization
 * and formatting.
 */

import { describe, it, expect } from 'vitest';
import { normalize, formatDetailValue, toLabel } from '../helpers/normalizers';
import { filterTabs, getInitialTab, isParceiroInactive } from '../helpers/utils';
import type { ParceiroData } from '~/shared/schemas/parceiro.schema';

describe('Normalizers', () => {
  describe('normalize', () => {
    it('should normalize string values', () => {
      expect(normalize('  test  ')).toBe('test');
      expect(normalize('value')).toBe('value');
    });

    it('should normalize numbers', () => {
      expect(normalize(123)).toBe('123');
      expect(normalize(0)).toBe('0');
    });

    it('should normalize null/undefined to empty string', () => {
      expect(normalize(null)).toBe('');
      expect(normalize(undefined)).toBe('');
    });

    it('should normalize arrays', () => {
      expect(normalize(['a', 'b', 'c'])).toBe('a, b, c');
      expect(normalize([1, 2, 3])).toBe('1, 2, 3');
    });
  });

  describe('formatDetailValue', () => {
    it('should return "-" for empty values', () => {
      expect(formatDetailValue(null)).toBe('-');
      expect(formatDetailValue(undefined)).toBe('-');
      expect(formatDetailValue('')).toBe('-');
    });

    it('should format regular values', () => {
      expect(formatDetailValue('test')).toBe('test');
      expect(formatDetailValue(123)).toBe('123');
    });
  });

  describe('toLabel', () => {
    it('should convert snake_case to Title Case', () => {
      expect(toLabel('nome_completo')).toBe('Nome Completo');
      expect(toLabel('data_nascimento')).toBe('Data Nascimento');
    });

    it('should handle single words', () => {
      expect(toLabel('nome')).toBe('Nome');
      expect(toLabel('email')).toBe('Email');
    });
  });
});

describe('Utils', () => {
  describe('filterTabs', () => {
    it('should return atendente tabs for atendente variant', () => {
      const tabs = filterTabs('atendente');
      const tabIds = tabs.map((t) => t.id);

      expect(tabIds).toContain('agendamentos');
      expect(tabIds).toContain('atendimentos');
      expect(tabIds).toContain('checkins');
      expect(tabIds.length).toBe(3);
    });

    it('should return all tabs except agendamentos for parceiro variant', () => {
      const tabs = filterTabs('parceiro');
      const tabIds = tabs.map((t) => t.id);

      expect(tabIds).not.toContain('agendamentos');
      expect(tabIds.length).toBeGreaterThan(3);
    });
  });

  describe('getInitialTab', () => {
    it('should return agendamentos for atendente/time variants', () => {
      expect(getInitialTab('atendente')).toBe('agendamentos');
      expect(getInitialTab('time')).toBe('agendamentos');
    });

    it('should return atendimentos for parceiro variant', () => {
      expect(getInitialTab('parceiro')).toBe('atendimentos');
    });
  });

  describe('isParceiroInactive', () => {
    it('should detect inactive status', () => {
      expect(isParceiroInactive({ status: 'Inativo' } as ParceiroData)).toBe(true);
      expect(isParceiroInactive({ status: 'inativo' } as ParceiroData)).toBe(true);
      expect(isParceiroInactive({ status: '  INATIVO  ' } as ParceiroData)).toBe(true);
    });

    it('should return false for active status', () => {
      expect(isParceiroInactive({ status: 'Ativo' } as ParceiroData)).toBe(false);
      expect(isParceiroInactive({ status: '' } as ParceiroData)).toBe(false);
      expect(isParceiroInactive(null)).toBe(false);
    });
  });
});
