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
                R$ {{ customer.value.toFixed(2).toString().replace(/\./g, ',') }}
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
                  <font-awesome-icon
                    v-if="customer.notes"
                    icon="fa-solid fa-circle-info"
                    class="table-icon"
                    @click="showNotes($event, customer)"
                  />
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
        @current-page="setCurrentPage"
        @items-per-page="setItemsPerPage"
      />
      <TooltipModal v-if="showingTooltip" :mouseX="mouseX" :mouseY="mouseY">
        <p class="tooltip-text">{{ tooltip }}</p>
      </TooltipModal>
    </div>
    <div v-else class="not-found">Nenhum resultado foi encontrado.</div>
    <div v-if="showModal" class="defocus"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import PaginationTable from "@/components/common/PaginationTable.vue";
import TooltipModal from "@/components/common/TooltipModal.vue";
import { useDateUtils } from "@/utils/dateUtils";
import { useDataUtils } from "@/utils/dataUtils";
import { type Customer } from "@/types/customer";

const { formatDate } = useDateUtils();
const { searchData } = useDataUtils();

const itemsPerPage = ref<number>(8);
const currentPage = ref<number>(1);

const showingTooltip = ref<boolean>(false);
const tooltip = ref<string>("");
const mouseX = ref<number>(0);
const mouseY = ref<number>(0);

const showModal = ref<boolean>(false);

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

const showNotes = (event: MouseEvent, customer: Customer) => {
  showingTooltip.value = !showingTooltip.value;
  tooltip.value = customer.notes;
  mouseX.value = event.clientX - 40;
  mouseY.value = event.clientY + 15;
};

const setItemsPerPage = (newItemsPerPage: number) => {
  itemsPerPage.value = newItemsPerPage;
};

const setCurrentPage = (newCurrentPage: number) => {
  currentPage.value = newCurrentPage;
};

watch(() => props.searchedField, () => {
  if (props.searchedField.length > 0) {
    currentPage.value = 1;
  }
});
</script>