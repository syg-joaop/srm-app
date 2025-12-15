import { schemaQueryFornecedor } from "~/server/schemas/fornecedores.schema";

export default defineEventHandler(async (event) => {
  try {
    const rawQuery = getQuery(event);
    const query = schemaQueryFornecedor.parse(rawQuery);

    const apiClient = createApiClient(event, "v1");
    const data = await apiClient("/suppliers", {
      query,
    });

    return data;
  } catch (error: any) {
    console.error("[Suppliers Error]", error);

    if (error.name === "ZodError") {
      throw createError({
        statusCode: 400,
        message: "Parâmetros de busca inválidos",
        data: error.errors,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erro ao buscar fornecedores",
    });
  }
});
