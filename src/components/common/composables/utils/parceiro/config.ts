/**
 * Configurações e constantes para processamento de dados de parceiros.
 */

import type { EmptyStateCopy, FieldMapping, ParceiroTabOption, TabId } from "~/components/ui/ui.types";

/**
 * Configuração simples de campos por tab.
 * Define diretamente quais campos usar para título, subtítulo e status.
 * Simples, direto, sem "adivinhação".
 */
export const TAB_FIELD_CONFIG: Record<
  TabId,
  { title: string[]; subtitle: string[]; status?: string[] }
> = {
  cadastro: {
    title: ["fornecedor", "name", "nome"],
    subtitle: ["cidade", "location", "uf"],
  },
  contatos: {
    title: ["nome", "name", "contato"],
    subtitle: ["cargo", "funcao", "email", "telefone"],
    status: ["tipo", "principal"],
  },
  cargas: {
    title: ["boleto", "numero", "id"],
    subtitle: ["data_peso", "data_carga", "data"],
    status: ["situacao", "status"],
  },
  agendamentos: {
    title: ["tipo", "titulo", "assunto"],
    subtitle: ["data", "data_agend", "hora"],
    status: ["situacao", "confirmado"],
  },
  atendimentos: {
    title: ["tipo", "titulo", "assunto", "sintoma"],
    subtitle: ["data", "data_atend", "atendente"],
    status: ["situacao", "resultado"],
  },
  coletas: {
    title: ["numero", "id", "romaneio"],
    subtitle: ["data", "cidade", "peso"],
    status: ["situacao", "coletado"],
  },
  precos: {
    title: ["produto", "descricao"],
    subtitle: ["valor", "preco"],
  },
  checkins: {
    title: ["local", "endereco"],
    subtitle: ["data", "hora"],
    status: ["situacao"],
  },
  favorecidos: {
    title: ["nome", "name", "favorecido"],
    subtitle: ["tipo", "documento"],
  },
};

/**
 * Todas as opções de tabs disponíveis.
 */
export const ALL_TABS: readonly ParceiroTabOption[] = [
  { id: "cadastro", label: "Dados de Cadastro" },
  { id: "contatos", label: "Contatos" },
  { id: "cargas", label: "Cargas" },
  { id: "agendamentos", label: "Agendamentos" },
  { id: "atendimentos", label: "Atendimentos" },
  { id: "coletas", label: "Coletas" },
  { id: "precos", label: "Preços" },
  { id: "checkins", label: "Check-in's" },
  { id: "favorecidos", label: "Favorecidos" },
] as const;

/**
 * Mensagens de estado vazio para cada tab.
 */
export const EMPTY_STATE_COPY: Record<TabId, EmptyStateCopy> = {
  cadastro: {
    title: "Sem dados de cadastro",
    description: "Não há dados de cadastro disponíveis para este parceiro.",
  },
  contatos: {
    title: "Sem contatos",
    description: "Não há contatos cadastrados para este parceiro.",
  },
  cargas: {
    title: "Sem cargas",
    description: "Não há cargas registradas para este parceiro.",
  },
  agendamentos: {
    title: "Sem agendamentos",
    description: "Não há agendamentos registrados para este parceiro.",
  },
  atendimentos: {
    title: "Nenhum atendimento",
    description: "Não há atendimentos registrados para este parceiro.",
  },
  coletas: {
    title: "Sem coletas",
    description: "Não há coletas registradas para este parceiro.",
  },
  precos: {
    title: "Sem preços",
    description: "Não há preços cadastrados para este parceiro.",
  },
  checkins: {
    title: "Sem check-ins",
    description: "Não há check-ins registrados para este parceiro.",
  },
  favorecidos: {
    title: "Sem favorecidos",
    description: "Não há favorecidos cadastrados para este parceiro.",
  },
};

/**
 * Mapeamento de campos para a tab de cadastro.
 */
export const CADASTRO_FIELDS: FieldMapping[] = [
  { key: "codfor", label: "Código" },
  { key: "fornecedor", label: "Nome" },
  { key: "nome", label: "Nome" },
  { key: "fanta", label: "Fantasia" },
  { key: "ende", label: "Endereço" },
  { key: "bairro", label: "Bairro" },
  { key: "cidade", label: "Cidade" },
  { key: "uf", label: "UF" },
  { key: "cpf", label: "CPF" },
  { key: "cnpj", label: "CNPJ" },
  { key: "rg", label: "RG" },
  { key: "ie", label: "IE" },
  { key: "telefone", label: "Telefone" },
  { key: "email", label: "E-mail" },
  { key: "contato", label: "Contato" },
  { key: "tipo", label: "Tipo" },
  { key: "status", label: "Status" },
  { key: "situacao", label: "Situação" },
];

/**
 * Mapeamento de campos para a tab de contatos.
 */
export const CONTATO_FIELDS: FieldMapping[] = [
  { key: "nome", label: "Nome" },
  { key: "cargo", label: "Cargo" },
  { key: "funcao", label: "Função" },
  { key: "email", label: "E-mail" },
  { key: "telefone", label: "Telefone" },
  { key: "celular", label: "Celular" },
  { key: "tipo", label: "Tipo" },
  { key: "principal", label: "Principal" },
  { key: "observacao", label: "Observação" },
];

/**
 * Mapeamento de campos para a tab de cargas.
 */
export const CARGA_FIELDS: FieldMapping[] = [
  { key: "boleto", label: "Boleto" },
  { key: "numero", label: "Número" },
  { key: "data_peso", label: "Data" },
  { key: "data_carga", label: "Data da Carga" },
  { key: "fornecedor", label: "Fornecedor" },
  { key: "count", label: "Quantidade" },
  { key: "situacao", label: "Situação" },
  { key: "status", label: "Status" },
];
