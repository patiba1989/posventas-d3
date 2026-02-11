import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server-auth"
import type { VentaInfo } from "@/types/posventa"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ idVenta: string }> }
) {
  try {
    const { idVenta } = await params
    const data = await serverFetch<VentaInfo>(`/Ventas/IdVenta/${idVenta}`)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error obteniendo info de venta:", error)
    return NextResponse.json(
      { error: "Error al obtener información de venta" },
      { status: 500 }
    )
  }
}
