<template>
  <div>
    <div v-if="paginatedData.length > 0">
      <BaseTable
        :data="paginatedData"
        :columns="columns"
        rowKey="id"
      >
        <template #cell-start="{ row }">
          {{ formatDate(row.start) }}
        </template>

        <template #cell-value="{ row }">
          R$ {{ row.value!.toFixed(2).toString().replace(/\./g, ',') }}
        </template>

        <template #cell-status="{ row }">
          <span
            class="status"
            :class="{
              active: row.status === 'Ativo',
              inactive: row.status === 'Inativo'
            }"
          >
            {{ row.status }}
          </span>
        </template>

        <template #cell-actions="{ row }">
          <span class="align-right">
            <span
              v-if="row.notes"
              :ref="el => setRef(row.id, el)"
              @mouseenter="hoveredId = row.id"
              @mouseleave="hoveredId = null"
            >
              <font-awesome-icon
                icon="fa-solid fa-circle-info"
                class="table-icon"
              />
            </span>

            <TooltipModal
              :anchor="refsMap[row.id]"
              :visible="hoveredId === row.id"
            >
              {{ row.notes }}
            </TooltipModal>

            <font-awesome-icon
              icon="fa-solid fa-pen-to-square"
              class="table-icon"
              @click="$emit('update-item', row)"
            />

            <font-awesome-icon
              icon="fa-solid fa-trash-can"
              class="table-icon"
              @click="$emit('delete-item', row)"
            />
          </span>
        </template>

        <template #footer>
          <PaginationTable
            v-model:currentPage="currentPage"
            v-model:itemsPerPage="itemsPerPage"
            :totalItems="data.length"
          />
        </template>
      </BaseTable>
    </div>

    <div v-else class="not-found">
      Nenhum resultado foi encontrado.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type ComponentPublicInstance } from "vue";
import { useDateUtils } from "@/utils/dateUtils";
import { useDataUtils } from "@/utils/dataUtils";
import { type Customer } from "@/types/customer";

import BaseTable, { type BaseTableColumn } from "@/components/common/BaseTable.vue";
import PaginationTable from "@/components/common/PaginationTable.vue";
import TooltipModal from "@/components/common/TooltipModal.vue";

const { formatDate } = useDateUtils();
const { searchData } = useDataUtils();

const itemsPerPage = ref<number>(30);
const currentPage = ref<number>(1);
const hoveredId = ref<number | null>(null);
const refsMap = ref<Record<number, HTMLElement | null>>({});
const columns: BaseTableColumn[] = [
  { key: "name", label: "Nome" },
  { key: "frequency", label: "Freq." },
  { key: "start", label: "Início" },
  { key: "plan", label: "Plano" },
  { key: "value", label: "Valor" },
  { key: "status", label: "Status" },
  { key: "actions", label: "" },
];

const props = defineProps<{
  data: Customer[];
  searchedField: string[];
}>();

const paginatedData = computed(() => { // TODO: lógica repetida em 3 componentes.
  const searchedData = searchData(props.data, props.searchedField);
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;

  return searchedData.slice(start, end) as Customer[];
});

const setRef = ( // TODO: lógica repetida em 3 componentes.
  id: number,
  el: Element | ComponentPublicInstance | null
) => {
  if (el && "$el" in el) {
    refsMap.value[id] = el.$el as HTMLElement;
  } else {
    refsMap.value[id] = el as HTMLElement | null;
  }
};

watch(
  () => props.searchedField,
  () => {
    if (props.searchedField.length > 0) {  // TODO: lógica repetida em 3 componentes.
      currentPage.value = 1;
    }
  }
);
</script>