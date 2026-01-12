import type { LatLngExpression } from "leaflet";

/**
 * Configuração de estilo para polyline de rota
 */
export interface RotaPolylineConfig {
  color: string;
  weight: number;
  opacity: number;
  dashArray?: string;
}

/**
 * Ponto de rota com informações para renderização no mapa
 */
export interface MapaPonto {
  id: number | string;
  latitude: number | string;
  longitude: number | string;
  titulo: string;
  subtitulo?: string | null;
  sequencia?: number;
  status?: string;
  endereco?: {
    rua?: string | null;
    numero?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    estado?: string | null;
    cep?: string | null;
  };
}

/**
 * Configuração de status para cores no mapa
 */
export interface MapaStatusConfig {
  color: string;
  label: string;
}

/**
 * Opções para fitBounds do mapa
 */
export interface FitBoundsOptions {
  padding?: [number, number];
  maxZoom?: number;
  animate?: boolean;
  duration?: number;
}

/**
 * Localização do usuário
 */
export interface UserLocation {
  latitude: number;
  longitude: number;
}
