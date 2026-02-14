<template>
  <div class="content-area">
    <div class="flex-between mb-normal">
      <BaseButton size="lg" @click="modalCrud.openCreate">
        <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
        Nova Despesa
      </BaseButton>

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
      @update-item="openUpdateModal($event)"
      @delete-item="openDeleteModal($event)"
    />

    <ModalCard v-model="modalCrud.isOpen.value">
      <template #header>
        <span>
          {{ modalTitle }}
        </span>
      </template>

      <!-- DELETE CONFIRM -->
      <p
        v-if="modalCrud.isDelete.value"
        class="message-area"
      >
        Tem certeza que deseja excluir o pagamento da despesa de
        <strong class="highlight">{{ selectedExpense?.name }}</strong> referente ao mês de
        <strong class="highlight">{{ selectedExpense?.month }}</strong> de
        <strong class="highlight">{{ selectedExpense?.year }}</strong>?
      </p>

      <!-- CREATE AND UPDATE FORM -->
      <ExpensesForm
        v-else
        v-model="expenseForm"
        ref="formRef"
      />

      <template #footer>
        <BaseButton
          v-if="modalCrud.isDelete.value"
          size="lg"
          :loading="loadingStore.isLoading"
          @click="deleteExpense"
        >
          Confirmar
        </BaseButton>
        <BaseButton
          v-else
          type="submit"
          size="lg"
          :disabled="!formRef?.isValid"
          :loading="loadingStore.isLoading"
          @click="submitForm"
        >
          Salvar
        </BaseButton>
        <BaseButton
          size="lg"
          variant="danger"
          @click="modalCrud.close">
          Cancelar
        </BaseButton>
      </template>
    </ModalCard>

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
import { useDateUtils } from "@/utils/dateUtils";
import { expenseService } from "@/services/expense.service";
import { type Expense, type CreateExpenseDTO } from "@/types/expense";

import BaseButton from "@/components/common/BaseButton.vue";
import ExpensesTable from "@/components/tables/ExpensesTable.vue";
import AlertMessage from "@/components/common/AlertMessage.vue";
import SearchFilter from "@/components/common/SearchFilter.vue";
import ModalCard from "@/components/common/ModalCard.vue";
import MonthFilter from "@/components/common/MonthFilter.vue";
import ExpensesForm from "@/components/forms/ExpensesForm.vue";

const apiStore = useApiStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();

const modalCrud = useCrudModal<Expense>();
const { filteredData, capitalize } = useDataUtils();
const { getYearAndMonth }= useDateUtils();

const statusList = ref<string[]>(["Pago", "À pagar", "Todos"]);
const searchedField = ref<string[]>([]);
const currentMonth = ref<string>("");
const currentYear = ref<number>(0);
const currentStatus = ref<string>("");
const formRef = ref<any>(null);
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

const modalTitle = computed(() => {
  switch (modalCrud.mode.value) {
    case "create": return "Adicionar Despesa";
    case "update": return "Atualizar Despesa";
    case "delete": return "Excluir Despesa";
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

const submitForm = async () => {
  if (!formRef.value?.isValid) return;

  let date = getYearAndMonth(expenseForm.value.date);

  const payload = {
    ...expenseForm.value,
    name: capitalize(expenseForm.value.name),
    year: date.year,
    month: date.month,
  };

  if (modalCrud.mode.value === "create") {
    createExpense(payload);
  } else {
    updateExpense(
      selectedExpense.value!.id,
      payload
    );
  }
};

const createExpense = async (payload: CreateExpenseDTO) => {
  loadingStore.start();

  try {
    await expenseService.create(payload);
    await apiStore.fetchExpenses();

    closeModal();
    alertStore.success("Despesa criada com sucesso!");
  } catch (error) {
    alertStore.error("Erro ao criar despesa.", error);
  } finally {
    loadingStore.stop();
  }
};

const updateExpense = async (expenseId: number, payload: CreateExpenseDTO) => {
  loadingStore.start();

  try {
    await expenseService.update(expenseId, payload);
    await apiStore.fetchExpenses();

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