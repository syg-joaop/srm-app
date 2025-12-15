import type { $Fetch } from "ofetch";

const createApiClient = (baseURL: string): $Fetch => {
  return $fetch.create({
    baseURL,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    onResponseError({ response }) {
      console.error(`[API Error] ${response.status}`, {
        url: response.url,
        data: response._data,
      });
    },
  });
};

export const useMainApi = (homol?: boolean) => {
  return createApiClient(homol ? "/api/v2-homol" : "/api/v2");
};

export const useAuthApi = () => {
  return createApiClient("/api");
};

