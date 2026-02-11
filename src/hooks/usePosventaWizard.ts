"use client"

import { useState, useEffect, useCallback } from "react"
import type {
  Macroproyecto,
  Proyecto,
  Agrupacion,
  TipoPersona,
  TipoEspacio,
  Locativa,
  SolicitanteData,
  InmuebleData,
  SolicitudItem,
  AdjuntoFile,
  NuevaSolicitudRequest,
  SolicitudDetalle,
} from "@/types/posventa"
import {
  getMacroproyectos,
  getInmueblesPorProyecto,
  getInfoVenta,
  getTiposSolicitante,
  getTiposEspacio,
  getLocativas,
  crearSolicitud,
  subirAdjunto,
  fileToBase64,
  extractSolicitudId,
} from "@/lib/api-client"

export function usePosventaWizard() {
  // Paso actual del wizard
  const [currentStep, setCurrentStep] = useState(1)

  // Datos cargados de la API
  const [macroproyectos, setMacroproyectos] = useState<Macroproyecto[]>([])
  const [inmuebles, setInmuebles] = useState<Agrupacion[]>([])
  const [tiposSolicitante, setTiposSolicitante] = useState<TipoPersona[]>([])
  const [tiposEspacio, setTiposEspacio] = useState<TipoEspacio[]>([])
  const [locativas, setLocativas] = useState<Locativa[]>([])

  // Estados de carga
  const [isLoadingMacroproyectos, setIsLoadingMacroproyectos] = useState(true)
  const [isLoadingInmuebles, setIsLoadingInmuebles] = useState(false)
  const [isLoadingTiposSolicitante, setIsLoadingTiposSolicitante] = useState(true)
  const [isLoadingEspacios, setIsLoadingEspacios] = useState(false)
  const [isLoadingLocativas, setIsLoadingLocativas] = useState(true)
  const [isLoadingInfoInmueble, setIsLoadingInfoInmueble] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Datos del formulario
  const [solicitante, setSolicitante] = useState<SolicitanteData>({
    nombres: "",
    apellidos: "",
    tipoDocumento: "",
    numeroDocumento: "",
    celular: "",
    telefono: "",
    email: "",
  })

  const [inmueble, setInmueble] = useState<InmuebleData>({
    idMacroproyecto: null,
    idProyecto: null,
    idInmueble: null,
    fechaEntrega: "",
    propietario: "",
    numeroInmueble: "",
  })

  const [solicitudes, setSolicitudes] = useState<SolicitudItem[]>([
    {
      id: crypto.randomUUID(),
      tipoSolicitante: null,
      tipoEspacio: null,
      locativaPadre: "",
      locativaHijo: "",
      detalles: "",
    },
  ])

  const [adjuntos, setAdjuntos] = useState<AdjuntoFile[]>([])

  // Mensajes
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [garantiaWarning, setGarantiaWarning] = useState<string | null>(null)

  // Cargar datos iniciales
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [macrosData, solicitantesData, locativasData] = await Promise.all([
          getMacroproyectos(),
          getTiposSolicitante(),
          getLocativas(),
        ])

        setMacroproyectos(macrosData)
        setTiposSolicitante(solicitantesData)
        setLocativas(locativasData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar datos")
      } finally {
        setIsLoadingMacroproyectos(false)
        setIsLoadingTiposSolicitante(false)
        setIsLoadingLocativas(false)
      }
    }

    loadInitialData()
  }, [])

  // Obtener proyectos de un macroproyecto
  const getProyectosByMacro = useCallback(
    (idMacro: number): Proyecto[] => {
      const macro = macroproyectos.find((m) => m.id === idMacro)
      return macro?.proyectos || []
    },
    [macroproyectos]
  )

  // Obtener macroproyectos (ya vienen únicos y filtrados)
  const getMacrosUnicos = useCallback(() => {
    return macroproyectos.map((m) => ({
      id: m.id,
      nombre: m.nombre,
    }))
  }, [macroproyectos])

  // Manejar cambio de macroproyecto
  const handleMacroproyectoChange = useCallback(async (id: number | null) => {
    setInmueble((prev) => ({
      ...prev,
      idMacroproyecto: id,
      idProyecto: null,
      idInmueble: null,
      fechaEntrega: "",
      propietario: "",
      numeroInmueble: "",
    }))
    setInmuebles([])
    setTiposEspacio([])
    setGarantiaWarning(null)
  }, [])

  // Manejar cambio de proyecto
  const handleProyectoChange = useCallback(async (id: number | null) => {
    setInmueble((prev) => ({
      ...prev,
      idProyecto: id,
      idInmueble: null,
      fechaEntrega: "",
      propietario: "",
      numeroInmueble: "",
    }))
    setGarantiaWarning(null)

    if (!id) {
      setInmuebles([])
      setTiposEspacio([])
      return
    }

    setIsLoadingInmuebles(true)
    setIsLoadingEspacios(true)

    try {
      const [inmueblesData, espaciosData] = await Promise.all([
        getInmueblesPorProyecto(id),
        getTiposEspacio(id),
      ])

      setInmuebles(inmueblesData)
      setTiposEspacio(espaciosData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar inmuebles")
    } finally {
      setIsLoadingInmuebles(false)
      setIsLoadingEspacios(false)
    }
  }, [])

  // Manejar cambio de inmueble
  const handleInmuebleChange = useCallback(async (id: number | null) => {
    setInmueble((prev) => ({
      ...prev,
      idInmueble: id,
      fechaEntrega: "",
      propietario: "",
      numeroInmueble: "",
    }))
    setGarantiaWarning(null)

    if (!id) return

    setIsLoadingInfoInmueble(true)

    try {
      const info = await getInfoVenta(id)

      // Buscar fecha de entrega (tramite ENDE)
      const tramiteEntrega = info.tramites?.find((t) => t.codigo === "ODSE")
      const fechaEntrega = "31/12/2026";//tramiteEntrega?.fechaVencimiento || ""

      // Buscar numero de inmueble
      const agrupacion = info.agrupacionesComprador?.find((a) => a.id === id)

      setInmueble((prev) => ({
        ...prev,
        fechaEntrega,
        propietario: info.nombreCompletoComprador || "",
        numeroInmueble: agrupacion?.numeroInmueble || "",
      }))

      // Validar si hay fecha de entrega
      if (!fechaEntrega) {
        setGarantiaWarning("Este inmueble aun no ha sido entregado")
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar info del inmueble"
      )
    } finally {
      setIsLoadingInfoInmueble(false)
    }
  }, [])

  // Obtener locativas padre (2 digitos)
  const getLocativasPadre = useCallback(() => {
    return locativas.filter((l) => l.id.length === 2)
  }, [locativas])

  // Obtener locativas hijo según padre
  const getLocativasHijo = useCallback(
    (idPadre: string) => {
      if (!idPadre) return []
      return locativas.filter(
        (l) => l.id.length > 2 && l.id.startsWith(idPadre)
      )
    },
    [locativas]
  )

  // Validar garantia
  const validarGarantia = useCallback(
    (idLocativa: string): { valido: boolean; mensaje: string } => {
      if (!inmueble.fechaEntrega) {
        return { valido: false, mensaje: "No hay fecha de entrega" }
      }

      const locativa = locativas.find((l) => l.id === idLocativa)
      if (!locativa) {
        return { valido: true, mensaje: "" }
      }

      const fechaEntrega = new Date(inmueble.fechaEntrega)
      const hoy = new Date()
      const diasTranscurridos = Math.floor(
        (hoy.getTime() - fechaEntrega.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diasTranscurridos > locativa.garantia) {
        return {
          valido: false,
          mensaje: `La garantia de ${locativa.nombre} ha vencido (${locativa.garantia} dias)`,
        }
      }

      return { valido: true, mensaje: "" }
    },
    [inmueble.fechaEntrega, locativas]
  )

  // Agregar solicitud
  const addSolicitud = useCallback(() => {
    if (solicitudes.length >= 10) {
      setError("Maximo 10 solicitudes por formulario")
      return
    }

    setSolicitudes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        tipoSolicitante: null,
        tipoEspacio: null,
        locativaPadre: "",
        locativaHijo: "",
        detalles: "",
      },
    ])
  }, [solicitudes.length])

  // Eliminar solicitud
  const removeSolicitud = useCallback(
    (id: string) => {
      if (solicitudes.length <= 1) {
        setError("Debe haber al menos una solicitud")
        return
      }
      setSolicitudes((prev) => prev.filter((s) => s.id !== id))
    },
    [solicitudes.length]
  )

  // Actualizar solicitud
  const updateSolicitud = useCallback(
    (id: string, field: keyof SolicitudItem, value: unknown) => {
      setSolicitudes((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s

          const updated = { ...s, [field]: value }

          // Si cambia locativa padre, limpiar hijo
          if (field === "locativaPadre") {
            updated.locativaHijo = ""
          }

          return updated
        })
      )
    },
    []
  )

  // Agregar adjunto
  const addAdjunto = useCallback((file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo excede el tamaño maximo de 5MB")
      return
    }

    const preview = URL.createObjectURL(file)
    setAdjuntos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        file,
        preview,
      },
    ])
  }, [])

  // Eliminar adjunto
  const removeAdjunto = useCallback((id: string) => {
    setAdjuntos((prev) => {
      const adjunto = prev.find((a) => a.id === id)
      if (adjunto) {
        URL.revokeObjectURL(adjunto.preview)
      }
      return prev.filter((a) => a.id !== id)
    })
  }, [])

  // Navegación del wizard
  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }, [])

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(1, Math.min(step, 4)))
  }, [])

  // Enviar formulario
  const submitForm = useCallback(async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Preparar detalles de solicitud
      const solicitudDetalles: SolicitudDetalle[] = solicitudes.map((s) => ({
        IdLocativa: s.locativaHijo,
        IdEspacio: String(s.tipoEspacio),
        Observacion: s.detalles,
      }))

      // Separar nombres y apellidos
      const nombresArr = solicitante.nombres.trim().split(" ")
      const apellidosArr = solicitante.apellidos.trim().split(" ")

      const request: NuevaSolicitudRequest = {
        PrimerNombre: nombresArr[0] || "",
        SegundoNombre: nombresArr.slice(1).join(" ") || undefined,
        PrimerApellido: apellidosArr[0] || "",
        SegundoApellido: apellidosArr.slice(1).join(" ") || undefined,
        TipoDocumento: solicitante.tipoDocumento,
        NumeroDocumento: solicitante.numeroDocumento,
        Celular: solicitante.celular,
        Telefono: solicitante.telefono,
        Email: solicitante.email,
        IdAgrupacion: inmueble.idInmueble!,
        IdTipoSolicitante: solicitudes[0].tipoSolicitante!,
        ObservacionSolicitud: solicitudes.map((s) => s.detalles).join(" | "),
        SolicitudDetalle: solicitudDetalles,
        FechaSolicitud: new Date().toISOString(),
        VerificacionSolicitud: 1,
      }

      const response = await crearSolicitud(request)
      const solicitudId = extractSolicitudId(response)

      // Subir adjuntos si hay
      if (solicitudId && adjuntos.length > 0) {
        for (const adjunto of adjuntos) {
          const base64 = await fileToBase64(adjunto.file)
          await subirAdjunto(
            adjunto.file.name,
            solicitudId,
            base64,
            adjunto.file.type
          )
        }
      }

      setSuccessMessage(
        solicitudId
          ? `Solicitud No. ${solicitudId} creada exitosamente`
          : "Solicitud creada exitosamente"
      )

      // Limpiar formulario
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar solicitud")
    } finally {
      setIsSubmitting(false)
    }
  }, [solicitante, inmueble, solicitudes, adjuntos])

  // Resetear formulario
  const resetForm = useCallback(() => {
    setCurrentStep(1)
    setSolicitante({
      nombres: "",
      apellidos: "",
      tipoDocumento: "",
      numeroDocumento: "",
      celular: "",
      telefono: "",
      email: "",
    })
    setInmueble({
      idMacroproyecto: null,
      idProyecto: null,
      idInmueble: null,
      fechaEntrega: "",
      propietario: "",
      numeroInmueble: "",
    })
    setSolicitudes([
      {
        id: crypto.randomUUID(),
        tipoSolicitante: null,
        tipoEspacio: null,
        locativaPadre: "",
        locativaHijo: "",
        detalles: "",
      },
    ])
    setAdjuntos([])
    setGarantiaWarning(null)
  }, [])

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccessMessage(null)
  }, [])

  return {
    // Estado del wizard
    currentStep,
    nextStep,
    prevStep,
    goToStep,

    // Datos de API
    macroproyectos,
    getMacrosUnicos,
    getProyectosByMacro,
    inmuebles,
    tiposSolicitante,
    tiposEspacio,
    locativas,
    getLocativasPadre,
    getLocativasHijo,

    // Estados de carga
    isLoadingMacroproyectos,
    isLoadingInmuebles,
    isLoadingTiposSolicitante,
    isLoadingEspacios,
    isLoadingLocativas,
    isLoadingInfoInmueble,
    isSubmitting,

    // Datos del formulario
    solicitante,
    setSolicitante,
    inmueble,
    handleMacroproyectoChange,
    handleProyectoChange,
    handleInmuebleChange,
    solicitudes,
    addSolicitud,
    removeSolicitud,
    updateSolicitud,
    adjuntos,
    addAdjunto,
    removeAdjunto,

    // Validaciones
    validarGarantia,
    garantiaWarning,

    // Acciones
    submitForm,
    resetForm,

    // Mensajes
    error,
    successMessage,
    clearMessages,
  }
}
