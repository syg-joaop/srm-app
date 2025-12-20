import type { CheckinFilters, PaginatedCheckinResponse } from "../checkin.types";

const CHECKINS_LIST_ENDPOINT = "/sygecom/chameleon-mode/SRM_GET_CHECKIN";

export const useCheckinService = () => {
  const fetchCheckins = useOfflineAsyncData<PaginatedCheckinResponse, CheckinFilters>({
    key: "checkins",
    endpoint: CHECKINS_LIST_ENDPOINT,
    buildBody: buildPagedBody,
    homol: true,
    cacheTtl: 1 * 60 * 1000,
  });

  return { fetchCheckins };
};
