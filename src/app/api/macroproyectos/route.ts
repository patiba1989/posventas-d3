import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server-auth"
import type { MacroproyectoAPI, ProyectoAPI } from "@/types/posventa"

export async function GET() {
  try {
    const macros = await serverFetch<MacroproyectoAPI[]>("/Macroproyectos/Basica")

    // Para cada macroproyecto, obtener sus proyectos
    const macrosConProyectos = await Promise.all(
      macros.map(async (macro) => {
        const proyectos = await serverFetch<ProyectoAPI[]>(
          `/PosVentaAPI/ProyectosPorMacro/${macro.id}`
        )
        // Filtrar solo proyectos con marcaWebService === 1
        const proyectosFiltrados = proyectos.filter((p) => p.marcaWebService === 1)
        return {
          id: macro.id,
          nombre: macro.nombre.trim(),
          proyectos: proyectosFiltrados,
        }
      })
    )

    // Solo devolver macroproyectos que tengan al menos un proyecto válido
    const resultado = macrosConProyectos.filter((m) => m.proyectos.length > 0)

    return NextResponse.json(resultado)
  } catch (error) {
    console.error("Error obteniendo macroproyectos:", error)
    return NextResponse.json(
      { error: "Error al obtener macroproyectos" },
      { status: 500 }
    )
  }
}
