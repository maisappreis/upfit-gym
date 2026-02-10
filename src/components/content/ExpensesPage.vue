<template>
  <div class="content-area">
    <div class="flex-between mb-normal">
      <DefaultButton
        @execute-action="modalCrud.openCreate"
        style="background-color: var(--red-dark-color)">
        <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
        <span class="button-text">Nova Despesa</span>
      </DefaultButton>
      <div style="display: flex; justify-content: flex-end">
        <MonthFilter
          @get-month="currentMonth = $event"
          @get-year="currentYear = $event"
          @get-status="currentStatus = $event"
          :statusList="statusList"
        />
        <SearchFilter @apply-search="searchedField = $event" />
      </div>
    </div>
    <ExpensesTable
      :data="filteredExpenses"
      :searchedField="searchedField"
      @update-item="modalCrud.openUpdate($event)"
      @delete-item="showDeleteModal"
    />
    <ModalCard
      v-if="modalCrud.isOpen.value"
      :isForm="modalCrud.isForm.value"
      @execute-action="deleteExpense"
      @close-modal="modalCrud.close"
    >
      <h3 v-if="modalCrud.isDelete.value" class="message-area">
        Tem certeza que deseja excluir o pagamento da despesa de
        <strong class="highlight">{{ messageData.name }}</strong> referente ao mês de
        <strong class="highlight">{{ messageData.date }}</strong
        >?
      </h3>
      <ExpensesForm
        v-else
        :item="selectedExpense"
        :action="modalCrud.mode.value"
        :modalTitle="modalTitle"
        @close-modal="modalCrud.close"
      />
    </ModalCard>
    <div v-if="modalCrud.isOpen.value" class="defocus"></div>
    <AlertMessage v-if="alertStore.visible" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useApiStore } from "@/stores/api";
import { useAlertStore } from "@/stores/alert";
import { useLoadingStore } from "@/stores/loading";
import { useCrudModal } from "@/composables/useCrudModal";
import { useDataUtils } from "@/utils/dataUtils";
import { type Expense, type Message } from "@/types/expense";

import ExpensesTable from "@/components/tables/ExpensesTable.vue";
import DefaultButton from "@/components/common/DefaultButton.vue";
import AlertMessage from "@/components/common/AlertMessage.vue";
import SearchFilter from "@/components/common/SearchFilter.vue";
import ModalCard from "@/components/common/ModalCard.vue";
import MonthFilter from "@/components/common/MonthFilter.vue";
import ExpensesForm from "@/components/forms/ExpensesForm.vue";
import axios from "axios";

const apiStore = useApiStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();

const modalCrud = useCrudModal<Expense>();
const { filteredData } = useDataUtils();

const statusList = ref<string[]>(["Pago", "À pagar", "Todos"]);
const searchedField = ref<string[]>([]);
const messageData = ref<Message>({} as Message);
const currentMonth = ref<string>("");
const currentYear = ref<number>(0);
const currentStatus = ref<string>("");

const selectedExpense = computed(() => modalCrud.entity.value);

const modalTitle = computed(() => {
  switch (modalCrud.mode.value) {
    case "create": return "Adicionar Despesa";
    case "update": return "Atualizar Despesa";
    default: return "";
  }
});

const filteredExpenses = computed(() => {
  return filteredData(
    apiStore.expenses as Expense[],
    currentMonth.value,
    currentYear.value,
    currentStatus.value
  ) as Expense[];
});

const showDeleteModal = (expense: Expense) => {
  modalCrud.openDelete(expense)

  let date = `${expense.month}/${expense.year}`;
  messageData.value = {
    name: expense.name,
    date: date,
    view: "expense"
  };
};

const deleteExpense = async () => {
  loadingStore.start();
  try {
    await axios.delete(`${apiStore.apiURL}/expense/${selectedExpense.value!.id}/`);
    await apiStore.fetchExpenses();
    
    alertStore.success("Despesa excluída com sucesso!");
    modalCrud.close();
  } catch (error) {
    alertStore.error("Erro ao excluir despesa.", error);
  } finally {
    loadingStore.stop();
  }
};
</script>