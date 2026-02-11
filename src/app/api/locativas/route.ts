import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server-auth"
import type { Locativa } from "@/types/posventa"

export async function GET() {
  try {
    const data = await serverFetch<Locativa[]>("/PosVentaAPI/Locativas")

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error obteniendo locativas:", error)
    return NextResponse.json(
      { error: "Error al obtener locativas" },
      { status: 500 }
    )
  }
}
