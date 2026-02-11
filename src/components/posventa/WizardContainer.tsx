"use client"

import { useEffect, useState, useCallback } from "react"
import { usePosventaWizard } from "@/hooks/usePosventaWizard"
import { Paso1Solicitante } from "./Paso1Solicitante"
import { Paso2Inmueble } from "./Paso2Inmueble"
import { Paso3Solicitudes } from "./Paso3Solicitudes"
import { Paso4Adjuntos } from "./Paso4Adjuntos"
import { ToastContainer } from "@/components/ui/Toast"
import { cn } from "@/lib/utils"

interface ToastItem {
  id: string
  type: "success" | "error" | "warning" | "info"
  message: string
}

// Iconos para cada paso
const StepIcons = {
  // Icono de persona para Solicitante
  solicitante: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  // Icono de casa para Inmueble
  inmueble: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  // Icono de documento/lista para Solicitud
  solicitud: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  // Icono de clip/adjunto para Adjuntos
  adjuntos: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  ),
  // Icono de check para pasos completados
  check: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
}

const STEPS = [
  { number: 1, title: "Solicitante", icon: "solicitante" as const },
  { number: 2, title: "Inmueble", icon: "inmueble" as const },
  { number: 3, title: "Solicitud", icon: "solicitud" as const },
  { number: 4, title: "Adjuntos", icon: "adjuntos" as const },
]

export function WizardContainer() {
  const wizard = usePosventaWizard()
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((type: ToastItem["type"], message: string) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, type, message }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  // Mostrar toast cuando hay error
  useEffect(() => {
    if (wizard.error) {
      addToast("error", wizard.error)
      wizard.clearMessages()
    }
  }, [wizard.error, addToast, wizard.clearMessages])

  // Mostrar toast cuando hay éxito
  useEffect(() => {
    if (wizard.successMessage) {
      addToast("success", wizard.successMessage)
    }
  }, [wizard.successMessage, addToast])

  const renderStep = () => {
    switch (wizard.currentStep) {
      case 1:
        return <Paso1Solicitante wizard={wizard} />
      case 2:
        return <Paso2Inmueble wizard={wizard} />
      case 3:
        return <Paso3Solicitudes wizard={wizard} />
      case 4:
        return <Paso4Adjuntos wizard={wizard} />
      default:
        return null
    }
  }

  return (
    <div className="w-full">
      {/* Toasts flotantes */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Mensaje de éxito con opción de nueva solicitud */}
      {wizard.successMessage && (
        <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            ¡Solicitud enviada exitosamente!
          </h3>
          <p className="text-green-700 mb-4">{wizard.successMessage}</p>
          <button
            onClick={() => {
              wizard.clearMessages()
              wizard.resetForm()
            }}
            className="px-6 py-2.5 bg-[#434E72] text-white rounded font-medium hover:bg-[#363f5c] transition-colors"
          >
            Crear nueva solicitud
          </button>
        </div>
      )}

      {/* Indicador de pasos */}
      <div className="mb-8">
        <div className="flex justify-between">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center flex-1"
            >
              <button
                onClick={() => wizard.goToStep(step.number)}
                disabled={step.number > wizard.currentStep}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 border-2",
                  step.number === wizard.currentStep
                    ? "bg-[#434E72] border-[#434E72] text-white shadow-lg"
                    : step.number < wizard.currentStep
                      ? "bg-[#82c0c7] border-[#82c0c7] text-white"
                      : "bg-white border-[#ddd] text-[#999]"
                )}
              >
                {step.number < wizard.currentStep
                  ? StepIcons.check
                  : StepIcons[step.icon]}
              </button>
              <span
                className={cn(
                  "mt-2 text-sm font-medium",
                  step.number === wizard.currentStep
                    ? "text-[#434E72]"
                    : step.number < wizard.currentStep
                      ? "text-[#82c0c7]"
                      : "text-[#666]"
                )}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
        {/* Línea de progreso */}
        <div className="relative mt-4">
          <div className="absolute top-0 left-0 h-1 bg-[#ddd] w-full rounded" />
          <div
            className="absolute top-0 left-0 h-1 bg-[#434E72] rounded transition-all duration-300"
            style={{
              width: `${((wizard.currentStep - 1) / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Contenido del paso actual */}
      <div className="min-h-[400px]">{renderStep()}</div>

      {/* Botones de navegación */}
      {!wizard.successMessage && (
        <div className="flex justify-between mt-8 pt-6 border-t border-[#ddd]">
          <button
            onClick={wizard.prevStep}
            disabled={wizard.currentStep === 1}
            className={cn(
              "px-6 py-2.5 rounded font-medium transition-all duration-200 border-2",
              wizard.currentStep === 1
                ? "bg-[#f5f5f5] border-[#ddd] text-[#999] cursor-not-allowed"
                : "bg-white border-[#bbb] text-[#333] hover:border-[#434E72] hover:text-[#434E72]"
            )}
          >
            Anterior
          </button>

          {wizard.currentStep < 4 ? (
            <button
              onClick={wizard.nextStep}
              disabled={!!wizard.garantiaWarning}
              className={cn(
                "px-6 py-2.5 rounded font-medium transition-all duration-200 border-2",
                wizard.garantiaWarning
                  ? "bg-[#ddd] border-[#ddd] text-[#999] cursor-not-allowed"
                  : "bg-[#434E72] border-[#434E72] text-white hover:bg-[#363f5c] hover:border-[#363f5c]"
              )}
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={wizard.submitForm}
              disabled={wizard.isSubmitting}
              className={cn(
                "px-6 py-2.5 rounded font-medium transition-all duration-200 border-2",
                "bg-[#82c0c7] border-[#82c0c7] text-white hover:bg-[#6aabb3] hover:border-[#6aabb3]",
                "disabled:bg-[#b0d8dc] disabled:border-[#b0d8dc] disabled:cursor-not-allowed"
              )}
            >
              {wizard.isSubmitting ? "Enviando..." : "Finalizar"}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
