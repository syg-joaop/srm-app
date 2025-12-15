export default defineEventHandler((event) => {
  const token = getCookie(event, "auth_token");

  if (!token) {
    throw createError({
      statusCode: 401,
      message: "Não autenticado",
    });
  }

  return { authenticated: true };
});

