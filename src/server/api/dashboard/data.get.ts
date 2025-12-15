import { dashboardApiResponseSchema } from "~/server/schemas/dashboard.schema";

export default defineEventHandler(async (event) => {
  try {
    const apiClient = createApiClient(event, "v1");
    const data = await apiClient("/dashboard");
    return dashboardApiResponseSchema.parse(data);
  } catch (error: any) {
    console.error("[Dashboard Error]", error);

    if (error.name === "ZodError") {
      throw createError({
        statusCode: 500,
        message: "Erro ao validar dados do dashboard",
        data: error.errors,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erro ao buscar dados do dashboard",
    });
  }
});
