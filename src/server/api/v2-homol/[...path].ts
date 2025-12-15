export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') ?? ''
  const method = getMethod(event)
  const query = getQuery(event)
  const body =
    method === 'GET' || method === 'HEAD' ? undefined : await readBody(event)

  const apiClient = createApiClient(event, 'v2Homol')

  return await apiClient(`/${path}`, {
    method,
    query,
    body
  })
})

