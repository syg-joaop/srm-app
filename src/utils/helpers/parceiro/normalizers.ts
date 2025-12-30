/**
 * Funções de formatação e normalização de dados.
 * Todas as funções são puras e não têm efeitos colaterais.
 */

/**
 * Normaliza um valor desconhecido para string.
 * @param value - Valor a ser normalizado
 * @returns String normalizada ou vazia
 */
export const normalize = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    const simpleValues = value
      .filter((entry) => ["string", "number", "boolean"].includes(typeof entry))
      .map(String);
    return simpleValues.length ? simpleValues.join(", ") : "";
  }
  return "";
};

/**
 * Verifica se uma string está no formato ISO 8601.
 * @param value - String a ser verificada
 * @returns true se for uma data ISO válida
 */
export const isISODate = (value: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/.test(value);
};

/**
 * Formata uma string de data ISO para o formato brasileiro.
 * @param value - String de data ISO
 * @returns Data formatada (DD/MM/YYYY ou DD/MM/YYYY HH:MM)
 */
export const formatDate = (value: string): string => {
  if (!isISODate(value)) return value;

  try {
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (hours === 0 && minutes === 0) {
      return `${day}/${month}/${year}`;
    }

    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    return `${day}/${month}/${year} ${hoursStr}:${minutesStr}`;
  } catch {
    return value;
  }
};

/**
 * Formata um valor para exibição em detalhes.
 * @param value - Valor a ser formatado
 * @returns Valor formatado ou "-" se vazio
 */
export const formatDetailValue = (value: unknown): string => {
  const normalized = normalize(value);
  if (!normalized) return "-";

  if (typeof normalized === "string" && isISODate(normalized)) {
    return formatDate(normalized);
  }

  if (Array.isArray(value)) {
    const formatted = value
      .map((item) => normalize(item))
      .filter((v) => v && v !== "-")
      .slice(0, 5)
      .join(", ");

    if (value.length > 5) {
      return `${formatted} (+${value.length - 5})`;
    }
    return formatted || "-";
  }

  return normalized;
};

/**
 * Converte uma chave de campo em um formato de label legível.
 * @param key - Chave do campo (ex: "nome_completo")
 * @returns Label formatado (ex: "Nome Completo")
 */
export const toLabel = (key: string): string => {
  const cleaned = key.replace(/[_-]+/g, " ").trim();
  if (!cleaned) return key;
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
};
