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
import { formatDate } from "@/utils/dateUtils";
import { searchData } from "@/utils/dataUtils";
import { useTooltipAnchors } from "@/composables/useTooltipAnchors";
import { useTablePagination } from "@/composables/useTablePagination";
import { type Customer } from "@/types/customer";

import BaseTable, { type BaseTableColumn } from "@/components/base/BaseTable.vue";
import PaginationTable from "@/components/base/PaginationTable.vue";
import TooltipModal from "@/components/base/TooltipModal.vue";

const props = defineProps<{
  data: Customer[];
  searchedField: string[];
}>();

const { hoveredId, refsMap, setRef } = useTooltipAnchors();
const {
  itemsPerPage,
  currentPage,
  paginatedData
} = useTablePagination(
  () => props.data,
  () => props.searchedField,
  searchData
);

const columns: BaseTableColumn<Customer>[] = [
  { key: "name", label: "Nome" },
  { key: "frequency", label: "Freq." },
  { key: "start", label: "Início" },
  { key: "plan", label: "Plano" },
  { key: "value", label: "Valor" },
  { key: "status", label: "Status" },
  { key: "actions", label: "" },
];
</script>