
export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watch = false,
  } = options;

  const position = ref<GeolocationPosition | null>(null);
  const error = ref<string | null>(null);
  const isLoading = ref(false);
  const isSupported = ref(typeof navigator !== "undefined" && "geolocation" in navigator);

  let watchId: number | null = null;

  const geolocationOptions: PositionOptions = {
    enableHighAccuracy,
    timeout,
    maximumAge,
  };

  /**
   * Callback de sucesso da geolocalizaÃ§Ã£o
   */
  const onSuccess = (pos: globalThis.GeolocationPosition) => {
    position.value = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      timestamp: pos.timestamp,
    };
    error.value = null;
    isLoading.value = false;

    console.log("[useGeolocation] PosiÃ§Ã£o obtida:", position.value);
  };

  /**
   * Callback de erro da geolocalizaÃ§Ã£o
   */
  const onError = (err: GeolocationPositionError) => {
    isLoading.value = false;

    switch (err.code) {
      case err.PERMISSION_DENIED:
        error.value = "PermissÃ£o de localizaÃ§Ã£o negada. Habilite nas configuraÃ§Ãµes do navegador.";
        break;
      case err.POSITION_UNAVAILABLE:
        error.value = "LocalizaÃ§Ã£o indisponÃ­vel. Verifique se o GPS estÃ¡ ativado.";
        break;
      case err.TIMEOUT:
        error.value = "Tempo esgotado ao obter localizaÃ§Ã£o.";
        break;
      default:
        error.value = "Erro desconhecido ao obter localizaÃ§Ã£o.";
    }

    console.error("[useGeolocation] Erro:", error.value);
  };

  /**
   * ObtÃ©m a posiÃ§Ã£o atual uma vez
   */
  const getCurrentPosition = (): Promise<GeolocationPosition | null> => {
    return new Promise((resolve) => {
      if (!isSupported.value) {
        error.value = "GeolocalizaÃ§Ã£o nÃ£o suportada neste navegador.";
        resolve(null);
        return;
      }

      isLoading.value = true;
      error.value = null;

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onSuccess(pos);
          resolve(position.value);
        },
        (err) => {
          onError(err);
          resolve(null);
        },
        geolocationOptions
      );
    });
  };

  /**
   * Inicia o monitoramento contÃ­nuo da posiÃ§Ã£o
   */
  const startWatching = () => {
    if (!isSupported.value) {
      error.value = "GeolocalizaÃ§Ã£o nÃ£o suportada neste navegador.";
      return;
    }

    if (watchId !== null) {
      stopWatching();
    }

    isLoading.value = true;
    error.value = null;

    watchId = navigator.geolocation.watchPosition(onSuccess, onError, geolocationOptions);
  };

  /**
   * Para o monitoramento da posiÃ§Ã£o
   */
  const stopWatching = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  };

  /**
   * Solicita permissÃ£o de localizaÃ§Ã£o ao usuÃ¡rio
   */
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported.value) {
      error.value = "GeolocalizaÃ§Ã£o nÃ£o suportada neste navegador.";
      return false;
    }

    try {
      // Tenta obter a posiÃ§Ã£o para disparar o prompt de permissÃ£o
      const result = await getCurrentPosition();
      return result !== null;
    } catch {
      return false;
    }
  };

  // Se watch estiver ativado, inicia automaticamente
  onMounted(() => {
    if (watch && isSupported.value) {
      startWatching();
    }
  });

  // Limpa o watch ao desmontar
  onUnmounted(() => {
    stopWatching();
  });

  return {
    // Estado
    position,
    error,
    isLoading,
    isSupported,

    // MÃ©todos
    getCurrentPosition,
    startWatching,
    stopWatching,
    requestPermission,
  };
};
