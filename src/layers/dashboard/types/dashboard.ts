export interface DashboardCount {
  count: string | number;
  tipo: string;
}

export interface DashboardIndicatorResponse {
  access: boolean;
  message: string;
  data: DashboardCount[];
}

export interface Attendance {
  num: string;
  codcli: string;
  codfor: string;
  nome: string;
  data_oco: string;
  atendente: string;
  tipo_ate: string;
  situacao: string;
  status: string;
  data_pro: string;
  oco: string;
  solucao: string;
  usuario: string;
  data: string;
  hora: string;
  empresa: string;
  sr_recno: string;
  hora_oco: string;
  apelido: string;
  atendente_enc: string;
  user_diagnostico: string;
  latitude: string;
  longitude: string;
  problema: string;
}

export interface AttendanceResponse {
  access: boolean;
  message: string;
  data: Attendance[];
}

export interface OccurrenceStat {
  atendimento_geral: number | string;
  atendimento_periodo: number | string;
  atendimento_ok: number | string;
  atendimento_acompanhamento: number | string;
  atendimento_pendente: number | string;
  atendimento_vencido: number | string;
}

export interface OccurrenceHistory {
  count: number;
  data_inicial: string;
  data_final: string;
  mes_ano: string;
  date_part: number;
}

export interface SupplierBirthday {
  fornecedor: string;
  fanta: string;
  oco2: string;
  celular: string;
  tel3: string;
  data: string;
  fone: string;
  email: string;
  status: string;
  ende: string;
  cidade: string;
  uf: string;
  categoria: string;
  tf: string;
  dat_nasc: string;
  codfor: string;
  dia_nasc: number;
  dia_atual: number;
  ultima_carga: string;
  latitude: string;
  longitude: string;
  latlong: boolean;
}

export interface StaffPerformance {
  setor: string;
  nomefun: string;
  sr_recno: string;
  email: boolean;
  iduser: string;
  codven: string;
  codcom: string;
  codcla: string;
  codcatfor: string;
  atendimento_geral: string;
  atendimento_periodo: string;
  atendimento_ok: string;
  atendimento_acompanhamento: string;
  atendimento_pendente: string;
  atendimento_vencido: string;
}

export interface DailyGoal {
  data: string;
  sum: string;
}

export interface PurchasingStats {
  total: string;
  liquido: string;
  preco_medio: string;
  desconto: string;
  media_diaria: string;
  preco_sem_icms: string;
  icms: string;
  totaldiasuteis: string;
  totalsabados: string;
}

export interface BuyerPerformance {
  nome: string | null;
  atual: string;
  ant: string;
}

export interface TopProduct {
  produto: string | null;
  mes_atual: string;
  mes_anterior: string;
}

export interface DashboardApiResponse {
  indicadoresDashboard: DashboardIndicatorResponse;
  indicadoresDashboardSemComprador: DashboardIndicatorResponse;
  proximosAtendimentos: AttendanceResponse;
  proximosAtendimentosNaoAdmin: AttendanceResponse;
  atendimentosVencidos: AttendanceResponse;
  atendimentosVencidosNaoAdmin: AttendanceResponse;
  ocorrencias12Meses: {
    access: boolean;
    message: string;
    data: OccurrenceStat[];
  };
  ocorrencias12MesesNaoAdmin: {
    access: boolean;
    message: string;
    data: OccurrenceStat[];
  };
  ocorrencias6Meses: {
    access: boolean;
    message: string;
    data: OccurrenceHistory[];
  };
  ocorrencias6MesesNaoAdmin: {
    access: boolean;
    message: string;
    data: OccurrenceHistory[];
  };
  aniversariantesFornecedores: {
    access: boolean;
    message: string;
    data: SupplierBirthday[];
  };
  aniversariantesContatos: { access: boolean; message: string; data: any[] };
  atendentes: { access: boolean; message: string; data: StaffPerformance[] };
  metaDiaria: { access: boolean; message: string; data: DailyGoal[] };
  comprasMes: { access: boolean; message: string; data: PurchasingStats[] };
  comprasComprador: {
    access: boolean;
    message: string;
    data: BuyerPerformance[];
  };
  prodsMaisCompradosMes: {
    access: boolean;
    message: string;
    data: TopProduct[];
  };
  totalDescontos: {
    access: boolean;
    message: string;
    data: { mes: string; desconto: number }[];
  };
}
