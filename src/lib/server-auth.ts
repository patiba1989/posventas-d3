import { cookies } from "next/headers"

const TOKEN_COOKIE_NAME = "api_token"

// Funciones para obtener variables de entorno (se leen en cada llamada para soportar hot-reload)
function getApiAuthUrl() {
  return process.env.API_AUTH_URL || ""
}

function getApiBaseUrl() {
  return process.env.API_BASE_URL || ""
}

function getApiCredentials() {
  return {
    username: process.env.API_USERNAME || "",
    password: process.env.API_PASSWORD || "",
  }
}

export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value || null
}

export async function refreshServerToken(): Promise<string | null> {
  const apiAuthUrl = getApiAuthUrl()
  const { username, password } = getApiCredentials()

  if (!apiAuthUrl || !username || !password) {
    return null
  }

  const response = await fetch(`${apiAuthUrl}/Auth/Usuario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      NomUsuario: username,
      ClaveUsuario: password,
    }),
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  const cookieStore = await cookies()

  cookieStore.set(TOKEN_COOKIE_NAME, data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: data.expires_in || 3600,
    path: "/",
  })

  return data.access_token
}

export async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let token = await getServerToken()

  // Si no hay token, intentar obtener uno nuevo
  if (!token) {
    token = await refreshServerToken()
    if (!token) {
      throw new Error("No se pudo autenticar con el API")
    }
  }

  const baseUrl = getApiBaseUrl()
  console.log(`[DEBUG] Fetching: ${baseUrl}${endpoint}`)

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  // Si el token expiró, renovar y reintentar
  if (response.status === 401) {
    token = await refreshServerToken()
    if (!token) {
      throw new Error("No se pudo renovar la autenticación")
    }

    const retryResponse = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })

    if (!retryResponse.ok) {
      throw new Error(`Error en la petición: ${retryResponse.status}`)
    }

    return retryResponse.json()
  }

  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.status}`)
  }

  return response.json()
}
