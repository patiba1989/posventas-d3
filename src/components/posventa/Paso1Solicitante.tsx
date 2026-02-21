"use client"

import type { usePosventaWizard } from "@/hooks/usePosventaWizard"
import { cn } from "@/lib/utils"

interface Paso1SolicitanteProps {
  wizard: ReturnType<typeof usePosventaWizard>
}

const TIPOS_DOCUMENTO = [
  { value: "CC", label: "Cedula de Ciudadania" },
  { value: "NIT", label: "NIT" },
  { value: "NIUP", label: "NIUP" },
  { value: "CE", label: "Cedula de Extranjeria" },
  { value: "PA", label: "Pasaporte" },
]

export function Paso1Solicitante({ wizard }: Paso1SolicitanteProps) {
  const { solicitante, setSolicitante } = wizard

  const handleChange = (field: keyof typeof solicitante, value: string) => {
    setSolicitante((prev) => ({ ...prev, [field]: value }))
  }

  const inputStyles = cn(
    "w-full rounded border border-[#bbb] px-3 py-2.5 text-sm text-[#333] bg-white",
    "focus:border-[#434E72] focus:outline-none focus:ring-2 focus:ring-[#434E72]/20",
    "placeholder:text-[#999] transition-colors duration-200"
  )

  const labelStyles = "block text-sm font-medium text-[#333] mb-1"

  return (
    <div className="space-y-6">
      <div className="border-b border-[#ddd] pb-4">
        <h2 className="text-xl font-semibold text-[#333]">
          Datos del Solicitante
        </h2>
        <p className="text-sm text-[#666] mt-1">
          Ingrese la informacion de la persona que realiza la solicitud de posventa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nombres" className={labelStyles}>
            Nombres <span className="text-[#434E72]">*</span>
          </label>
          <input
            type="text"
            id="nombres"
            value={solicitante.nombres}
            onChange={(e) => handleChange("nombres", e.target.value)}
            placeholder="Ingrese sus nombres"
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="apellidos" className={labelStyles}>
            Apellidos <span className="text-[#434E72]">*</span>
          </label>
          <input
            type="text"
            id="apellidos"
            value={solicitante.apellidos}
            onChange={(e) => handleChange("apellidos", e.target.value)}
            placeholder="Ingrese sus apellidos"
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="tipoDocumento" className={labelStyles}>
            Tipo de Documento <span className="text-[#434E72]">*</span>
          </label>
          <select
            id="tipoDocumento"
            value={solicitante.tipoDocumento}
            onChange={(e) => handleChange("tipoDocumento", e.target.value)}
            className={inputStyles}
          >
            <option value="">Seleccione tipo de documento</option>
            {TIPOS_DOCUMENTO.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="numeroDocumento" className={labelStyles}>
            Numero de Documento <span className="text-[#434E72]">*</span>
          </label>
          <input
            type="text"
            id="numeroDocumento"
            value={solicitante.numeroDocumento}
            onChange={(e) => handleChange("numeroDocumento", e.target.value)}
            placeholder="Ingrese numero de documento"
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="celular" className={labelStyles}>
            Celular <span className="text-[#434E72]">*</span>
          </label>
          <input
            type="tel"
            id="celular"
            value={solicitante.celular}
            onChange={(e) => handleChange("celular", e.target.value)}
            placeholder="Ingrese numero de celular"
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="telefono" className={labelStyles}>
            Teléfono Fijo <span className="text-[#666] text-xs">(opcional)</span>
          </label>
          <input
            type="tel"
            id="telefono"
            value={solicitante.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
            placeholder="Ingrese telefono fijo"
            className={inputStyles}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="email" className={labelStyles}>
            Correo Electronico <span className="text-[#434E72]">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={solicitante.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="ejemplo@correo.com"
            className={inputStyles}
          />
        </div>
      </div>
    </div>
  )
}
