<script setup lang="ts">
import type { Programa } from '@/models/programa'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { onMounted, ref, watch } from 'vue'

const ENDPOINT = 'programas'
const programas = ref<Programa[]>([])
const emit = defineEmits(['edit'])
const programaDelete = ref<Programa | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  const params: Record<string, string> = {}
  if (busqueda.value) params.busqueda = busqueda.value
  programas.value = await http.get(ENDPOINT, { params }).then((response) => response.data)
}

function emitirEdicion(programa: Programa) {
  emit('edit', programa)
}

function mostrarEliminarConfirm(programa: Programa) {
  programaDelete.value = programa
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${programaDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

watch(busqueda, () => {
  obtenerLista()
})

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div>
      <div class="col-7 pl-0 mt-3">
        <InputGroup>
          <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
          <InputText v-model="busqueda" type="text" placeholder="Buscar" />
        </InputGroup>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nro.</th>
            <th>Nivel Académico</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Versión</th>
            <th>Duración (Meses)</th>
            <th>Costo</th>
            <th>Fecha Inicio</th>
            <th>Estado</th>
            <th>Modalidad Clases</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(programa, index) in programas" :key="programa.id">
            <td>{{ index + 1 }}</td>
            <td>{{ programa.nivelAcademico.nombre }}</td>
            <td>{{ programa.nombre }}</td>
            <td>{{ programa.descripcion }}</td>
            <td>{{ programa.version }}</td>
            <td>{{ programa.duracionMeses }}</td>
            <td>{{ programa.costo }}</td>
            <td>{{ programa.fechaInicio }}</td>
            <td>{{ programa.estado }}</td>
            <td>{{ programa.modalidadClases }}</td>
            <td>
              <Button
                icon="pi pi-pencil"
                aria-label="Editar"
                text
                @click="emitirEdicion(programa)"
              />
              <Button
                icon="pi pi-trash"
                aria-label="Eliminar"
                severity="danger"
                text
                @click="mostrarEliminarConfirm(programa)"
              />
            </td>
          </tr>
          <tr v-if="programas.length === 0">
            <td colspan="11">No se encontraron resultados.</td>
          </tr>
        </tbody>
      </table>
      <Dialog
        v-model:visible="mostrarConfirmDialog"
        header="Confirmar Eliminación"
        :style="{ width: '25rem' }"
      >
        <p>¿Estás seguro de que deseas eliminar este registro?</p>
        <div class="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancelar"
            severity="secondary"
            @click="mostrarConfirmDialog = false"
          />
          <Button type="button" label="Eliminar" @click="eliminar" />
        </div>
      </Dialog>
    </div>
  </div>
</template>

<style scoped></style>
