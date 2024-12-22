<template>
  <div>
    <div v-if="paginatedData.length > 0">
      <div class="table-overflow">
        <table
          class="table-area"
          style="max-height: 50vh; overflow: auto">
          <thead>
            <tr>
              <th>Ano</th>
              <th>Mês</th>
              <th>Nome</th>
              <th>Vencimento</th>
              <th>Parcelas</th>
              <th>Valor</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(expense, index) in paginatedData" :key="index">
              <td>{{ expense.year }}</td>
              <td>{{ expense.month }}</td>
              <td>{{ expense.name }}</td>
              <td>{{ formatDate(expense.date) }}</td>
              <td>{{ expense.installments }}</td>
              <td>
                R$ {{ expense.value.toFixed(2).toString().replace(/\./g, ',') }}
              </td>
              <td>
                <span
                  class="status paid"
                  :class="{
                    active: expense.paid === 'Pago',
                    inactive: expense.paid === 'À pagar'
                  }"
                  @click="confirmPaidStatus(expense)"
                >
                  {{ expense.paid }}
                </span>
              </td>
              <td>
                <span class="align-right">
                  <font-awesome-icon
                    v-if="expense.notes"
                    icon="fa-solid fa-circle-info"
                    class="table-icon"
                    @click="showNotes($event, expense)"
                  />
                  <font-awesome-icon
                    icon="fa-solid fa-pen-to-square"
                    class="table-icon"
                    @click="emit('update-item', expense)"
                  />
                  <font-awesome-icon
                    icon="fa-solid fa-trash-can"
                    class="table-icon"
                    @click="emit('delete-item', expense)"
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
    <ModalCard
      v-if="showModal"
      @execute-action="changePaidStatus"
      @close-modal="closeModal">
      <span class="message-area" style="font-size: 20px"
        >Marcar como <strong>{{ statusMessage }}</strong
        >?</span
      >
    </ModalCard>
    <div v-if="showModal" class="defocus"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import PaginationTable from "@/components/common/PaginationTable.vue";
import TooltipModal from "@/components/common/TooltipModal.vue";
import ModalCard from "@/components/common/ModalCard.vue";
import { useApiStore } from "@/stores/api";
import { useLoadingStore } from "@/stores/loading";
import { useDateUtils } from "@/utils/dateUtils";
import { useDataUtils } from "@/utils/dataUtils";
import { type Expense } from "@/types/expense";
import axios from "axios";

const apiStore = useApiStore();
const loadingStore = useLoadingStore();

const { formatDate, getNextMonth } = useDateUtils();
const { searchData } = useDataUtils();
const emit = defineEmits(["show-message", "update-item", "delete-item"]);

const itemsPerPage = ref<number>(8);
const currentPage = ref<number>(1);
const showingTooltip = ref<boolean>(false);
const tooltip = ref<string>("");
const mouseX = ref<number>(0);
const mouseY = ref<number>(0);
const showModal = ref<boolean>(false);
const statusMessage = ref<string>("");
const selectedExpense = ref<Expense>();

const props = defineProps<{
  data: Expense[];
  searchedField: string[];
}>();

const paginatedData = computed(() => {
  const searchedData = searchData(props.data, props.searchedField);
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + Number(itemsPerPage.value);

  return searchedData.slice(startIndex, endIndex) as Expense[];
});

const showNotes = (event: MouseEvent, expense: Expense) => {
  showingTooltip.value = !showingTooltip.value;
  tooltip.value = expense.notes;
  mouseX.value = event.clientX - 40;
  mouseY.value = event.clientY + 15;
};

const confirmPaidStatus = (expense: Expense) => {
  selectedExpense.value = expense;

  switch (selectedExpense.value!.paid) {
    case "À pagar":
      statusMessage.value = "pago";
      break;
    case "Pago":
      statusMessage.value = "à pagar";
      break;
  }

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  statusMessage.value = "";
};

const setItemsPerPage = (newItemsPerPage: number) => {
  itemsPerPage.value = newItemsPerPage;
};

const setCurrentPage = (newCurrentPage: number) => {
  currentPage.value = newCurrentPage;
};

const changePaidStatus = async () => {
  loadingStore.isLoading = true;
  try {
    let updatedPaidStatus = {} as { paid: string};

    switch (selectedExpense.value!.paid) {
      case "À pagar":
        updatedPaidStatus = { paid: "Pago" };
        break;
      case "Pago":
        updatedPaidStatus = { paid: "À pagar" };
        break;
    }

    await axios.patch(
      `${apiStore.apiURL}/expense/${selectedExpense.value!.id}/`,
      updatedPaidStatus
    );

    await apiStore.fetchExpenses();

    if (updatedPaidStatus.paid === "Pago") {
      if (selectedExpense.value!.installments === "") {
        createExpenseForNextMonth(selectedExpense.value!);
      }
    }
    closeModal();
    loadingStore.isLoading = false;
    emit("show-message", "Status do pagamento salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar o status de pagamento...", error);
    loadingStore.isLoading = false;
    emit("show-message", "Erro ao salvar o status do pagamento.");
  }
};

const createExpenseForNextMonth = async (expense: Expense) => {
  try {
    let nextMonth = getNextMonth(expense.month, expense.year);
    let paymentDay = parseInt(expense.date.slice(-2));
    let dueDate = `${nextMonth.year}-${nextMonth.monthNumber}-${paymentDay}`;

    let newExpense = {
      year: nextMonth.year,
      month: nextMonth.month,
      name: expense.name,
      date: dueDate,
      value: expense.value,
      paid: "À pagar",
      notes: expense.notes
    };

    await axios.post(`${apiStore.apiURL}/expense/create/`, newExpense);
    await apiStore.fetchExpenses();
  } catch (error) {
    console.error("Erro ao criar despesa.", error);
  }
};

watch(() => props.searchedField, () => {
  if (props.searchedField.length > 0) {
    currentPage.value = 1;
  }
});
</script>