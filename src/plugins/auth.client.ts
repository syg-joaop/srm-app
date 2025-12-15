import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin(async () => {
  await useAuthStore().initAuth();
});
