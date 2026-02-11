"use client"

import { useRef } from "react"
import type { usePosventaWizard } from "@/hooks/usePosventaWizard"
import { cn } from "@/lib/utils"

interface Paso4AdjuntosProps {
  wizard: ReturnType<typeof usePosventaWizard>
}

export function Paso4Adjuntos({ wizard }: Paso4AdjuntosProps) {
  const { adjuntos, addAdjunto, removeAdjunto } = wizard
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          addAdjunto(file)
        }
      })
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[#ddd] pb-4">
        <h2 className="text-xl font-semibold text-[#333]">
          Archivos Adjuntos
        </h2>
        <p className="text-sm text-[#666] mt-1">
          Adjunte imagenes como evidencia de la solicitud (opcional). Tamaño maximo: 5MB por archivo.
        </p>
      </div>

      {/* Zona de carga */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed border-[#bbb] rounded p-8",
          "flex flex-col items-center justify-center cursor-pointer",
          "hover:border-[#434E72] hover:bg-[#f5f6f8] transition-all duration-200"
        )}
      >
        <svg
          className="w-12 h-12 text-[#434E72] mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm text-[#333] font-medium mb-1">
          Haga clic para seleccionar imagenes
        </p>
        <p className="text-xs text-[#666]">
          PNG, JPG, GIF hasta 5MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Lista de archivos adjuntos */}
      {adjuntos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#333] flex items-center gap-2">
            <span className="w-2 h-2 bg-[#82c0c7] rounded-full"></span>
            Archivos seleccionados ({adjuntos.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {adjuntos.map((adjunto) => (
              <div
                key={adjunto.id}
                className="relative group border border-[#ddd] rounded overflow-hidden shadow-sm"
              >
                <img
                  src={adjunto.preview}
                  alt={adjunto.file.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all">
                  <button
                    onClick={() => removeAdjunto(adjunto.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Eliminar"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-2 bg-[#f9fafb]">
                  <p className="text-xs text-[#333] truncate font-medium">
                    {adjunto.file.name}
                  </p>
                  <p className="text-xs text-[#666]">
                    {formatFileSize(adjunto.file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {adjuntos.length === 0 && (
        <div className="text-center py-8 text-[#666] bg-[#f9fafb] rounded border border-[#ddd]">
          <p className="text-sm">No hay archivos adjuntos</p>
          <p className="text-xs mt-1 text-[#999]">
            Los archivos adjuntos son opcionales
          </p>
        </div>
      )}
    </div>
  )
}
