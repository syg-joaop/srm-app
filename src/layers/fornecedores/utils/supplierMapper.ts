import type { Fornecedor } from "../types/fornecedores";
import type { Supplier } from "../types/supplier";

export function mapFornecedorToSupplier(item: Fornecedor): Supplier {
  const statusMap: Record<string, Supplier["status"]> = {
    ativo: "active",
    active: "active",
    inativo: "inactive",
    inactive: "inactive",
    alerta: "alert",
    alert: "alert",
  };

  const statusChave = (item.status || "").trim().toLowerCase();
  const status = statusMap[statusChave] ?? ("active" as const);

  const latitude = item.latitude ? parseFloat(item.latitude) : undefined;
  const longitude = item.longitude ? parseFloat(item.longitude) : undefined;
  const hasCoordinates = Boolean(
    item.latlong &&
    latitude &&
    longitude &&
    !isNaN(latitude) &&
    !isNaN(longitude)
  );

  return {
    id: item.codfor || item.fornecedor,
    name: (item.fornecedor || "").trim() || "Sem nome",
    fantasy: (item.fanta || "").trim(),
    city: item.uf
      ? `${(item.cidade || "").trim()} - ${(item.uf || "").trim()}`
      : (item.cidade || "").trim(),
    lastLoad: item.ultima_carga || item.data || "Sem registro",
    daysWithoutLoad: 0,
    status,
    hasAlert: status === "alert" || status === "inactive",
    latitude: hasCoordinates ? latitude : undefined,
    longitude: hasCoordinates ? longitude : undefined,
    hasCoordinates,
  };
}
