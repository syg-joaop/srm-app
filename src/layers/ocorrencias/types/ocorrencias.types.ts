import type { OcorrenciaStatus, Ocorrencia } from "~/types/ocorrencias";

export interface OcorrenciaFilters {
  search?: string;
  atendente?: string;
  situacao?: string;
  formaAtendimento?: string;
  status?: string;
  ordenarPor?: string;
}

export interface PaginatedOcorrenciaResponse {
  status: number;
  message: string;
  success: boolean;
  data: {
    page: number;
    size: number;
    totalItems?: number;
    totalPages?: number;
    items: unknown[];
  };
}
