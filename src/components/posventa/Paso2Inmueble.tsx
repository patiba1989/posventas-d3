"use client"

import type { usePosventaWizard } from "@/hooks/usePosventaWizard"
import { cn } from "@/lib/utils"

interface Paso2InmuebleProps {
  wizard: ReturnType<typeof usePosventaWizard>
}

export function Paso2Inmueble({ wizard }: Paso2InmuebleProps) {
  const {
    inmueble,
    macroproyectos,
    getMacrosUnicos,
    getProyectosByMacro,
    inmuebles,
    isLoadingMacroproyectos,
    isLoadingInmuebles,
    isLoadingInfoInmueble,
    handleMacroproyectoChange,
    handleProyectoChange,
    handleInmuebleChange,
    garantiaWarning,
  } = wizard

  const macrosUnicos = getMacrosUnicos()
  const proyectos = inmueble.idMacroproyecto
    ? getProyectosByMacro(inmueble.idMacroproyecto)
    : []

  const inputStyles = cn(
    "w-full rounded border border-[#bbb] px-3 py-2.5 text-sm text-[#333] bg-white",
    "focus:border-[#434E72] focus:outline-none focus:ring-2 focus:ring-[#434E72]/20",
    "placeholder:text-[#999] transition-colors duration-200",
    "disabled:bg-[#f5f5f5] disabled:text-[#999] disabled:cursor-not-allowed"
  )

  const labelStyles = "block text-sm font-medium text-[#333] mb-1"

  return (
    <div className="space-y-6">
      <div className="border-b border-[#ddd] pb-4">
        <h2 className="text-xl font-semibold text-[#333]">
          Informacion del Inmueble
        </h2>
        <p className="text-sm text-[#666] mt-1">
          Seleccione el proyecto e inmueble relacionado con la solicitud de posventa.
        </p>
      </div>

      {garantiaWarning && (
        <div className="rounded bg-amber-50 border border-amber-300 p-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm text-amber-700">{garantiaWarning}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Macroproyecto */}
        <div>
          <label htmlFor="macroproyecto" className={labelStyles}>
            Macroproyecto <span className="text-[#434E72]">*</span>
          </label>
          <select
            id="macroproyecto"
            value={inmueble.idMacroproyecto ?? ""}
            onChange={(e) =>
              handleMacroproyectoChange(
                e.target.value ? Number(e.target.value) : null
              )
            }
            disabled={isLoadingMacroproyectos}
            className={inputStyles}
          >
            <option value="">
              {isLoadingMacroproyectos
                ? "Cargando..."
                : "Seleccione un macroproyecto"}
            </option>
            {macrosUnicos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Proyecto */}
        <div>
          <label htmlFor="proyecto" className={labelStyles}>
            Proyecto <span className="text-[#434E72]">*</span>
          </label>
          <select
            id="proyecto"
            value={inmueble.idProyecto ?? ""}
            onChange={(e) =>
              handleProyectoChange(e.target.value ? Number(e.target.value) : null)
            }
            disabled={!inmueble.idMacroproyecto}
            className={inputStyles}
          >
            <option value="">
              {!inmueble.idMacroproyecto
                ? "Primero seleccione un macroproyecto"
                : "Seleccione un proyecto"}
            </option>
            {proyectos.map((p) => (
              <option key={p.idProyecto} value={p.idProyecto}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Inmueble */}
        <div className="md:col-span-2">
          <label htmlFor="inmueble" className={labelStyles}>
            Inmueble <span className="text-[#434E72]">*</span>
          </label>
          <select
            id="inmueble"
            value={inmueble.idInmueble ?? ""}
            onChange={(e) =>
              handleInmuebleChange(e.target.value ? Number(e.target.value) : null)
            }
            disabled={!inmueble.idProyecto || isLoadingInmuebles}
            className={inputStyles}
          >
            <option value="">
              {isLoadingInmuebles
                ? "Cargando inmuebles..."
                : !inmueble.idProyecto
                  ? "Primero seleccione un proyecto"
                  : inmuebles.length === 0
                    ? "No hay inmuebles vendidos"
                    : "Seleccione un inmueble"}
            </option>
            {inmuebles.map((i) => (
              <option key={i.id} value={i.id}>
                {i.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Información del inmueble seleccionado */}
      {inmueble.idInmueble && (
        <div className="mt-6 p-5 bg-[#f9fafb] rounded border border-[#ddd]">
          <h3 className="text-sm font-semibold text-[#333] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#2ea3f2] rounded-full"></span>
            Informacion del Inmueble
          </h3>

          {isLoadingInfoInmueble ? (
            <div className="flex items-center gap-2 text-[#666]">
              <svg
                className="animate-spin h-5 w-5 text-[#434E72]"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Cargando informacion...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#666] mb-1">
                  Fecha de Entrega
                </label>
                <input
                  type="text"
                  value={
                    inmueble.fechaEntrega
                      ? new Date(inmueble.fechaEntrega).toLocaleDateString(
                          "es-CO"
                        )
                      : "Sin fecha de entrega"
                  }
                  readOnly
                  className="w-full rounded border border-[#ddd] bg-white px-3 py-2 text-sm text-[#333]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#666] mb-1">
                  Propietario
                </label>
                <input
                  type="text"
                  value={inmueble.propietario || "Sin informacion"}
                  readOnly
                  className="w-full rounded border border-[#ddd] bg-white px-3 py-2 text-sm text-[#333]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#666] mb-1">
                  Numero de Inmueble
                </label>
                <input
                  type="text"
                  value={inmueble.numeroInmueble || "Sin informacion"}
                  readOnly
                  className="w-full rounded border border-[#ddd] bg-white px-3 py-2 text-sm text-[#333]"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
