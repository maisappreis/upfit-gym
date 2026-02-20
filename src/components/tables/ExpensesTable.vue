<template>
  <div>
    <div v-if="paginatedData.length > 0">
      <BaseTable
        :data="paginatedData"
        :columns="columns"
        rowKey="id"
      >
        <template #cell-date="{ row }">
          {{ formatDate(row.date) }}
        </template>

        <template #cell-value="{ row }">
          R$ {{ row.value!.toFixed(2).toString().replace(/\./g, ',') }}
        </template>

        <template #cell-paid="{ row }">
          <span
            class="status paid"
            :class="{
              active: row.paid === 'Pago',
              inactive: row.paid === 'À pagar'
            }"
           @click="confirmPaidStatus(row)"
          >
            {{ row.paid }}
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

    <ModalCard v-model="modalCrud.isOpen.value">
      <template #header>
        <span>
          Marcar como <strong>{{ statusMessage }}</strong>
        </span>
      </template>

      <p class="message-area">
        Gostaria de marcar essa conta como <strong>{{ statusMessage }}</strong>?
      </p>

      <template #footer>
        <BaseButton
          size="lg"
          :loading="loadingStore.isLoading"
          @click="changePaidStatus"
        >
          Confirmar
        </BaseButton>
        <BaseButton
          size="lg"
          variant="danger"
          @click="closeModal"
        >
          Cancelar
        </BaseButton>
      </template>
    </ModalCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useApiStore } from "@/stores/api";
import { useAlertStore } from "@/stores/alert";
import { useLoadingStore } from "@/stores/loading";
import { useCrudModal } from "@/composables/useCrudModal";
import { formatDate, getNextMonth } from "@/utils/dateUtils";
import { useTooltipAnchors } from "@/composables/useTooltipAnchors";
import { useTablePagination } from "@/composables/useTablePagination";
import { expenseService } from "@/services/expense.service";
import { type Expense } from "@/types/expense";

import BaseTable, { type BaseTableColumn } from "@/components/base/BaseTable.vue";
import PaginationTable from "@/components/base/PaginationTable.vue";
import TooltipModal from "@/components/base/TooltipModal.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import ModalCard from "@/components/base/ModalCard.vue";

const apiStore = useApiStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();

const props = defineProps<{
  data: Expense[];
  searchedField: string[];
}>();

const emit = defineEmits(["update-item", "delete-item"]);

const modalCrud = useCrudModal<Expense>();
const { hoveredId, refsMap, setRef } = useTooltipAnchors();
const {
  itemsPerPage,
  currentPage,
  paginatedData
} = useTablePagination(
  () => props.data,
  () => props.searchedField
);

const statusMessage = ref<string>("");
const selectedExpense = ref<Expense>();
const columns: BaseTableColumn<Expense>[] = [
  { key: "year", label: "Ano" },
  { key: "month", label: "Mês" },
  { key: "name", label: "Nome" },
  { key: "date", label: "Vencimento" },
  { key: "installments", label: "Parcelas" },
  { key: "value", label: "Valor" },
  { key: "paid", label: "Status" },
  { key: "actions", label: "" },
];

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

  modalCrud.openUpdate(selectedExpense.value);
};

const closeModal = () => {
  modalCrud.close();
  statusMessage.value = "";
};

const changePaidStatus = async () => {
  loadingStore.start();
  try {
    let updatedPaidStatus = {} as { paid: "Pago" | "À pagar"};

    switch (selectedExpense.value!.paid) {
      case "À pagar":
        updatedPaidStatus = { paid: "Pago" };
        break;
      case "Pago":
        updatedPaidStatus = { paid: "À pagar" };
        break;
    }

    await expenseService.update(selectedExpense.value!.id, updatedPaidStatus);
    await apiStore.fetchExpenses();

    if (updatedPaidStatus.paid === "Pago") {
      if (selectedExpense.value!.installments === "") {
        createExpenseForNextMonth(selectedExpense.value!);
      }
    }
    closeModal();
    alertStore.success( "Status do pagamento salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar o status de pagamento...", error);
    alertStore.error("Erro ao salvar o status do pagamento.", error);
  } finally {
    loadingStore.stop();
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
    } as Expense;

    await expenseService.create(newExpense);
    await apiStore.fetchExpenses();
  } catch (error) {
    console.error("Erro ao criar despesa.", error);
  }
};
</script>