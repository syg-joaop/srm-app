import {
  loginCredentialsSchema,
  loginResponseSchema,
} from "~/server/schemas/auth.schema";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const credentials = loginCredentialsSchema.parse(body);

    const apiBody = {
      email: credentials.email,
      password: credentials.password,
      origem: "SRM",
      homol: false,
      ...(credentials.colaborador && { colaborador: credentials.colaborador }),
      ...(credentials.password_colaborador && {
        password_colaborador: credentials.password_colaborador,
      }),
    };

    const config = useRuntimeConfig(event);
    const apiBaseUrl = String(config.apiBaseUrl ?? "");
    const apiSecret = String(config.apiSecret ?? "");

    if (!apiBaseUrl) {
      throw createError({
        statusCode: 500,
        message: "Configuração de API ausente (API_LOGIN)",
      });
    }

    if (!apiSecret) {
      throw createError({
        statusCode: 500,
        message: "Configuração de API ausente (API_SECRET)",
      });
    }

    const response = await $fetch("/login", {
      method: "POST",
      baseURL: apiBaseUrl,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-secret": apiSecret,
      },
      body: apiBody,
    });

    // Validar resposta da API com Zod
    const validatedResponse = loginResponseSchema.parse(response);

    // Se login bem-sucedido, extrair token e setar cookie
    if (validatedResponse.user && validatedResponse.user.length > 0) {
      const user = validatedResponse.user[0];

      if (user.token) {
        // Setar cookie httpOnly com o token
        setCookie(event, "auth_token", user.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // 7 dias
          path: "/",
        });
      }
    }

    const sanitizedResponse = {
      ...validatedResponse,
      user: validatedResponse.user.map((u) => {
        const { token: _token, ...safeUser } = u as any;
        return safeUser;
      }),
    };

    return sanitizedResponse;
  } catch (error: any) {
    console.error("[Login Error]", error);

    // Se erro de validação Zod
    if (error.name === "ZodError") {
      throw createError({
        statusCode: 400,
        message: "Dados inválidos",
        data: error.errors,
      });
    }

    // Outros erros
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erro ao fazer login",
    });
  }
});
