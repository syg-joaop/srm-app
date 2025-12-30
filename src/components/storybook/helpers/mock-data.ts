/**
 * Mock data para stories do Storybook
 * Todos os dados são realistas e seguem a estrutura do domínio SRM
 */

// ============================================
// TYPES (baseado em tipos reais do projeto)
// ============================================

export interface MockParceiro {
  name: string;
  fanta: string;
  codfor: string;
  status: 'Ativo' | 'Inativo' | 'Atenção';
  location?: string;
  categoria?: string;
  cidade?: string;
  uf?: string;
  ende?: string;
  comp?: string;
  fone?: string;
  celular?: string;
  tel3?: string;
  email?: string;
  data?: string;
  ultima_carga?: string;
  [key: string]: any;
}

export interface MockContato {
  id: string;
  nome: string;
  cargo: string;
  telefone: string;
  email: string;
  principal: boolean;
}

export interface MockCarga {
  id: string;
  data: string;
  valor: number;
  status: string;
  itens: number;
}

export interface MockAtendimento {
  id: string;
  titulo: string;
  descricao: string;
  status: string;
  data: string;
  atendente: string;
}

export interface MockMapaPonto {
  id: string;
  latitude: number;
  longitude: number;
  titulo: string;
  subtitulo: string;
  status: 'ativo' | 'alerta' | 'inativo';
  linhas?: Array<{
    rotulo: string;
    valor: string;
  }>;
}

// ============================================
// PARCEIROS
// ============================================

/**
 * Mock de parceiro completo com todos os campos
 */
export const mockParceiro: MockParceiro = {
  name: 'Fornecedor Exemplo Ltda',
  fanta: 'Super Fornecedor',
  codfor: '12345',
  status: 'Ativo',
  location: 'São Paulo, SP',
  categoria: 'Distribuidor',
  cidade: 'São Paulo',
  uf: 'SP',
  ende: 'Av. Paulista, 1000',
  comp: 'Sala 100',
  fone: '(11) 1234-5678',
  celular: '(11) 98765-4321',
  tel3: '(11) 3333-4444',
  email: 'contato@fornecedor.com',
  data: '2024-01-15',
  ultima_carga: '2024-12-20',
};

/**
 * Lista de parceiros com status variados
 */
export const mockParceirosList: MockParceiro[] = [
  mockParceiro,
  {
    ...mockParceiro,
    name: 'Fornecedor B Distribuição',
    fanta: 'Distribuidor B',
    codfor: '12346',
    status: 'Inativo',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
  },
  {
    ...mockParceiro,
    name: 'Fornecedor C Comercial',
    fanta: 'Comercial C',
    codfor: '12347',
    status: 'Atenção',
    cidade: 'Belo Horizonte',
    uf: 'MG',
  },
  {
    ...mockParceiro,
    name: 'Distribuidor Elite',
    fanta: 'Elite Dist',
    codfor: '12348',
    status: 'Ativo',
    cidade: 'Curitiba',
    uf: 'PR',
  },
  {
    ...mockParceiro,
    name: 'Atacadão Brasil',
    fanta: 'Atacadão',
    codfor: '12349',
    status: 'Ativo',
    cidade: 'Porto Alegre',
    uf: 'RS',
  },
];

// ============================================
// CONTATOS
// ============================================

export const mockContatos: MockContato[] = [
  {
    id: '1',
    nome: 'João Silva',
    cargo: 'Gerente de Compras',
    telefone: '(11) 98765-4321',
    email: 'joao.silva@fornecedor.com',
    principal: true,
  },
  {
    id: '2',
    nome: 'Maria Santos',
    cargo: 'Coordenadora Financeira',
    telefone: '(11) 91234-5678',
    email: 'maria.santos@fornecedor.com',
    principal: false,
  },
  {
    id: '3',
    nome: 'Pedro Oliveira',
    cargo: 'Vendedor',
    telefone: '(11) 99876-5432',
    email: 'pedro.oliveira@fornecedor.com',
    principal: false,
  },
];

// ============================================
// CARGAS
// ============================================

export const mockCargas: MockCarga[] = [
  {
    id: '1',
    data: '2024-12-20',
    valor: 15000.50,
    status: 'Entregue',
    itens: 45,
  },
  {
    id: '2',
    data: '2024-12-18',
    valor: 12300.00,
    status: 'Em trânsito',
    itens: 32,
  },
  {
    id: '3',
    data: '2024-12-15',
    valor: 8750.25,
    status: 'Entregue',
    itens: 28,
  },
  {
    id: '4',
    data: '2024-12-10',
    valor: 21000.00,
    status: 'Cancelada',
    itens: 60,
  },
];

// ============================================
// ATENDIMENTOS
// ============================================

export const mockAtendimentos: MockAtendimento[] = [
  {
    id: '1',
    titulo: 'Problema com pedido #12345',
    descricao: 'Cliente solicitou alteração no pedido após confirmação',
    status: 'Em andamento',
    data: '2024-12-20T10:30:00',
    atendente: 'João Silva',
  },
  {
    id: '2',
    titulo: 'Dúvida sobre prazo de entrega',
    descricao: 'Cliente quer saber quando receberá o pedido',
    status: 'Concluído',
    data: '2024-12-19T14:15:00',
    atendente: 'Maria Santos',
  },
  {
    id: '3',
    titulo: 'Solicitação de catálogo',
    descricao: 'Novo cliente solicitou catálogo de produtos',
    status: 'Novo',
    data: '2024-12-18T09:00:00',
    atendente: 'Pedro Oliveira',
  },
];

// ============================================
// MAPA - PONTOS
// ============================================

/**
 * Mock de pontos para mapas com coordenadas reais do Brasil
 */
export const mockMapaPontos: MockMapaPonto[] = [
  {
    id: '1',
    latitude: -23.5505,
    longitude: -46.6333,
    titulo: 'Fornecedor A',
    subtitulo: 'São Paulo, SP',
    status: 'ativo',
    linhas: [
      { rotulo: 'Categoria', valor: 'Distribuidor' },
      { rotulo: 'Última visita', valor: '20/12/2024' },
    ],
  },
  {
    id: '2',
    latitude: -22.9068,
    longitude: -43.1729,
    titulo: 'Fornecedor B',
    subtitulo: 'Rio de Janeiro, RJ',
    status: 'alerta',
    linhas: [
      { rotulo: 'Categoria', valor: 'Atacadista' },
      { rotulo: 'Última visita', valor: '15/12/2024' },
    ],
  },
  {
    id: '3',
    latitude: -19.9167,
    longitude: -43.9345,
    titulo: 'Fornecedor C',
    subtitulo: 'Belo Horizonte, MG',
    status: 'inativo',
    linhas: [
      { rotulo: 'Categoria', valor: 'Varejo' },
      { rotulo: 'Última visita', valor: '10/12/2024' },
    ],
  },
  {
    id: '4',
    latitude: -25.4284,
    longitude: -49.2733,
    titulo: 'Fornecedor D',
    subtitulo: 'Curitiba, PR',
    status: 'ativo',
    linhas: [
      { rotulo: 'Categoria', valor: 'Distribuidor' },
      { rotulo: 'Última visita', valor: '18/12/2024' },
    ],
  },
  {
    id: '5',
    latitude: -30.0346,
    longitude: -51.2177,
    titulo: 'Fornecedor E',
    subtitulo: 'Porto Alegre, RS',
    status: 'ativo',
    linhas: [
      { rotulo: 'Categoria', valor: 'Atacadista' },
      { rotulo: 'Última visita', valor: '19/12/2024' },
    ],
  },
];

/**
 * Coordenadas centrais do Brasil
 */
export const mockMapaCentro = [-14.2350, -51.9253] as [number, number];

/**
 * Coordenadas de São Paulo (centro econômico)
 */
export const mockMapaCentroSP = [-23.5505, -46.6333] as [number, number];

// ============================================
// MAPA - ROTAS
// ============================================

/**
 * Coordenadas para polyline de rota (São Paulo -> Rio de Janeiro)
 */
export const mockMapaRotaCoords: Array<[number, number]> = [
  [-23.5505, -46.6333], // São Paulo
  [-23.4000, -46.3000],
  [-23.2000, -45.9000],
  [-22.9000, -45.5000],
  [-22.7000, -44.0000],
  [-22.9068, -43.1729], // Rio de Janeiro
];

/**
 * Pontos de rota
 */
export const mockMapaRotaPoints = [
  {
    id: '1',
    latitude: -23.5505,
    longitude: -46.6333,
    titulo: 'Início: São Paulo',
    subtitulo: 'Depósito Principal',
    status: 'ativo' as const,
  },
  {
    id: '2',
    latitude: -22.9068,
    longitude: -43.1729,
    titulo: 'Fim: Rio de Janeiro',
    subtitulo: 'Cliente Final',
    status: 'ativo' as const,
  },
];

// ============================================
// SELECT OPTIONS
// ============================================

/**
 * Options simples para selects
 */
export const mockSelectOptions = Array.from({ length: 5 }, (_, i) => ({
  label: `Opção ${i + 1}`,
  value: String(i + 1),
}));

/**
 * Options longa para testar searchable (100 itens)
 */
export const mockLongSelectOptions = Array.from({ length: 100 }, (_, i) => ({
  label: `Item ${i + 1} - Descrição detalhada`,
  value: String(i + 1),
}));

/**
 * Options de categorias
 */
export const mockCategoriaOptions = [
  { label: 'Distribuidor', value: 'distribuidor' },
  { label: 'Atacadista', value: 'atacadista' },
  { label: 'Varejo', value: 'varejo' },
  { label: 'Representante', value: 'representante' },
  { label: 'Fabricante', value: 'fabricante' },
];

/**
 * Options de status
 */
export const mockStatusOptions = [
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inativo', value: 'inativo' },
  { label: 'Atenção', value: 'atencao' },
  { label: 'Pendente', value: 'pendente' },
];

// ============================================
// LISTA ITENS
// ============================================

/**
 * Itens genéricos para listas
 */
export const mockListaItens = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  titulo: `Item ${i + 1}`,
  descricao: `Descrição detalhada do item ${i + 1}`,
  status: i % 3 === 0 ? 'ativo' : i % 3 === 1 ? 'alerta' : 'inativo',
  data: new Date(2024, 11, 20 - i).toISOString(),
}));

/**
 * Lista longa para testar paginação (50 itens)
 */
export const mockLongListaItens = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  titulo: `Item ${i + 1}`,
  descricao: `Descrição do item ${i + 1}`,
  status: i % 3 === 0 ? 'ativo' : i % 3 === 1 ? 'alerta' : 'inativo',
}));

// ============================================
// COMENTÁRIOS
// ============================================

export interface MockComentario {
  id: string;
  autor: string;
  texto: string;
  data: string;
  hora: string;
}

export const mockComentarios: MockComentario[] = [
  {
    id: '1',
    autor: 'João Silva',
    texto: 'Cliente solicitou contato urgente sobre atraso na entrega.',
    data: '20/12/2024',
    hora: '10:30',
  },
  {
    id: '2',
    autor: 'Maria Santos',
    texto: 'Entraremos em contato até o final do dia para resolver.',
    data: '20/12/2024',
    hora: '11:45',
  },
  {
    id: '3',
    autor: 'João Silva',
    texto: 'Problema resolvido. Cliente satisfeito.',
    data: '20/12/2024',
    hora: '16:20',
  },
];

// ============================================
// GRÁFICOS
// ============================================

export interface MockChartSerie {
  name: string;
  data: number[];
}

export const mockChartSeries: MockChartSerie[] = [
  {
    name: 'Vendas',
    data: [120, 200, 150, 80, 70, 110, 130],
  },
  {
    name: 'Metas',
    data: [100, 150, 120, 80, 60, 90, 110],
  },
];

export const mockChartCategories = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

// ============================================
// MÉTRICAS
// ============================================

export const mockMetricas = [
  {
    label: 'Vendas do Dia',
    value: 'R$ 45.230,50',
    variant: 'success' as const,
    icon: 'DollarSign',
  },
  {
    label: 'Pedidos Pendentes',
    value: '23',
    variant: 'warning' as const,
    icon: 'ShoppingCart',
  },
  {
    label: 'Clientes Ativos',
    value: '156',
    variant: 'primary' as const,
    icon: 'Users',
  },
  {
    label: 'Taxa de Conversão',
    value: '12.5%',
    variant: 'info' as const,
    icon: 'TrendingUp',
  },
];

// ============================================
// USUÁRIO
// ============================================

export const mockUser = {
  name: 'João Silva',
  role: 'Gerente de Vendas',
  email: 'joao.silva@sagierp.com.br',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=João',
};

// ============================================
// FILTROS
// ============================================

export const mockFiltros = {
  status: ['ativo'],
  categoria: ['distribuidor'],
  dataInicio: '2024-12-01',
  dataFim: '2024-12-31',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Gera um array de itens com quantidade específica
 */
export function generateMockItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    titulo: `Item ${i + 1}`,
    descricao: `Descrição ${i + 1}`,
  }));
}

/**
 * Retorna um parceiro aleatório da lista
 */
export function getRandomParceiro(): MockParceiro {
  const index = Math.floor(Math.random() * mockParceirosList.length);
  return mockParceirosList[index];
}

/**
 * Retorna um ponto aleatório do mapa
 */
export function getRandomMapaPonto(): MockMapaPonto {
  const index = Math.floor(Math.random() * mockMapaPontos.length);
  return mockMapaPontos[index];
}
