<template>
  <div class="content-area">
    <div class="flex-between mb-normal">
      <DefaultButton @executeAction="addExpense" style="background-color: var(--red-dark-color)">
        <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
        <span class="button-text">Nova Despesa</span>
      </DefaultButton>
      <div style="display: flex; justify-content: flex-end">
        <MonthFilter
          @get-month="getMonth"
          @get-year="getYear"
          @get-status="getStatus"
          :statusList="statusList"
        />
        <SearchFilter @apply-search="applySearch" />
      </div>
    </div>
    <ExpensesTable
      :data="filteredExpenses"
      :searchedField="searchedField"
      :alertMessage="alertMessage"
      @update-item="updateExpense"
      @delete-item="showDeleteModal"
    />
    <ModalCard
      v-if="showModal"
      :isForm="isForm"
      @executeAction="deleteExpense"
      @closeModal="closeModal"
    >
      <h3 v-if="action === 'delete'" class="message-area">
        Tem certeza que deseja excluir o pagamento da despesa de
        <strong class="highlight">{{ messageData.name }}</strong> referente ao mês de
        <strong class="highlight">{{ messageData.date }}</strong
        >?
      </h3>
      <ExpensesForm
        v-else
        :item="selectedExpense"
        :action="action"
        :modalTitle="modalTitle"
        @close-modal="closeModal"
        @show-message="alertMessage = $event"
      />
    </ModalCard>
    <div v-if="showModal" class="defocus"></div>
    <AlertMessage
      v-if="alertMessage"
      :responseMessage="alertMessage"
      @close-message="alertMessage = ''"
    >
      {{ alertMessage }}
    </AlertMessage>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ExpensesTable from "@/components/tables/ExpensesTable.vue";
import DefaultButton from "@/components/common/DefaultButton.vue";
import AlertMessage from "@/components/common/AlertMessage.vue";
import SearchFilter from "@/components/common/SearchFilter.vue";
import ModalCard from "@/components/common/ModalCard.vue";
import MonthFilter from "@/components/common/MonthFilter.vue";
import ExpensesForm from "@/components/forms/ExpensesForm.vue";
import { type Expense, type Message } from "@/types/expense";
import { useApiStore } from "@/stores/api";
import { useDataUtils } from "@/utils/dataUtils";
import axios from "axios";

const apiStore = useApiStore();
const { filteredData } = useDataUtils();

const statusList = ref<string[]>(["Pago", "À pagar", "Todos"]);
const searchedField = ref<string[]>([]);
const showModal = ref<boolean>(false);
const selectedExpense = ref<Expense>({} as Expense);
const action = ref<"create" | "update" | "delete" | "">("");
const messageData = ref<Message>({} as Message);
const modalTitle = ref<string>("");
const alertMessage = ref<string>("");
const currentMonth = ref<string>("");
const currentYear = ref<number>(0);
const currentStatus = ref<string>("");
const isForm = ref<boolean>(false);

defineProps({
  expenses: Array
});

const filteredExpenses = computed(() => {
  return filteredData(
    apiStore.expenses as Expense[],
    currentMonth.value,
    currentYear.value,
    currentStatus.value
  ) as Expense[];
});

const getMonth = (month: string) => {
  currentMonth.value = month;
};

const getYear = (year: number) => {
  currentYear.value = year;
};

const getStatus = (status: string) => {
  currentStatus.value = status;
};

const applySearch = (field: string[]) => {
  searchedField.value = field;
};

const addExpense = () => {
  showModal.value = true;
  isForm.value = true;
  action.value = "create";
  modalTitle.value = "Adicionar Despesa";
};

const updateExpense = (item: Expense) => {
  selectedExpense.value = item;
  showModal.value = true;
  isForm.value = true;
  action.value = "update";
  modalTitle.value = "Atualizar Despesa";
};

const deleteExpense = async () => {
  try {
    await axios.delete(`${apiStore.apiURL}/expense/${selectedExpense.value.id}/`);
    alertMessage.value = "Despesa excluída com sucesso!";
  } catch (error) {
    console.error("Erro ao excluir despesa.", error);

    alertMessage.value = "Erro ao excluir despesa.";
  }

  showModal.value = false;
  await apiStore.fetchExpenses();
};

const showDeleteModal = (item: Expense) => {
  selectedExpense.value = item;
  showModal.value = true;
  action.value = "delete";
  let date = `${item.month}/${item.year}`;

  messageData.value = {
    name: item.name,
    date: date,
    view: "expense"
  };
};

const closeModal = () => {
  showModal.value = false;
  isForm.value = false;
};
</script>