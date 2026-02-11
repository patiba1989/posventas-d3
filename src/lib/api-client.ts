import type {
  Macroproyecto,
  TipoPersona,
  TipoEspacio,
  Locativa,
  Agrupacion,
  VentaInfo,
  NuevaSolicitudRequest,
} from "@/types/posventa"

// Cliente que usa las rutas internas de Next.js (el token se maneja en el servidor)
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Incluir cookies en las peticiones
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Error desconocido" }))
    throw new Error(error.error || `Error en la petición: ${response.status}`)
  }

  return response.json()
}

// Inicializar autenticación (llamar una vez al cargar la app)
export async function iniciarSesion(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth", {
      method: "POST",
      credentials: "include",
    })
    const data = await response.json()
    return data.authenticated === true
  } catch {
    return false
  }
}

// Obtener macroproyectos con sus proyectos
export async function getMacroproyectos(): Promise<Macroproyecto[]> {
  return apiFetch<Macroproyecto[]>("/api/macroproyectos")
}

// Obtener inmuebles por proyecto (solo VENDIDO)
export async function getInmueblesPorProyecto(
  idProyecto: number
): Promise<Agrupacion[]> {
  return apiFetch<Agrupacion[]>(`/api/inmuebles/${idProyecto}`)
}

// Obtener información de venta (comprador, tramites)
export async function getInfoVenta(idVenta: number): Promise<VentaInfo> {
  return apiFetch<VentaInfo>(`/api/ventas/${idVenta}`)
}

// Obtener tipos de solicitante
export async function getTiposSolicitante(): Promise<TipoPersona[]> {
  return apiFetch<TipoPersona[]>("/api/tipos-solicitante")
}

// Obtener tipos de espacio por proyecto
export async function getTiposEspacio(
  idProyecto: number
): Promise<TipoEspacio[]> {
  return apiFetch<TipoEspacio[]>(`/api/tipos-espacio/${idProyecto}`)
}

// Obtener locativas (padre e hijos)
export async function getLocativas(): Promise<Locativa[]> {
  return apiFetch<Locativa[]>("/api/locativas")
}

// Crear solicitud de posventa
export async function crearSolicitud(
  solicitud: NuevaSolicitudRequest
): Promise<string> {
  const response = await apiFetch<{ message: string }>("/api/solicitudes", {
    method: "POST",
    body: JSON.stringify(solicitud),
  })
  return response.message
}

// Subir adjunto
export async function subirAdjunto(
  filename: string,
  idSolicitud: number,
  archivo: string,
  tipoArchivo: string
): Promise<void> {
  await apiFetch("/api/adjuntos", {
    method: "POST",
    body: JSON.stringify({
      filename,
      idSolicitud,
      archivo,
      tipoArchivo,
    }),
  })
}

// Utilidad para convertir File a base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // Remover el prefijo "data:image/...;base64,"
      const base64 = result.split(",")[1]
      resolve(base64)
    }
    reader.onerror = (error) => reject(error)
  })
}

// Extraer ID de solicitud del mensaje de respuesta
export function extractSolicitudId(message: string): number | null {
  const match = message.match(/Solicitud\s+(\d+)/i)
  return match ? parseInt(match[1], 10) : null
}
