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
                R$ {{ expense.value!.toFixed(2).toString().replace(/\./g, ',') }}
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
                  <span
                    v-if="expense.notes"
                    :ref="el => setRef(expense.id, el)"
                    @mouseenter="hoveredId = expense.id"
                    @mouseleave="hoveredId = null"
                  >
                    <font-awesome-icon
                      icon="fa-solid fa-circle-info"
                      class="table-icon"
                    />
                  </span>
                  <TooltipModal
                    :anchor="refsMap[expense.id]"
                    :visible="hoveredId === expense.id"
                  >
                    {{ expense.notes }}
                  </TooltipModal>
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
        v-model:currentPage="currentPage"
        v-model:itemsPerPage="itemsPerPage"
        :totalItems="data.length"
      />
    </div>

    <div v-else class="not-found">Nenhum resultado foi encontrado.</div>

    <ModalCard v-model="modalCrud.isOpen.value">
      <template #header>
        <span>
          Marcar como <strong>{{ statusMessage }}</strong>
        </span>
      </template>

      <p class="message-area" style="font-size: 20px">
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
          size="lg" variant="danger" @click="closeModal">
          Cancelar
        </BaseButton>
      </template>
    </ModalCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type ComponentPublicInstance } from "vue";
import { useApiStore } from "@/stores/api";
import { useAlertStore } from "@/stores/alert";
import { useLoadingStore } from "@/stores/loading";
import { useCrudModal } from "@/composables/useCrudModal";
import { useDateUtils } from "@/utils/dateUtils";
import { useDataUtils } from "@/utils/dataUtils";
import { expenseService } from "@/services/expense.service";
import { type Expense } from "@/types/expense";

import PaginationTable from "@/components/common/PaginationTable.vue";
import TooltipModal from "@/components/common/TooltipModal.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import ModalCard from "@/components/common/ModalCard.vue";

const apiStore = useApiStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();

const modalCrud = useCrudModal<Expense>();
const { formatDate, getNextMonth } = useDateUtils();
const { searchData } = useDataUtils();
const emit = defineEmits(["update-item", "delete-item"]);

const itemsPerPage = ref<number>(30);
const currentPage = ref<number>(1);
const statusMessage = ref<string>("");
const selectedExpense = ref<Expense>();
const hoveredId = ref<number | null>(null);
const refsMap = ref<Record<number, HTMLElement | null>>({});

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

watch(() => props.searchedField, () => {
  if (props.searchedField.length > 0) {
    currentPage.value = 1;
  }
});
</script>