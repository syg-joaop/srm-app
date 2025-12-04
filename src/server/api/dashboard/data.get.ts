import { dashboardApiResponseSchema } from '~/server/schemas/dashboard.schema'

export default defineEventHandler(async (event) => {
  try {
    // Buscar dados do dashboard na API externa
    const apiClient = createApiClient(event)
    const data = await apiClient('/dashboard')

    // Validar resposta com Zod
    const validatedData = dashboardApiResponseSchema.parse(data)

    return validatedData
  } catch (error: any) {
    console.error('[Dashboard Error]', error)

    // Se erro de validação Zod
    if (error.name === 'ZodError') {
      console.error('[Validation Error]', error.errors)
      throw createError({
        statusCode: 500,
        message: 'Erro ao validar dados do dashboard',
        data: error.errors
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao buscar dados do dashboard'
    })
  }
})
