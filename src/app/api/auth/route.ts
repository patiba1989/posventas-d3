import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// URL para autenticación: https://pruebas.sincoerp.com:7342/SincoD3_PRBINT/V3/API
const API_AUTH_URL = process.env.API_AUTH_URL || ""
const API_USERNAME = process.env.API_USERNAME || ""
const API_PASSWORD = process.env.API_PASSWORD || ""

const TOKEN_COOKIE_NAME = "api_token"

export async function POST() {
  try {
    if (!API_AUTH_URL || !API_USERNAME || !API_PASSWORD) {
      return NextResponse.json(
        { error: "Configuracion de API incompleta" },
        { status: 500 }
      )
    }

    const response = await fetch(`${API_AUTH_URL}/Auth/Usuario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        NomUsuario: API_USERNAME,
        ClaveUsuario: API_PASSWORD,
      }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error de autenticacion" },
        { status: 401 }
      )
    }

    const data = await response.json()

    // Almacenar el token en una cookie HTTP-only (no accesible desde JavaScript)
    const cookieStore = await cookies()
    cookieStore.set(TOKEN_COOKIE_NAME, data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: data.expires_in || 3600,
      path: "/",
    })

    // NO devolver el token en la respuesta - solo confirmar autenticación exitosa
    return NextResponse.json({
      authenticated: true,
      expiresIn: data.expires_in,
    })
  } catch (error) {
    console.error("Error en autenticacion:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// Endpoint para cerrar sesión (eliminar el token)
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_COOKIE_NAME)

  return NextResponse.json({ success: true })
}
