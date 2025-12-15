export default defineEventHandler((event) => {
  const { pathname } = getRequestURL(event);

  if (!pathname.startsWith("/api/")) return;

  const publicPaths = ["/api/login", "/api/logout"];
  if (publicPaths.some((path) => pathname.startsWith(path))) return;

  const token = getCookie(event, "auth_token");
  if (!token) {
    throw createError({
      statusCode: 401,
      message: "Não autenticado. Faça login para acessar este recurso.",
    });
  }
});
