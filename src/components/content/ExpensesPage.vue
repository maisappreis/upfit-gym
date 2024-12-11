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
    <DefaultTable
      :columns="columns"
      :data="filteredExpenses"
      :searchedField="searchedField"
      :requestMessage="requestMessage"
      @updateItem="updateExpense"
      @deleteItem="showDeleteModal"
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
        :item="selectedItem"
        :action="action"
        :modalTitle="modalTitle"
        @closeModal="closeModal"
        @showMessage="showMessage"
      />
    </ModalCard>
    <div v-if="showModal" class="defocus"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import DefaultTable from "@/components/common/DefaultTable.vue";
import DefaultButton from "@/components/common/DefaultButton.vue";
import SearchFilter from "@/components/common/SearchFilter.vue";
import ModalCard from "@/components/common/ModalCard.vue";
import MonthFilter from "@/components/common/MonthFilter.vue";
import ExpensesForm from "@/components/forms/ExpensesForm.vue";
import { type Expense, type Message } from "@/types/expense";
import { type Column } from "@/types/table";
import { useApiStore } from "@/stores/api";
import { useUtils } from "@/utils/utils";
import axios from "axios";

const apiStore = useApiStore();
const { filteredData } = useUtils();

const columns = ref<Column[]>([
  { key: "year", name: "Ano" },
  { key: "month", name: "Mês" },
  { key: "name", name: "Nome" },
  { key: "date", name: "Vencimento" },
  { key: "installments", name: "Parcelas" },
  { key: "value", name: "Valor" },
  { key: "paid", name: "Status" },
  { key: "actions", name: "" }
]);
const statusList = ref<string[]>(["Pago", "À pagar", "Todos"]);
const searchedField = ref<string[]>([]);
const showModal = ref<boolean>(false);
const selectedItem = ref<Expense>({} as Expense);
const action = ref<string>("");
const messageData = ref<Message>({} as Message);
const modalTitle = ref<string>("");
const requestMessage = ref<string>("");
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
  );
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
  selectedItem.value = item;
  showModal.value = true;
  isForm.value = true;
  action.value = "update";
  modalTitle.value = "Atualizar Despesa";
};

const deleteExpense = async () => {
  try {
    await axios.delete(`${apiStore.apiURL}/expense/${selectedItem.value.id}/`);
    showMessage("Despesa excluída com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir despesa.", error);

    showMessage("Erro ao excluir despesa.");
  }

  showModal.value = false;
  await apiStore.fetchExpenses();
};

const showDeleteModal = (item: Expense) => {
  selectedItem.value = item;
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

const showMessage = (msg: string) => {
  requestMessage.value = msg;
};
</script>