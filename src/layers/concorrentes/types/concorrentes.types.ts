export interface ConcorrenteFilters {
  search?: string;
}

export interface Concorrente {
  [key: string]: unknown;
  id: number;
  nome: string;
  cidade?: string;
  estado?: string;
  telefone?: string;
  segmento?: string;
  observacao?: string;
  status?: string;
}

export interface PaginatedConcorrenteResponse {
  status: number;
  message: string;
  success: boolean;
  data: {
    page: number;
    size: number;
    totalItems?: number;
    totalPages?: number;
    items: Concorrente[];
  };
}
