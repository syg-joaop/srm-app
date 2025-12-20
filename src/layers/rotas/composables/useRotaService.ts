import type {
  Rota,
  RotaResponse,
  RotaFilters,
  Roteiro,
  RoteiroResponse,
  RoteiroFilters,
  VrpRouteRequest,
  VrpRouteResponse,
  VrpTask,
  VrpVehicle,
  PolylineCache,
  VrpSummary,
  CreateRoteiroPayload,
} from "../rotas.types";

// Endpoints do backend NestJS
const ROTAS_ENDPOINT = "/srm/rotas";
const ROTEIRO_ENDPOINT = "/srm/roteiro";
const ROTAS_CREATE_ENDPOINT = "/srm/rotas";

// Cache TTL (24 horas)
const POLYLINE_CACHE_TTL = 24 * 60 * 60 * 1000;

export const useRotaService = () => {
  const config = useRuntimeConfig();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ConfiguraÃ§Ã£o da API VRP (Fallback para valores hardcoded se nÃ£o houver config)
  // TODO: Mover chaves definitivamente para variÃ¡veis de ambiente e remover fallback
  const VRP_API_URL = (config.public?.vrpApiUrl as string) || "https://vrp-api-zockb2v.cluster.vortus.solutions/api/v1/route";
  const VRP_API_KEY = (config.public?.vrpApiKey as string) || "85b95b01-c471-4566-8769-adfe00478afa";

  /**
   * Busca lista de rotas do comprador
   */
  const fetchRotas = async (filters?: RotaFilters): Promise<RotaResponse | null> => {    isLoading.value = true;
    error.value = null;

    try {
      const api = useMainApi(true); // homol = true
      const queryParams = new URLSearchParams();

      if (filters?.page) queryParams.append("page", filters.page.toString());
      if (filters?.itens) queryParams.append("itens", filters.itens.toString());
      if (filters?.status) queryParams.append("status", filters.status);
      if (filters?.data_inicio) queryParams.append("data_inicio", filters.data_inicio);
      if (filters?.data_fim) queryParams.append("data_fim", filters.data_fim);

      const url = queryParams.toString() ? `${ROTAS_ENDPOINT}?${queryParams}` : ROTAS_ENDPOINT;

      const response = await api<RotaResponse>(url, {
        method: "GET",
      });

      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao buscar rotas";
      console.error("[useRotaService] fetchRotas error:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Busca roteiros (pontos) de uma rota especÃ­fica
   */
  const fetchRoteiros = async (idRota: number, filters?: RoteiroFilters): Promise<RoteiroResponse | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const api = useMainApi(true);
      const queryParams = new URLSearchParams();

      queryParams.append("id_rota", idRota.toString());
      if (filters?.page) queryParams.append("page", filters.page.toString());
      if (filters?.itens) queryParams.append("itens", filters.itens.toString());
      if (filters?.id_usuario) queryParams.append("id_usuario", filters.id_usuario.toString());

      const response = await api<RoteiroResponse>(`${ROTEIRO_ENDPOINT}?${queryParams}`, {
        method: "GET",
      });

      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao buscar roteiros";
      console.error("[useRotaService] fetchRoteiros error:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Busca uma rota especÃ­fica por ID
   */
  const fetchRotaById = async (id: number): Promise<Rota | null> => {
    const response = await fetchRotas();
    if (!response?.data) return null;
    return response.data.find((r) => r.id === id) || null;
  };

  /**
   * Gera chave de cache baseada nos IDs dos roteiros
   */
  const generateCacheKey = (roteiros: Roteiro[]): string => {
    const ids = [...roteiros]
      .sort((a, b) => (a.sequencia ?? 0) - (b.sequencia ?? 0))
      .map((r) => `${r.id}:${r.sequencia ?? 0}`)
      .join("-");
    return `polyline:${ids}`;
  };

  /**
   * Busca polyline do cache localStorage
   */
  const getPolylineFromCache = (cacheKey: string): PolylineCache | null => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const data: PolylineCache = JSON.parse(cached);
      const now = Date.now();

      // Verifica se o cache expirou
      if (now - data.timestamp > data.ttl) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  };

  /**
   * Salva polyline no cache localStorage
   */
  const savePolylineToCache = (cacheKey: string, polyline: string, summary: VrpSummary): void => {
    try {
      const data: PolylineCache = {
        polyline,
        summary,
        timestamp: Date.now(),
        ttl: POLYLINE_CACHE_TTL,
      };
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (err) {
      console.warn("[useRotaService] Erro ao salvar cache:", err);
    }
  };

  /**
   * Converte roteiros para tasks da API VRP (filtra coordenadas invÃ¡lidas)
   */
  const roteirosToVrpTasks = (roteiros: Roteiro[]): VrpTask[] => {
    return roteiros
      .filter((r) => {
        if (!r.endereco) return false;
        const lat = typeof r.endereco.latitude === "string"
          ? parseFloat(r.endereco.latitude)
          : r.endereco.latitude;
        const lng = typeof r.endereco.longitude === "string"
          ? parseFloat(r.endereco.longitude)
          : r.endereco.longitude;
        return isValidCoordinate(lat, lng);
      })
      .sort((a, b) => (a.sequencia || 0) - (b.sequencia || 0))
      .map((r) => {
        const lat = typeof r.endereco.latitude === "string"
          ? parseFloat(r.endereco.latitude)
          : r.endereco.latitude;
        const lng = typeof r.endereco.longitude === "string"
          ? parseFloat(r.endereco.longitude)
          : r.endereco.longitude;

        return {
          id: r.id,
          type: "catch-only" as const,
          description: r.nome || `Ponto ${r.sequencia}`,
          duration: "00:10",
          location: {
            latitude: lat,
            longitude: lng,
          },
        };
      });
  };

  /**
   * Cria veÃ­culo virtual para calcular polyline
   * Se userLocation for fornecido, usa como ponto de partida (estilo Uber)
   */
  const createVirtualVehicle = (
    roteiros: Roteiro[],
    userLocation?: { latitude: number; longitude: number } | null
  ): VrpVehicle | null => {
    const sortedRoteiros = roteiros
      .filter((r) => {
        if (!r.endereco) return false;
        const lat = typeof r.endereco.latitude === "string"
          ? parseFloat(r.endereco.latitude)
          : r.endereco.latitude;
        const lng = typeof r.endereco.longitude === "string"
          ? parseFloat(r.endereco.longitude)
          : r.endereco.longitude;
        return isValidCoordinate(lat, lng);
      })
      .sort((a, b) => (a.sequencia || 0) - (b.sequencia || 0));

    if (sortedRoteiros.length === 0) return null;

    const ultimo = sortedRoteiros[sortedRoteiros.length - 1];

    // Ponto de partida: localizaÃ§Ã£o do usuÃ¡rio ou primeiro roteiro
    let startLat: number;
    let startLng: number;

    if (userLocation && isValidCoordinate(userLocation.latitude, userLocation.longitude)) {
      // Usa localizaÃ§Ã£o do usuÃ¡rio como ponto de partida (estilo Uber)
      startLat = userLocation.latitude;
      startLng = userLocation.longitude;
      console.log("[useRotaService] Usando localizaÃ§Ã£o do usuÃ¡rio como ponto de partida:", startLat, startLng);
    } else {
      // Fallback: usa primeiro roteiro
      const primeiro = sortedRoteiros[0];
      startLat = typeof primeiro.endereco.latitude === "string"
        ? parseFloat(primeiro.endereco.latitude)
        : primeiro.endereco.latitude;
      startLng = typeof primeiro.endereco.longitude === "string"
        ? parseFloat(primeiro.endereco.longitude)
        : primeiro.endereco.longitude;
    }

    const ultimoLat = typeof ultimo.endereco.latitude === "string"
      ? parseFloat(ultimo.endereco.latitude)
      : ultimo.endereco.latitude;
    const ultimoLng = typeof ultimo.endereco.longitude === "string"
      ? parseFloat(ultimo.endereco.longitude)
      : ultimo.endereco.longitude;

    return {
      id: 1,
      description: "VeÃ­culo Virtual",
      maxJobs: 100,
      avgSpeed: 60,
      location: {
        start: {
          latitude: startLat,
          longitude: startLng,
        },
        end: {
          latitude: ultimoLat,
          longitude: ultimoLng,
        },
      },
      work: {
        start: "06:00",
        end: "22:00",
      },
    };
  };

  /**
   * Calcula polyline chamando a API VRP
   * @param roteiros - Lista de roteiros
   * @param userLocation - LocalizaÃ§Ã£o atual do usuÃ¡rio (GPS) para usar como ponto de partida
   */
  const calcularPolyline = async (
    roteiros: Roteiro[],
    userLocation?: { latitude: number; longitude: number } | null
  ): Promise<{ polyline: string; summary: VrpSummary } | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const tasks = roteirosToVrpTasks(roteiros);

      if (tasks.length === 0) {
        error.value = "Nenhum ponto com coordenadas vÃ¡lidas para calcular a rota";
        return null;
      }

      const callVrp = async (location?: { latitude: number; longitude: number } | null) => {
        const minTasks = location ? 1 : 2;
        if (tasks.length < minTasks) return null;

        // Cache por combinaÃ§Ã£o de pontos + localizaÃ§Ã£o (se houver)
        const userLocStr = location
          ? `${location.latitude.toFixed(4)},${location.longitude.toFixed(4)}`
          : "";
        const cacheKey = generateCacheKey(roteiros) + (userLocStr ? `:user:${userLocStr}` : "");

        const cached = getPolylineFromCache(cacheKey);
        if (cached) {
          console.log("[useRotaService] Polyline encontrada no cache");
          return { polyline: cached.polyline, summary: cached.summary };
        }

        const vehicle = createVirtualVehicle(roteiros, location);
        if (!vehicle || tasks.length < minTasks) {
          return null;
        }

        const request: VrpRouteRequest = {
          timezone: "America/Sao_Paulo",
          maxDaysWorking: 1,
          vehicles: [vehicle],
          tasks,
        };

        console.log("[useRotaService] Chamando API VRP:", request);

        const response = await $fetch<VrpRouteResponse>(VRP_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-api-key": VRP_API_KEY,
          },
          body: request,
        });

        console.log("[useRotaService] Resposta API VRP:", response);

        // Extrai polyline da resposta (pode estar em response.response ou diretamente em response)
        type VrpApiResponseShape = {
          response?: unknown;
          unassignedTasks?: unknown;
          workDays?: Array<{ plans?: Array<{ route?: { polyline?: unknown }; summary?: unknown }> }>;
          summary?: unknown;
        };

        const responseData = response as unknown as VrpApiResponseShape;
        const vrpData = (responseData.response as VrpApiResponseShape | undefined) ?? responseData;

        const unassignedTasks: unknown = vrpData.unassignedTasks;
        const unassignedCount = Array.isArray(unassignedTasks) ? unassignedTasks.length : 0;

        const plan = vrpData.workDays?.[0]?.plans?.[0];
        const polyline = plan?.route?.polyline;
        const summaryData = plan?.summary || vrpData.summary;

        if (!polyline || typeof polyline !== "string") {
          return null;
        }

        const defaultSummary: VrpSummary = {
          distance: { meters: 0 },
          time: { duration: 0, traveling: 0 },
        };

        const summary: VrpSummary =
          summaryData &&
          typeof summaryData === "object" &&
          "distance" in summaryData &&
          "time" in summaryData
            ? (summaryData as VrpSummary)
            : defaultSummary;

        const result = { polyline, summary };

        // Salva no cache
        savePolylineToCache(cacheKey, result.polyline, result.summary);

        // Se houve tarefas nÃ£o atribuÃ­das, tenta recalcular sem localizaÃ§Ã£o do usuÃ¡rio (quando aplicÃ¡vel)
        if (unassignedCount > 0 && location) {
          console.warn(
            "[useRotaService] VRP retornou tarefas nÃ£o atribuÃ­das ao usar localizaÃ§Ã£o do usuÃ¡rio; usando fallback sem localizaÃ§Ã£o.",
            unassignedTasks,
          );
        }

        return result;
      };

      // 1) Tenta com a localizaÃ§Ã£o do usuÃ¡rio (se houver)
      const resultWithUser = await callVrp(userLocation);

      // Se VRP nÃ£o retornou polyline (ex.: tarefas ficaram unassigned por distÃ¢ncia/tempo), faz fallback sem userLocation.
      if (!resultWithUser && userLocation && tasks.length >= 2) {
        console.warn(
          "[useRotaService] VRP nÃ£o conseguiu gerar polyline com localizaÃ§Ã£o do usuÃ¡rio; tentando sem localizaÃ§Ã£o.",
        );
        const fallback = await callVrp(null);
        if (fallback) return fallback;
      }

      if (resultWithUser) return resultWithUser;

      error.value = "API VRP nÃ£o retornou polyline";
      return null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao calcular polyline";
      console.error("[useRotaService] calcularPolyline error:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Busca roteiros de uma rota e calcula a polyline
   * @param idRota - ID da rota
   * @param userLocation - LocalizaÃ§Ã£o atual do usuÃ¡rio (GPS) para usar como ponto de partida
   */
  const fetchRotaComPolyline = async (
    idRota: number,
    userLocation?: { latitude: number; longitude: number } | null
  ): Promise<{
    rota: Rota | null;
    roteiros: Roteiro[];
    polyline: string | null;
    summary: VrpSummary | null;
  }> => {
    // Busca rota
    const rota = await fetchRotaById(idRota);

    // Busca roteiros
    const roteirosResponse = await fetchRoteiros(idRota, { itens: 100 });
    const roteiros = roteirosResponse?.data || [];

    console.log("[useRotaService] fetchRotaComPolyline - Roteiros carregados:", roteiros.length);
    console.log("[useRotaService] fetchRotaComPolyline - LocalizaÃ§Ã£o do usuÃ¡rio:", userLocation);

    // Filtra roteiros com coordenadas vÃ¡lidas para o cÃ¡lculo
    const roteirosValidos = roteiros.filter((r) => {
      if (!r.endereco) return false;
      const lat = typeof r.endereco.latitude === "string"
        ? parseFloat(r.endereco.latitude)
        : r.endereco.latitude;
      const lng = typeof r.endereco.longitude === "string"
        ? parseFloat(r.endereco.longitude)
        : r.endereco.longitude;
      return isValidCoordinate(lat, lng);
    });

    console.log("[useRotaService] fetchRotaComPolyline - Roteiros com coordenadas vÃ¡lidas:", roteirosValidos.length);

    // Calcula polyline se houver roteiros vÃ¡lidos suficientes
    // Com localizaÃ§Ã£o do usuÃ¡rio, precisamos de pelo menos 1 ponto
    // Sem localizaÃ§Ã£o do usuÃ¡rio, precisamos de pelo menos 2 pontos
    let polyline: string | null = null;
    let summary: VrpSummary | null = null;

    const minPontos = userLocation ? 1 : 2;

    if (roteirosValidos.length >= minPontos) {
      console.log("[useRotaService] fetchRotaComPolyline - Calculando polyline com userLocation:", !!userLocation);
      const result = await calcularPolyline(roteirosValidos, userLocation);
      if (result) {
        polyline = result.polyline;
        summary = result.summary;
        console.log("[useRotaService] fetchRotaComPolyline - Polyline calculada:", polyline?.substring(0, 50) + "...");
      } else {
        console.log("[useRotaService] fetchRotaComPolyline - Falha ao calcular polyline");
      }
    } else {
      console.log("[useRotaService] fetchRotaComPolyline - Pontos insuficientes para calcular polyline (mÃ­nimo:", minPontos, ")");
    }

    return { rota, roteiros, polyline, summary };
  };

  /**
   * Limpa cache de polylines
   */
  const clearPolylineCache = (): void => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("polyline:")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  };

  /**
   * Cria uma nova rota
   */
  const createRota = async (data: {
    tipo?: string;
    data_inicio: string;
    data_fim: string;
    observacao?: string;
  }): Promise<Rota | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const api = useMainApi(true);
      const response = await api<{ data: Rota }>(ROTAS_CREATE_ENDPOINT, {
        method: "POST",
        body: {
          tipo: data.tipo || "COMPRA",
          data_inicio: data.data_inicio,
          data_fim: data.data_fim,
          observacao: data.observacao || "",
        },
      });

      return response?.data || null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao criar rota";
      console.error("[useRotaService] createRota error:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Cria um novo roteiro (ponto na rota)
   */
  const createRoteiro = async (payload: CreateRoteiroPayload): Promise<Roteiro | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const api = useMainApi(true);
      const response = await api<{ data: Roteiro }>(ROTEIRO_ENDPOINT, {
        method: "POST",
        body: payload,
      });

      // Limpa cache da polyline dessa rota pois os pontos mudaram
      const cacheKey = `polyline:${payload.id_rota}`;
      localStorage.removeItem(cacheKey);

      return response?.data || null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao criar roteiro";
      console.error("[useRotaService] createRoteiro error:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Deleta um roteiro
   */
  const deleteRoteiro = async (id: number, idRota: number): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const api = useMainApi(true);
      await api(`${ROTEIRO_ENDPOINT}/${id}`, {
        method: "DELETE",
      });

      // Limpa cache da polyline dessa rota
      const cacheKey = `polyline:${idRota}`;
      localStorage.removeItem(cacheKey);

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao deletar roteiro";
      console.error("[useRotaService] deleteRoteiro error:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Atualiza a sequÃªncia de um roteiro
   * Usa PUT conforme a API NestJS (nÃ£o PATCH)
   */
  const updateRoteiroSequencia = async (
    id: number,
    sequencia: number,
    idRota: number
  ): Promise<boolean> => {
    error.value = null;

    try {
      const api = useMainApi(true);
      await api(`${ROTEIRO_ENDPOINT}/${id}`, {
        method: "PUT",
        body: { sequencia },
      });

      // Limpa cache da polyline dessa rota
      clearPolylineCacheForRota(idRota);

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao atualizar sequÃªncia";
      console.error("[useRotaService] updateRoteiroSequencia error:", err);
      return false;
    }
  };

  /**
   * Reordena mÃºltiplos roteiros de uma vez
   * Como a API valida sequÃªncias duplicadas, usamos sequÃªncias temporÃ¡rias
   * para evitar conflitos durante a reordenaÃ§Ã£o
   */
  const reordenarRoteiros = async (
    roteiros: Array<{ id: number; sequencia: number }>,
    idRota: number
  ): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const api = useMainApi(true);

      // EstratÃ©gia: usar sequÃªncias temporÃ¡rias altas para evitar conflitos
      // 1. Primeiro move todos para sequÃªncias temporÃ¡rias (10000+)
      // 2. Depois move para as sequÃªncias finais

      // Passo 1: Mover para sequÃªncias temporÃ¡rias
      for (let i = 0; i < roteiros.length; i++) {
        const roteiro = roteiros[i];
        await api(`${ROTEIRO_ENDPOINT}/${roteiro.id}`, {
          method: "PUT",
          body: { sequencia: 10000 + i },
        });
      }

      // Passo 2: Mover para sequÃªncias finais
      for (const roteiro of roteiros) {
        await api(`${ROTEIRO_ENDPOINT}/${roteiro.id}`, {
          method: "PUT",
          body: { sequencia: roteiro.sequencia },
        });
      }

      // Limpa cache da polyline dessa rota
      clearPolylineCacheForRota(idRota);

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao reordenar roteiros";
      console.error("[useRotaService] reordenarRoteiros error:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Limpa cache de polyline para uma rota especÃ­fica
   */
  const clearPolylineCacheForRota = (idRota: number): void => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("polyline:")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  };

  return {
    // Estado
    isLoading,
    error,

    // MÃ©todos de rotas
    fetchRotas,
    fetchRotaById,
    createRota,

    // MÃ©todos de roteiros
    fetchRoteiros,
    createRoteiro,
    deleteRoteiro,
    updateRoteiroSequencia,
    reordenarRoteiros,

    // MÃ©todos de polyline
    calcularPolyline,
    fetchRotaComPolyline,
    clearPolylineCache,

    // UtilitÃ¡rios
    isValidCoordinate,
  };
};

// Composable para usar em pÃ¡ginas com useAsyncData
export const useRotaAsyncData = () => {
  const service = useRotaService();

  const useRotasData = (filters?: Ref<RotaFilters>) => {
    return useAsyncData(
      "rotas-list",
      () => service.fetchRotas(filters?.value),
      {
        watch: filters ? [filters] : undefined,
      },
    );
  };

  const useRoteirosData = (idRota: Ref<number>) => {
    return useAsyncData(
      `roteiros-${idRota.value}`,
      () => service.fetchRoteiros(idRota.value),
      {
        watch: [idRota],
      },
    );
  };

  return {
    ...service,
    useRotasData,
    useRoteirosData,
  };
};
