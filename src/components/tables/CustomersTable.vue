<template>
  <div>
    <div v-if="paginatedData.length > 0">
      <div class="table-overflow">
        <table class="table-area" style="max-height: 50vh; overflow: auto">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Freq.</th>
              <th>Início</th>
              <th>Plano</th>
              <th>Valor</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(customer, index) in paginatedData" :key="index">
              <td>{{ customer.name }}</td>
              <td>{{ customer.frequency }}</td>
              <td>{{ formatDate(customer.start)}}</td>
              <td>{{ customer.plan }}</td>
              <td>
                R$ {{ customer.value!.toFixed(2).toString().replace(/\./g, ',') }}
              </td>
              <td>
                <span class="status"
                  :class="{
                    active: customer.status === 'Ativo',
                    inactive: customer.status === 'Inativo'
                  }">
                  {{ customer.status }}
                </span>
              </td>
              <td>
                <span class="align-right">
                  <span
                    v-if="customer.notes"
                    :ref="el => setRef(customer.id, el)"
                    @mouseenter="hoveredId = customer.id"
                    @mouseleave="hoveredId = null"
                  >
                    <font-awesome-icon
                      icon="fa-solid fa-circle-info"
                      class="table-icon"
                    />
                  </span>
                  <TooltipModal
                    :anchor="refsMap[customer.id]"
                    :visible="hoveredId === customer.id"
                  >
                    {{ customer.notes }}
                  </TooltipModal>
                  <font-awesome-icon
                    icon="fa-solid fa-pen-to-square"
                    class="table-icon"
                    @click="$emit('update-item', customer)"
                  />
                  <font-awesome-icon
                    icon="fa-solid fa-trash-can"
                    class="table-icon"
                    @click="$emit('delete-item', customer)"
                  />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <PaginationTable
        :itemsPerPage="itemsPerPage"
        :currentPage="currentPage"
        :searchedField="searchedField"
        :data="data"
        @current-page="currentPage = $event"
        @items-per-page="itemsPerPage = $event"
      />
    </div>

    <div v-else class="not-found">Nenhum resultado foi encontrado.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type ComponentPublicInstance } from "vue";
import { useDateUtils } from "@/utils/dateUtils";
import { useDataUtils } from "@/utils/dataUtils";
import { type Customer } from "@/types/customer";

import PaginationTable from "@/components/common/PaginationTable.vue";
import TooltipModal from "@/components/common/TooltipModal.vue";

const { formatDate } = useDateUtils();
const { searchData } = useDataUtils();

const itemsPerPage = ref<number>(30);
const currentPage = ref<number>(1);
const hoveredId = ref<number | null>(null);
const refsMap = ref<Record<number, HTMLElement | null>>({});

const props = defineProps<{
  data: Customer[];
  searchedField: string[];
}>();

const paginatedData = computed(() => {
  const searchedData = searchData(props.data, props.searchedField);
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + Number(itemsPerPage.value);

  return searchedData.slice(startIndex, endIndex) as Customer[];
});

const setRef = (
  id: number,
  el: Element | ComponentPublicInstance | null
) => {
  if (el && "$el" in el) {
    refsMap.value[id] = el.$el as HTMLElement;
  } else {
    refsMap.value[id] = el as HTMLElement | null;
  }
};

watch(() => props.searchedField, () => {
  if (props.searchedField.length > 0) {
    currentPage.value = 1;
  }
});
</script>