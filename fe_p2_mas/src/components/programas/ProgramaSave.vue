<script setup lang="ts">
import type { NivelAcademico } from '@/models/nivel-academico'
import type { Programa } from '@/models/programa'
import http from '@/plugins/axios'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import { computed, ref, watch } from 'vue'
import { DatePicker } from 'primevue'

const ENDPOINT = 'programas'
const props = defineProps({
  mostrar: Boolean,
  programa: {
    type: Object as () => Programa,
    default: () => ({}) as Programa,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const nivelesAcademicos = ref<NivelAcademico[]>([])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const programa = ref<Programa>({ ...props.programa })
const estados = ['En Planificación', 'En curso', 'Finalizado']

async function obtenerNivelesAcademicos() {
  nivelesAcademicos.value = await http.get('niveles-academicos').then((response) => response.data)
}
watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerNivelesAcademicos()
      if (props.programa?.id) {
        programa.value = {
          ...props.programa,
          idNivelAcademico: props.programa.nivelAcademico?.id ?? 0,
          fechaInicio:
            typeof props.programa.fechaInicio === 'string'
              ? new Date(props.programa.fechaInicio)
              : props.programa.fechaInicio,
          estado:
            estados.find(
              (estado) =>
                estado.toLowerCase() === (props.programa.estado?.toLowerCase() ?? ''),
            ) ?? '',
        }
      } else {
        programa.value = {} as Programa
      }
    }
  },
)

async function handleSave() {
  try {
    const body = {
      idNivelAcademico: programa.value.idNivelAcademico,
      nombre: programa.value.nombre,
      descripcion: programa.value.descripcion,
      version: programa.value.version,
      duracionMeses: programa.value.duracionMeses,
      costo: programa.value.costo,
      fechaInicio: programa.value.fechaInicio.toISOString(),
      estado: programa.value.estado,
    }
    console.log('Datos que envío:', body)
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${programa.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    programa.value = {} as Programa
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Programa'"
      style="width: 25rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="nivelAcademico" class="font-semibold w-3">Nivel Académico</label>
        <Select
          id="nivelAcademico"
          v-model="programa.idNivelAcademico"
          :options="nivelesAcademicos"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText id="nombre" v-model="programa.nombre" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="descripcion" class="font-semibold w-3">Descripción</label>
        <Textarea id="descripcion" v-model="programa.descripcion" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="version" class="font-semibold w-3">Versión</label>
        <InputNumber
          id="version"
          v-model="programa.version"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="duracionMeses" class="font-semibold w-3">Duración (Meses)</label>
        <InputNumber
          id="duracionMeses"
          v-model="programa.duracionMeses"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="costo" class="font-semibold w-3">Costo</label>
        <InputNumber
          id="costo"
          v-model="programa.costo"
          class="flex-auto"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="fechaInicio" class="font-semibold w-3">Fecha Inicio</label>
        <DatePicker
          id="fechaInicio"
          v-model="programa.fechaInicio"
          class="flex-auto"
          date-format="yy-mm-dd"
          show-icon
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="estado" class="font-semibold w-3">Estado</label>
        <Select
          id="estado"
          v-model="programa.estado"
          :options="estados"
          placeholder="Seleccionar un Estado"
          class="flex-auto"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
