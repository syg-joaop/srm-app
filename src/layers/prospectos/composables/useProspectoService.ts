import type { ProspectoResponse, ProspectoFilters } from "../types/prospecto";
import type { Ref } from "vue";

export const useProspectoService = () => {
  // const api = useMainApi(true); // Uncomment when ready
  // const authStore = useAuthStore();

  const fetchProspecto = (
    page: Ref<number>,
    size: Ref<number>,
    filters: Ref<ProspectoFilters>
  ) => {
    // Mock implementation for now
    return useAsyncData<ProspectoResponse>(
      "prospectos",
      async () => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock Data
        const items = [
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

        return {
          status: 200,
          message: "Success",
          success: true,
          data: {
            page: page.value,
            size: size.value,
            totalItems: 3,
            totalPages: 1,
            items: items,
          },
        };
      },
      {
        // immediate: authStore.isAuthenticated,
        lazy: true,
        watch: [page, filters],
      }
    );
  };

  return {
    fetchProspecto,
  };
};
