/**
 * Server middleware para verificar autenticação em todas as rotas da API
 * (exceto rotas públicas como /api/auth/login)
 */
export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  // Rotas públicas que não precisam de autenticação
  const publicPaths = [
    '/api/login',
    '/api/logout'
  ]

  // Se é rota pública, permitir
  if (publicPaths.some(path => url.pathname.startsWith(path))) {
    return
  }

  // Se não é rota de API, permitir (assets, etc.)
  if (!url.pathname.startsWith('/api/')) {
    return
  }

  // Verificar se tem token
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Não autenticado. Faça login para acessar este recurso.'
    })
  }

  // Token existe, permitir request continuar
})
