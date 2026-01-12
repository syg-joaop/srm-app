import { z } from "zod";

import { checkinResponseSchema, checkinFiltersSchema } from "../schemas/checkin.schema";
import { buildPagedBody } from "~/utils/pagination";

type CheckinResponse = z.infer<typeof checkinResponseSchema>;
type CheckinFilters = z.infer<typeof checkinFiltersSchema>;

const CHECKINS_LIST_ENDPOINT = "/sygecom/chameleon-mode/SRM_GET_CHECKIN";

export const useCheckinService = () => {
  const fetchCheckins = useOfflineAsyncData<CheckinResponse, CheckinFilters>({
    key: "checkins",
    endpoint: CHECKINS_LIST_ENDPOINT,
    buildBody: buildPagedBody,
    homol: true,
    cacheTtl: 1 * 60 * 1000,
    schema: checkinResponseSchema,
  });

  return { fetchCheckins };
};
