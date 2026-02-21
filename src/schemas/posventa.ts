import { z } from "zod"

export const solicitanteSchema = z.object({
  nombres: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellidos: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  tipoDocumento: z.string().min(1, "Seleccione un tipo de documento"),
  numeroDocumento: z.string().min(5, "El documento debe tener al menos 5 caracteres"),
  celular: z.string().min(7, "El celular debe tener al menos 7 digitos"),
  telefono: z.union([
    z.string().min(7, "El telefono debe tener al menos 7 digitos"),
    z.literal("")
  ]),
  email: z.string().email("Ingrese un email valido"),
})

export const inmuebleSchema = z.object({
  idMacroproyecto: z.number().min(1, "Seleccione un macroproyecto"),
  idProyecto: z.number().min(1, "Seleccione un proyecto"),
  idInmueble: z.number().min(1, "Seleccione un inmueble"),
})

export const solicitudItemSchema = z.object({
  id: z.string(),
  tipoSolicitante: z.number().min(1, "Seleccione tipo de solicitante"),
  tipoEspacio: z.number().min(1, "Seleccione tipo de espacio"),
  locativaPadre: z.string().min(1, "Seleccione una locativa"),
  locativaHijo: z.string().min(1, "Seleccione un servicio"),
  detalles: z.string().min(10, "Ingrese al menos 10 caracteres de descripcion"),
})

export const solicitudesSchema = z.object({
  solicitudes: z.array(solicitudItemSchema).min(1, "Agregue al menos una solicitud"),
})

export type SolicitanteFormData = z.infer<typeof solicitanteSchema>
export type InmuebleFormData = z.infer<typeof inmuebleSchema>
export type SolicitudItemFormData = z.infer<typeof solicitudItemSchema>
export type SolicitudesFormData = z.infer<typeof solicitudesSchema>
