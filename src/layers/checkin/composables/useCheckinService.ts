import { z } from "zod";

import { createListService } from "~/composables/factories/createListService";
import { checkinResponseSchema, checkinFiltersSchema } from "../schemas/checkin.schema";

type CheckinResponse = z.infer<typeof checkinResponseSchema>;
type CheckinFilters = z.infer<typeof checkinFiltersSchema>;

const ENDPOINT = "/sygecom/chameleon-mode/SRM_GET_CHECKIN";

export const useCheckinService = () => {
  const { fetchList } = createListService<CheckinResponse, CheckinFilters>(ENDPOINT);
  return { fetchCheckins: fetchList };
};
