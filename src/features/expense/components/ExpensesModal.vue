<template>
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
      <strong class="highlight">{{ expense?.name }}</strong> referente ao mês de
      <strong class="highlight">{{ expense?.month }}</strong> de
      <strong class="highlight">{{ expense?.year }}</strong>?
    </p>

    <!-- CREATE AND UPDATE FORM -->
    <ExpensesForm
      v-else
      v-model="props.expenseForm"
      ref="formRef"
    />

    <template #footer>
      <BaseButton
        v-if="modalCrud.isDelete.value"
        size="lg"
        :loading="loadingStore.isLoading"
        @click="$emit('delete-expense')"
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
        @click="$emit('close-modal')"
      >
        Cancelar
      </BaseButton>
    </template>
    </ModalCard>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useLoadingStore } from "@/shared/stores/loading";
import { getYearAndMonth } from "@/shared/utils/dateUtils";
import { capitalize } from "@/shared/utils/dataUtils";
import { type CrudModal } from "@/shared/composables/useCrudModal";
import { type Expense, type CreateExpenseDTO } from "@/features/expense/types/expense";

import ModalCard from "@/shared/components/ModalCard.vue";
import BaseButton from "@/shared/components/BaseButton.vue";
import ExpensesForm from "@/features/expense/components/ExpensesForm.vue";

const loadingStore = useLoadingStore();

const emit = defineEmits([
  "create-expense", "update-expense",
  "delete-expense", "close-modal"
]);

const props = defineProps<{
  modalCrud: CrudModal<Expense>;
  expenseForm: CreateExpenseDTO;
  expense: Expense |null;
}>();

const formRef = ref<any>(null);

const modalTitle = computed(() => {
  switch (props.modalCrud.mode.value) {
    case "create": return "Adicionar Despesa";
    case "update": return "Atualizar Despesa";
    case "delete": return "Excluir Despesa";
    default: return "";
  }
});

const submitForm = async () => {
  if (!formRef.value?.isValid) return;

  let date = getYearAndMonth(props.expenseForm.date);

  const payload = {
    ...props.expenseForm,
    name: capitalize(props.expenseForm.name),
    year: date.year,
    month: date.month,
  };

  if (props.modalCrud.mode.value === "create") {
    emit("create-expense", payload)
  } else {
    emit("update-expense", payload)
  }
};
</script>