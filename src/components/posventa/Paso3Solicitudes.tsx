"use client"

import type { usePosventaWizard } from "@/hooks/usePosventaWizard"
import { cn } from "@/lib/utils"

interface Paso3SolicitudesProps {
  wizard: ReturnType<typeof usePosventaWizard>
}

export function Paso3Solicitudes({ wizard }: Paso3SolicitudesProps) {
  const {
    solicitudes,
    tiposSolicitante,
    tiposEspacio,
    getLocativasPadre,
    getLocativasHijo,
    isLoadingTiposSolicitante,
    isLoadingEspacios,
    isLoadingLocativas,
    addSolicitud,
    removeSolicitud,
    updateSolicitud,
    validarGarantia,
  } = wizard

  const locativasPadre = getLocativasPadre()

  const inputStyles = cn(
    "w-full rounded border border-[#bbb] px-3 py-2 text-sm text-[#333] bg-white",
    "focus:border-[#434E72] focus:outline-none focus:ring-2 focus:ring-[#434E72]/20",
    "placeholder:text-[#999] transition-colors duration-200",
    "disabled:bg-[#f5f5f5] disabled:text-[#999] disabled:cursor-not-allowed"
  )

  const labelStyles = "block text-xs font-medium text-[#666] mb-1"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#ddd] pb-4">
        <div>
          <h2 className="text-xl font-semibold text-[#333]">
            Detalle de Solicitudes
          </h2>
          <p className="text-sm text-[#666] mt-1">
            Agregue las solicitudes de servicio (maximo 10).
          </p>
        </div>
        <button
          onClick={addSolicitud}
          disabled={solicitudes.length >= 10}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium transition-all duration-200 border-2",
            "bg-[#434E72] border-[#434E72] text-white hover:bg-[#363f5c] hover:border-[#363f5c]",
            "disabled:bg-[#ddd] disabled:border-[#ddd] disabled:text-[#999] disabled:cursor-not-allowed"
          )}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Agregar
        </button>
      </div>

      <p className="text-xs text-[#888] italic leading-relaxed text-justify">
        Disclaimer: En caso de no ser propietario, debe adjuntar la autorización debidamente firmada
        para proceder y tener en cuenta su solicitud. Declaro que la información suministrada es veraz.
      </p>

      <div className="space-y-4">
        {solicitudes.map((solicitud, index) => {
          const locativasHijo = getLocativasHijo(solicitud.locativaPadre)
          const garantia = solicitud.locativaHijo
            ? validarGarantia(solicitud.locativaHijo)
            : null

          return (
            <div
              key={solicitud.id}
              className="p-5 border border-[#ddd] rounded bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#eee]">
                <span className="text-sm font-semibold text-[#434E72]">
                  Solicitud #{index + 1}
                </span>
                {solicitudes.length > 1 && (
                  <button
                    onClick={() => removeSolicitud(solicitud.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                    title="Eliminar solicitud"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {garantia && !garantia.valido && (
                <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded">
                  <p className="text-sm text-red-700">{garantia.mensaje}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tipo Solicitante */}
                <div>
                  <label className={labelStyles}>Tipo Solicitante</label>
                  <select
                    value={solicitud.tipoSolicitante ?? ""}
                    onChange={(e) =>
                      updateSolicitud(
                        solicitud.id,
                        "tipoSolicitante",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    disabled={isLoadingTiposSolicitante}
                    className={inputStyles}
                  >
                    <option value="">Seleccione...</option>
                    {tiposSolicitante.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.descripcion}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo Espacio */}
                <div>
                  <label className={labelStyles}>Tipo Espacio</label>
                  <select
                    value={solicitud.tipoEspacio ?? ""}
                    onChange={(e) =>
                      updateSolicitud(
                        solicitud.id,
                        "tipoEspacio",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    disabled={isLoadingEspacios || tiposEspacio.length === 0}
                    className={inputStyles}
                  >
                    <option value="">
                      {isLoadingEspacios ? "Cargando..." : "Seleccione..."}
                    </option>
                    {tiposEspacio.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.descripcion}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Locativa (Padre) */}
                <div>
                  <label className={labelStyles}>Locativa</label>
                  <select
                    value={solicitud.locativaPadre}
                    onChange={(e) =>
                      updateSolicitud(solicitud.id, "locativaPadre", e.target.value)
                    }
                    disabled={isLoadingLocativas}
                    className={inputStyles}
                  >
                    <option value="">
                      {isLoadingLocativas ? "Cargando..." : "Seleccione..."}
                    </option>
                    {locativasPadre.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Servicio (Hijo) */}
                <div>
                  <label className={labelStyles}>Servicio</label>
                  <select
                    value={solicitud.locativaHijo}
                    onChange={(e) =>
                      updateSolicitud(solicitud.id, "locativaHijo", e.target.value)
                    }
                    disabled={!solicitud.locativaPadre}
                    className={inputStyles}
                  >
                    <option value="">
                      {!solicitud.locativaPadre
                        ? "Primero seleccione locativa"
                        : "Seleccione..."}
                    </option>
                    {locativasHijo.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Detalles */}
              <div className="mt-4">
                <label className={labelStyles}>Detalles de la Solicitud</label>
                <textarea
                  value={solicitud.detalles}
                  onChange={(e) =>
                    updateSolicitud(solicitud.id, "detalles", e.target.value)
                  }
                  rows={3}
                  placeholder="Describa detalladamente el problema o solicitud..."
                  className={cn(inputStyles, "resize-none")}
                />
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-sm text-[#666]">
        <span className="font-medium text-[#434E72]">{solicitudes.length}</span> de 10 solicitudes agregadas
      </p>
    </div>
  )
}
