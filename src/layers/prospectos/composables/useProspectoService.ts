import type { ProspectoFilters, ProspectoResponse } from "../prospecto.types";
import type { Ref } from "vue";

type ProspectoItem = ProspectoResponse["data"]["items"][number];

const stripDiacritics = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const normalize = (value: string) => stripDiacritics(value).toLowerCase().trim();

const includesTerm = (value: string | undefined, term: string) =>
  normalize(value ?? "").includes(term);

const parsePtBrDate = (value?: string): Date | null => {
  if (!value) return null;
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3]);
  const date = new Date(year, month, day);

  return Number.isNaN(date.getTime()) ? null : date;
};

const demoProspectos: ProspectoItem[] = [
  {
    codpros: "1",
    prospecto: "Mercado Modelo Ltda",
    fanta: "Mercado Modelo",
    status: "ativo",
    cidade: "São Paulo",
    uf: "SP",
    celular: "11999999999",
    tel3: "",
    data: "2023-10-01",
    fone: "1133333333",
    email: "contato@mercadomodelo.com.br",
    ende: "Rua Exemplo, 123",
    categoria: "Varejo",
    oco2: "",
    tf: "",
    comp: "",
    ultima_interacao: "10/12/2025",
    latitude: "-23.5505",
    longitude: "-46.6333",
    latlong: true,
  },
  {
    codpros: "2",
    prospecto: "Padaria Central",
    fanta: "Padaria Central",
    status: "novo",
    cidade: "Rio de Janeiro",
    uf: "RJ",
    celular: "21988888888",
    tel3: "",
    data: "2023-11-15",
    fone: "2122222222",
    email: "contato@padariacentral.com.br",
    ende: "Av. Atlântica, 500",
    categoria: "Padaria",
    oco2: "",
    tf: "",
    comp: "",
    ultima_interacao: "12/12/2025",
    latitude: "-22.9068",
    longitude: "-43.1729",
    latlong: true,
  },
  {
    codpros: "3",
    prospecto: "Supermercado Preço Bom",
    fanta: "Preço Bom",
    status: "inativo",
    cidade: "Curitiba",
    uf: "PR",
    celular: "41977777777",
    tel3: "",
    data: "2023-05-20",
    fone: "4130303030",
    email: "compras@precobom.com.br",
    ende: "Rua das Flores, 100",
    categoria: "Supermercado",
    oco2: "",
    tf: "",
    comp: "",
    ultima_interacao: "01/01/2024",
    latitude: "-25.4284",
    longitude: "-49.2733",
    latlong: true,
  },
];

const applyFilters = (items: ProspectoItem[], filters: ProspectoFilters) => {
  let result = items;

  const searchTerm = normalize(filters.search ?? "");
  if (searchTerm) {
    result = result.filter(
      (p) =>
        includesTerm(p.prospecto, searchTerm) ||
        includesTerm(p.fanta, searchTerm) ||
        includesTerm(p.cidade, searchTerm),
    );
  }

  const fantasiaTerm = normalize(filters.fantasia ?? "");
  if (fantasiaTerm) {
    result = result.filter((p) => includesTerm(p.fanta, fantasiaTerm));
  }

  const cidadeTerm = normalize(filters.cidade ?? "");
  if (cidadeTerm) {
    result = result.filter((p) => includesTerm(p.cidade, cidadeTerm));
  }

  if (filters.status && normalize(filters.status) !== "todos") {
    result = result.filter((p) => normalize(p.status) === normalize(filters.status ?? ""));
  }

  if (filters.sortBy === "sem_interacao") {
    const limit = Date.now() - 60 * 24 * 60 * 60 * 1000;
    result = result.filter((p) => {
      const lastInteraction = parsePtBrDate(p.ultima_interacao);
      return lastInteraction ? lastInteraction.getTime() < limit : true;
    });
  } else {
    const key = (filters.sortBy as "prospecto" | "cidade" | "status") ?? "prospecto";
    result = [...result].sort((a, b) =>
      normalize(String(a[key] ?? "")).localeCompare(normalize(String(b[key] ?? ""))),
    );
  }

  return result;
};

export const useProspectoService = () => {
  const fetchProspecto = (page: Ref<number>, size: Ref<number>, filters: Ref<ProspectoFilters>) => {
    return useAsyncData<ProspectoResponse>(
      "prospectos",
      async () => {
        const filtered = applyFilters(demoProspectos, filters.value);

        const totalItems = filtered.length;
        const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / Math.max(1, size.value));

        const start = Math.max(0, (page.value - 1) * size.value);
        const items = filtered.slice(start, start + size.value);

        return {
          status: 200,
          message: "Ok",
          success: true,
          data: {
            page: page.value,
            size: size.value,
            totalItems,
            totalPages,
            items,
          },
        };
      },
      {
        lazy: true,
        watch: [page, filters],
      },
    );
  };

  return {
    fetchProspecto,
  };
};
