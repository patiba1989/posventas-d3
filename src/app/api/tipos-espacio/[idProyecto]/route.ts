import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server-auth"
import type { TipoEspacio } from "@/types/posventa"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ idProyecto: string }> }
) {
  try {
    const { idProyecto } = await params
    const data = await serverFetch<TipoEspacio[]>(
      `/PosVentaAPI/TipoEsspacio/${idProyecto}`
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error obteniendo tipos de espacio:", error)
    return NextResponse.json(
      { error: "Error al obtener tipos de espacio" },
      { status: 500 }
    )
  }
}
