/**
 * Dados mock para visualização de parceiros.
 */

import type { TabItem, TabId } from "~/types/parceiro";

export const MOCK_TAB_DATA: Record<TabId, TabItem[]> = {
  cadastro: [
    {
      id: "cadastro-mock-1",
      title: "Fornecedor Nova Era",
      subtitle: "Fantasia Nova Era",
      status: "Ativo",
      details: [
        { label: "Codigo", value: "000124" },
        { label: "Categoria", value: "Embalagens" },
        { label: "Cadastro", value: "12/03/2024" },
        { label: "Ultima carga", value: "18/12/2025" },
        { label: "Cidade", value: "Campinas" },
        { label: "UF", value: "SP" },
        { label: "Endereco", value: "Rua das Flores, 120" },
      ],
    },
  ],
  contatos: [
    {
      id: "contatos-mock-1",
      title: "Fernanda Souza",
      subtitle: "Compras",
      details: [
        { label: "Telefone", value: "(19) 3333-2211" },
        { label: "Celular", value: "(19) 98888-1122" },
        { label: "Telefone 2", value: "(19) 3222-1100" },
        { label: "Email", value: "fernanda@novaera.com" },
      ],
    },
    {
      id: "contatos-mock-2",
      title: "Lucas Pereira",
      subtitle: "Financeiro",
      details: [
        { label: "Telefone", value: "(19) 3555-4488" },
        { label: "Celular", value: "(19) 97777-3344" },
        { label: "Email", value: "lucas@novaera.com" },
      ],
    },
  ],
  cargas: [
    {
      id: "cargas-mock-1",
      title: "Carga 84521",
      subtitle: "Resumo da ultima carga",
      status: "Concluido",
      details: [
        { label: "Ultima carga", value: "18/12/2025" },
        { label: "Cidade", value: "Campinas" },
        { label: "UF", value: "SP" },
        { label: "Peso", value: "24.500 kg" },
        { label: "Valor", value: "R$ 98.400" },
      ],
    },
  ],
  agendamentos: [
    {
      id: "agendamentos-mock-1",
      title: "Visita tecnica",
      subtitle: "23/01/2026 - 09:30",
      status: "Agendado",
      details: [
        { label: "Responsavel", value: "Marina Lopes" },
        { label: "Tipo", value: "On-site" },
        { label: "Prioridade", value: "Alta" },
      ],
    },
    {
      id: "agendamentos-mock-2",
      title: "Reuniao de alinhamento",
      subtitle: "26/01/2026 - 14:00",
      status: "Confirmado",
      details: [
        { label: "Responsavel", value: "Carlos Menezes" },
        { label: "Tipo", value: "Online" },
        { label: "Prioridade", value: "Media" },
      ],
    },
  ],
  atendimentos: [
    {
      id: "atendimentos-mock-1",
      title: "Ocorrencia 3940",
      subtitle: "Embalagem divergente",
      status: "Pendente",
      details: [
        { label: "Aberto em", value: "10/01/2026" },
        { label: "Atendente", value: "Juliana Costa" },
        { label: "Canal", value: "Telefone" },
      ],
    },
    {
      id: "atendimentos-mock-2",
      title: "Ocorrencia 3931",
      subtitle: "Prazo de entrega",
      status: "Concluido",
      details: [
        { label: "Aberto em", value: "05/01/2026" },
        { label: "Atendente", value: "Ricardo Souza" },
        { label: "Canal", value: "Email" },
      ],
    },
  ],
  coletas: [
    {
      id: "coletas-mock-1",
      title: "Coleta 99211",
      subtitle: "Agendada",
      status: "Em andamento",
      details: [
        { label: "Data", value: "21/01/2026" },
        { label: "Motorista", value: "Paulo Silva" },
        { label: "Rota", value: "Campinas - SP" },
      ],
    },
  ],
  precos: [
    {
      id: "precos-mock-1",
      title: "Tabela Janeiro",
      subtitle: "Atualizada em 02/01/2026",
      details: [
        { label: "Categoria", value: "Plastico" },
        { label: "Preco medio", value: "R$ 4,20" },
        { label: "Variacao", value: "+3,2%" },
      ],
    },
    {
      id: "precos-mock-2",
      title: "Tabela Fevereiro",
      subtitle: "Atualizada em 12/02/2026",
      details: [
        { label: "Categoria", value: "Papel" },
        { label: "Preco medio", value: "R$ 3,10" },
        { label: "Variacao", value: "-1,1%" },
      ],
    },
  ],
  checkins: [
    {
      id: "checkins-mock-1",
      title: "Check-in 5521",
      subtitle: "18/12/2025 - 08:40",
      status: "Concluido",
      details: [
        { label: "Cidade", value: "Campinas" },
        { label: "Responsavel", value: "Joao Lima" },
        { label: "Status", value: "Validado" },
      ],
    },
  ],
  favorecidos: [
    {
      id: "favorecidos-mock-1",
      title: "Banco Alfa",
      subtitle: "Conta principal",
      details: [
        { label: "Agencia", value: "0045" },
        { label: "Conta", value: "12345-9" },
        { label: "Tipo", value: "Pessoa juridica" },
      ],
    },
    {
      id: "favorecidos-mock-2",
      title: "Banco Delta",
      subtitle: "Conta secundaria",
      details: [
        { label: "Agencia", value: "0112" },
        { label: "Conta", value: "84321-0" },
        { label: "Tipo", value: "Pessoa juridica" },
      ],
    },
  ],
};
