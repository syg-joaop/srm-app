/**
 * Helpers específicos para processamento de cargas.
 * Funções pequenas e focadas para lidar com a lógica complexa de cargas.
 */

import { normalize } from './parceiro/normalizers';

import type { CargaRecord, EnhancedDetail, TotalDetail, ProductDetail, SeparatorDetail } from '~/types/parceiro';

/**
 * Gets the count field from a carga record.
 * @param item - Carga record
 * @returns Number of items (default: 1)
 */
export const getCount = (item: CargaRecord): number => {
  if (!item.count) return 1;

  const count = typeof item.count === 'number'
    ? item.count
    : parseInt(String(item.count), 10);

  return isNaN(count) ? 1 : count;
};

/**
 * Checks if the record has multiple products.
 * @param item - Carga record
 * @returns true if count > 1
 */
export const hasMultiple = (item: CargaRecord): boolean => {
  return getCount(item) > 1;
};

/**
 * Gets the product from a record at a specific index.
 * Tries produto_N and desc_N.
 * @param item - Carga record
 * @param idx - Product index (1-based)
 * @returns Product name or null
 */
export const getProduct = (item: CargaRecord, idx: number): string | null => {
  const produto = item[`produto_${idx}`];
  const desc = item[`desc_${idx}`];
  if (produto) return String(produto);
  if (desc) return String(desc);
  return null;
};

/**
 * Builds details in list format for multiple products.
 * @param item - Carga record
 * @returns Array of formatted details
 */
export const buildListDetails = (item: CargaRecord): EnhancedDetail[] => {
  const count = getCount(item);
  const details: EnhancedDetail[] = [];

  for (let i = 1; i <= count; i++) {
    const produto = getProduct(item, i);
    if (!produto) continue;

    const valor = item[`valor_${i}`] ?? item[`peso_${i}`] ?? '-';
    const unidade = item[`unidade_${i}`];
    const liquido = item[`liquido_${i}`];
    const hora = item[`hora_${i}`];

    const produtoLabel = `${i}. ${produto}`;
    const produtoParts: string[] = [];

    if (unidade) produtoParts.push(String(unidade));
    if (liquido) produtoParts.push(`${liquido} kg`);
    if (valor && valor !== '0.00') produtoParts.push(`R$ ${valor}`);
    if (hora) produtoParts.push(String(hora));

    const produtoValue = produtoParts.length > 0 ? produtoParts.join(' • ') : '-';

    const productDetail: ProductDetail = {
      __type: 'product',
      label: produtoLabel,
      value: produtoValue,
      produtoIndex: i,
    };

    details.push(productDetail);
  }

  if (details.length > 0) {
    const separator: SeparatorDetail = {
      __type: 'separator',
      label: '─',
      value: '─',
    };
    details.push(separator);
  }

  const liquidoTotal = normalize(item.liquido_total);
  const valorTotal = normalize(item.valor_total);

  if (liquidoTotal) {
    const totalDetail: TotalDetail = {
      __type: 'total',
      label: 'PESO TOTAL',
      value: `${liquidoTotal} kg`,
    };
    details.push(totalDetail);
  }

  if (valorTotal && valorTotal !== '0.00') {
    const totalDetail: TotalDetail = {
      __type: 'total',
      label: 'VALOR TOTAL',
      value: `R$ ${valorTotal}`,
    };
    details.push(totalDetail);
  }

  return details;
};

/**
 * Builds details in grid format for a single product or no products.
 * @param item - Carga record
 * @param excludedKeys - Keys to exclude from details
 * @returns Array of formatted details
 */
export const buildStandardDetails = (
  item: CargaRecord,
  excludedKeys: string[] = []
): EnhancedDetail[] => {
  const details: EnhancedDetail[] = Object.entries(item)
    .filter(([key]) => !excludedKeys.includes(key))
    .filter(([, value]) => {
      if (value === null || value === undefined) return false;
      if (Array.isArray(value)) return false;
      return ['string', 'number', 'boolean'].includes(typeof value);
    })
    .map(([key, value]) => ({
      label: toLabel(key),
      value: normalize(value),
    }))
    .filter((detail): detail is EnhancedDetail =>
      detail.value !== '' && detail.value !== '-'
    );

  return details;
};

/**
 * Builds the subtitle for a carga record.
 * @param item - Carga record
 * @returns Subtitle (empty if not applicable)
 */
export const buildSubtitle = (item: CargaRecord): string => {
  if (hasMultiple(item)) {
    const count = getCount(item);
    return `${count} produtos`;
  }

  const produto = getProduct(item, 1);
  return produto || '';
};

/**
 * Generates an ID for a carga item.
 * @param item - Carga record
 * @param idx - Item index
 * @returns Unique ID
 */
export const generateId = (item: CargaRecord, idx: number): string => {
  const boleto = normalize(item.boleto);
  const id = normalize(item.id);

  if (boleto) return `cargas-${boleto}`;
  if (id) return `cargas-${id}`;
  return `cargas-${idx}`;
};

/**
 * Gets the list of keys to exclude for standard details.
 * @param titleKey - Key used as title
 * @param isBatch - Whether it has multiple products
 * @returns Array of keys to exclude
 */
export const getExcludedKeys = (titleKey: string, isBatch: boolean): string[] => {
  const baseExcluded = ['data_peso', 'count'];

  if (isBatch) {
    return [
      titleKey,
      ...baseExcluded,
      'produto',
      'unidade',
      'liquido_unitario',
      'valor_unitario',
      'hora_peso',
      'liquido_total',
      'valor_total',
    ].filter(Boolean);
  }

  return [
    titleKey,
    ...baseExcluded,
    'produto',
    'unidade',
    'liquido_unitario',
    'valor_unitario',
    'hora_peso',
  ].filter(Boolean);
};

/**
 * Converts a key to a label (camelCase → Title Case).
 * @param key - Field key
 * @returns Formatted label
 */
const toLabel = (key: string): string => {
  const withSpaces = key.replace(/_/g, ' ');
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};

/**
 * Builds a special subtitle for cargas.
 * @param item - Carga record
 * @returns Formatted subtitle for cargas
 */
export const buildSubtitleSpecial = (item: CargaRecord): { key: string; value: string } => {
  const countVal = item.count;
  const dataPeso = item.data_peso;

  let count = '';
  if (typeof countVal === 'number') {
    count = countVal > 1 ? `${countVal} produtos` : '';
  } else if (typeof countVal === 'string') {
    const parsed = parseInt(countVal);
    count = !isNaN(parsed) && parsed > 1 ? `${parsed} produtos` : '';
  }

  if (count) {
    const formattedDate = dataPeso ? normalize(dataPeso) : '';
    return {
      key: 'subtitle',
      value: formattedDate ? `${count} • ${formattedDate}` : count,
    };
  }

  const produtos = item.produto;
  if (Array.isArray(produtos) && produtos.length > 0) {
    const first = normalize(produtos[0]);
    const formattedDate = dataPeso ? normalize(dataPeso) : '';
    return {
      key: 'produto',
      value: formattedDate ? `${first} • ${formattedDate}` : first,
    };
  }

  if (dataPeso) {
    return { key: 'data_peso', value: normalize(dataPeso) };
  }

  return { key: '', value: '' };
};
