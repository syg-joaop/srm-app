import { supplierQuerySchema } from '~/server/schemas/supplier.schema'

export default defineEventHandler(async (event) => {
  try {
    // Validar query parameters
    const rawQuery = getQuery(event)
    const query = supplierQuerySchema.parse(rawQuery)

    // Buscar fornecedores na API externa
    const apiClient = createApiClient(event)
    const data = await apiClient('/suppliers', {
      query
    })

    return data
  } catch (error: any) {
    console.error('[Suppliers Error]', error)

    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        message: 'Parâmetros de busca inválidos',
        data: error.errors
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao buscar fornecedores'
    })
  }
})
