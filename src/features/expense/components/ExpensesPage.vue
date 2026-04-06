<template>
  <div class="content-area">
    <div class="flex space-between mb-normal">
      <BaseButton size="lg" @click="modalCrud.openCreate">
        <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
        <span class="text-add">Nova Despesa</span>
      </BaseButton>

      <div style="display: flex; justify-content: flex-end">
        <DateFilter
          v-model:modelValueMonth="currentMonth"
          v-model:modelValueYear="currentYear"
        />
        <StatusFilter
          v-model="currentStatus"
          :options="['Pago', 'À pagar', 'Todos']"
          defaultValue="Todos"
        />
        <SearchFilter v-model="searchedField" />
      </div>
    </div>

    <ExpensesTable
      :data="filteredExpenses"
      :searchedField="searchedField"
      @update-item="openUpdateModal($event)"
      @delete-item="openDeleteModal($event)"
    />

    <ExpensesModal
      :modalCrud="modalCrud"
      :expenseForm="expenseForm"
      :expense="selectedExpense"
      @create-expense="createExpense"
      @update-expense="updateExpense"
      @delete-expense="deleteExpense"
      @close-modal="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAlertStore } from "@/shared/stores/alert";
import { useLoadingStore } from "@/shared/stores/loading";
import { useCrudModal } from "@/shared/composables/useCrudModal";
import { filteredData } from "@/shared/utils/dataUtils";
import { useExpenseStore } from "@/features/expense/stores/useExpenseStore";
import { expenseService } from "@/features/expense/services/expense.service";
import { type Expense, type CreateExpenseDTO } from "@/features/expense/types/expense";

import ExpensesTable from "@/features/expense/components/ExpensesTable.vue";
import ExpensesModal from "@/features/expense/components/ExpensesModal.vue";
import BaseButton from "@/shared/components/BaseButton.vue";
import DateFilter from "@/shared/components/DateFilter.vue";
import SearchFilter from "@/shared/components/SearchFilter.vue";
import StatusFilter from "@/shared/components/StatusFilter.vue";

const expenseStore = useExpenseStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();
const modalCrud = useCrudModal<Expense>();

const searchedField = ref<string[]>([]);
const currentMonth = ref<string>("");
const currentYear = ref<number>(0);
const currentStatus = ref<string>("");
const expenseForm = ref<CreateExpenseDTO>({
  name: "",
  month: "",
  date: "",
  paid: "À pagar",
  value: null,
  year: 0,
  installments: "",
  notes: "",
});

const selectedExpense = computed(() => modalCrud.entity.value);

const filteredExpenses = computed(() => {
  return filteredData(expenseStore.expenses, {
    currentMonth: currentMonth.value,
    currentYear: currentYear.value,
    currentStatus: currentStatus.value,
  });
});

const openUpdateModal = (expense: Expense) => {
  expenseForm.value = {
    name: expense.name,
    month: expense.month,
    date: expense.date,
    paid: expense.paid,
    value: expense.value,
    year: expense.year,
    installments: expense.installments,
    notes: expense.notes,
  };

  modalCrud.openUpdate(expense);
};

const openDeleteModal = (expense: Expense) => {
  modalCrud.openDelete(expense)
};

const closeModal = () => {
  modalCrud.close();

  expenseForm.value = {
     name: "",
    month: "",
    date: "",
    paid: "À pagar",
    value: null,
    year: 0,
    installments: "",
    notes: "",
  };
};

const createExpense = async (payload: CreateExpenseDTO) => {
  loadingStore.start();

  try {
    await expenseService.create(payload);
    await expenseStore.fetchExpenses();

    closeModal();
    alertStore.success("Despesa criada com sucesso!");
  } catch (error) {
    alertStore.error("Erro ao criar despesa.", error);
  } finally {
    loadingStore.stop();
  }
};

const updateExpense = async (payload: CreateExpenseDTO) => {
  loadingStore.start();

  try {
    await expenseService.update(selectedExpense.value!.id, payload);
    await expenseStore.fetchExpenses();

    closeModal();
    alertStore.success("Despesa atualizada com sucesso!");
  } catch (error) {
    alertStore.error("Erro ao atualizar despesa.", error);
  } finally {
    loadingStore.stop();
  }
};

const deleteExpense = async () => {
  loadingStore.start();
  try {
    await expenseService.delete(selectedExpense.value!.id);
    await expenseStore.fetchExpenses();
    
    alertStore.success("Despesa excluída com sucesso!");
    modalCrud.close();
  } catch (error) {
    alertStore.error("Erro ao excluir despesa.", error);
  } finally {
    loadingStore.stop();
  }
};
</script>