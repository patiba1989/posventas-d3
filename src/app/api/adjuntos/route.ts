import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server-auth"

interface AdjuntoRequest {
  filename: string
  idSolicitud: number
  archivo: string
  tipoArchivo: string
}

export async function POST(request: Request) {
  try {
    const { filename, idSolicitud, archivo, tipoArchivo }: AdjuntoRequest =
      await request.json()

    await serverFetch(
      `/PosVentaAPI/${filename}/ArchivoDe/1/IdSolicitud/${idSolicitud}`,
      {
        method: "POST",
        body: JSON.stringify({
          archivo,
          tipoArchivo,
        }),
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error subiendo adjunto:", error)
    return NextResponse.json(
      { error: "Error al subir adjunto" },
      { status: 500 }
    )
  }
}
