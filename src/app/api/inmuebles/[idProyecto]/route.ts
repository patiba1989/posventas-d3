import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server-auth"
import type { Agrupacion } from "@/types/posventa"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ idProyecto: string }> }
) {
  try {
    const { idProyecto } = await params
    const data = await serverFetch<Agrupacion[]>(
      `/Agrupaciones/IdProyecto/${idProyecto}`
    )
    // Filtrar solo inmuebles vendidos
    const inmueblesFiltrados = data.filter((a) => a.estado === "VENDIDO")

    return NextResponse.json(inmueblesFiltrados)
  } catch (error) {
    console.error("Error obteniendo inmuebles:", error)
    return NextResponse.json(
      { error: "Error al obtener inmuebles" },
      { status: 500 }
    )
  }
}
