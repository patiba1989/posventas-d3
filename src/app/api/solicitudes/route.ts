import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server-auth"
import type { NuevaSolicitudRequest } from "@/types/posventa"

export async function POST(request: Request) {
  try {
    const solicitud: NuevaSolicitudRequest = await request.json()

    const response = await serverFetch<string>("/PosVentaAPI/NuevaSolicitud", {
      method: "POST",
      body: JSON.stringify(solicitud),
    })

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error("Error creando solicitud:", error)
    return NextResponse.json(
      { error: "Error al crear solicitud" },
      { status: 500 }
    )
  }
}
