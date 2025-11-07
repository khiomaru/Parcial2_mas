import type { NivelAcademico } from './nivel-academico'

export interface Programa {
  id: number
  idNivelAcademico: number
  nombre: string
  descripcion: string
  version: number
  duracionMeses: number
  costo: number
  fechaInicio: Date
  estado: string
  modalidadClases: string
  nivelAcademico: NivelAcademico
}
