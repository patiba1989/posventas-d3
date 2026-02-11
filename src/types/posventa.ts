// Tipos para macroproyectos y proyectos
export interface MacroproyectoAPI {
  id: number
  nombre: string
  direccion: string
  telefono: string
  ciudad: number
  numeroPisos: number
  aptosPorPiso: number
  logo: string | null
  rutaLogo: string | null
  idSupermacro: number | null
}

export interface ProyectoAPI {
  idProyecto: number
  idMacroproyecto: number
  nombre: string
  marcaWebService: number
}

// Macroproyecto con sus proyectos filtrados
export interface Macroproyecto {
  id: number
  nombre: string
  proyectos: Proyecto[]
}

export interface Proyecto {
  idProyecto: number
  idMacroproyecto: number
  nombre: string
  marcaWebService: number
}

// Tipos para inmuebles
export interface Inmueble {
  id: number
  nombre: string
  numeroInmueble: string
  estado: string
}

export interface Agrupacion {
  id: number
  nombre: string
  estado: string
}

// Tipos para compradores y ventas
export interface Comprador {
  nombreCompletoComprador: string
  agrupacionesComprador: AgrupacionComprador[]
}

export interface AgrupacionComprador {
  id: number
  nombre: string
  numeroInmueble: string
}

export interface Tramite {
  codigo: string
  nombre: string
  fechaVencimiento: string
}

export interface VentaInfo {
  nombreCompletoComprador: string
  agrupacionesComprador: AgrupacionComprador[]
  tramites: Tramite[]
}

// Tipos para selects
export interface TipoPersona {
  id: number
  descripcion: string
}

export interface TipoEspacio {
  id: number
  nombre: string
  descripcion: string
}

export interface Locativa {
  id: string
  nombre: string
  garantia: number
}

// Tipos para el formulario
export interface SolicitudDetalle {
  IdLocativa: string
  IdEspacio: string
  Observacion: string
}

export interface NuevaSolicitudRequest {
  PrimerNombre: string
  SegundoNombre?: string
  PrimerApellido: string
  SegundoApellido?: string
  TipoDocumento: string
  NumeroDocumento: string
  Celular: string
  Telefono: string
  Email: string
  IdAgrupacion: number
  IdTipoSolicitante: number
  ObservacionSolicitud: string
  SolicitudDetalle: SolicitudDetalle[]
  FechaSolicitud: string
  VerificacionSolicitud: number
}

export interface NuevaSolicitudResponse {
  message: string
  solicitudId?: number
}

export interface AuthResponse {
  access_token: string
}

export interface ApiError {
  message: string
  status?: number
}

// Estado del formulario
export interface SolicitanteData {
  nombres: string
  apellidos: string
  tipoDocumento: string
  numeroDocumento: string
  celular: string
  telefono: string
  email: string
}

export interface InmuebleData {
  idMacroproyecto: number | null
  idProyecto: number | null
  idInmueble: number | null
  fechaEntrega: string
  propietario: string
  numeroInmueble: string
}

export interface SolicitudItem {
  id: string
  tipoSolicitante: number | null
  tipoEspacio: number | null
  locativaPadre: string
  locativaHijo: string
  detalles: string
}

export interface AdjuntoFile {
  id: string
  file: File
  preview: string
}
