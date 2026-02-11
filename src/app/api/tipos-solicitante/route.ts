import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server-auth"
import type { TipoPersona } from "@/types/posventa"

export async function GET() {
  try {
    const data = await serverFetch<TipoPersona[]>("/PosVentaAPI/TipoPersonaSolicita")

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error obteniendo tipos de solicitante:", error)
    return NextResponse.json(
      { error: "Error al obtener tipos de solicitante" },
      { status: 500 }
    )
  }
}
