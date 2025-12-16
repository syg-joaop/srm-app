import { useAuthStore } from "~/stores/auth";
import type { CheckinFilters, PaginatedCheckinResponse } from "../checkin.types";
import type { Ref } from "vue";

export const useCheckinService = () => {
  const api = useMainApi(true);
  const authStore = useAuthStore();

  const fetchCheckins = (page: Ref<number>, size: Ref<number>, filters: Ref<CheckinFilters>) => {
    return useAsyncData<PaginatedCheckinResponse>(
      "checkins",
      async () => {
        const bodyParams: Record<string, unknown> = {
          page: page.value,
          size: size.value,
          ...filters.value,
        };

        return api("/sygecom/chameleon-mode/SRM_GET_CHECKIN", {
          method: "POST",
          body: bodyParams,
        });
      },
      {
        immediate: authStore.isAuthenticated,
        lazy: true,
        watch: [page, filters],
      },
    );
  };

  return { fetchCheckins };
};
