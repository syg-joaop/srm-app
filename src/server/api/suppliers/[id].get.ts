import { schemaFornecedor } from "~/server/schemas/fornecedores.schema";

export default defineEventHandler(async (event) => {
  try {
    // Extrair ID da rota
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        message: "ID do fornecedor é obrigatório",
      });
    }

    // Buscar fornecedor na API externa
    const apiClient = createApiClient(event, "v1");
    const data = await apiClient(`/suppliers/${id}`);

    // Validar resposta
    const validatedSupplier = schemaFornecedor.parse(data);

    return validatedSupplier;
  } catch (error: any) {
    console.error("[Supplier Detail Error]", error);

    if (error.name === "ZodError") {
      throw createError({
        statusCode: 500,
        message: "Erro ao validar dados do fornecedor",
        data: error.errors,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erro ao buscar fornecedor",
    });
  }
});
