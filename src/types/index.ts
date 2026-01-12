export * from "./auth";
export * from "./dashboard";
export * from "./offline";
export * from "./parceiro";

// Tipos de domínio específicos (migrados para Zod schemas)
export type { Contato, ContatoDetail } from "~/server/schemas/contato.schema";
export type { Carga, CargaDetail } from "~/server/schemas/carga.schema";
export type { Coleta, ColetaDetail } from "~/server/schemas/coleta.schema";
export type { Preco, PrecoDetail } from "~/server/schemas/preco.schema";
export type { Agendamento, AgendamentoDetail } from "~/server/schemas/agendamento.schema";
export type { Favorecido, FavorecidoDetail } from "~/server/schemas/favorecido.schema";
