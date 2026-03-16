<template>
  <ModalCard v-model="modalCrud.isOpen.value">
    <template #header>
      <span>
        {{ modalTitle }}
      </span>
    </template>

    <!-- CHANGE VALUE CONFIRM -->
    <p
      v-if="showConfirmation"
      class="message-area"
    >
      O valor atual da mensalidade do cliente
      <strong class="highlight">{{ props.customer?.name }}</strong> é de
      <strong class="highlight">R${{ formatValue(props.customer?.value!) }}</strong>
      segundo o seu cadastro. Você gostaria de atualizar todos os futuros pagamentos deste cliente
      para este novo valor de
      <strong class="highlight">R${{ formatValue(Number(props.revenueForm.value!)) }}</strong>?
    </p>

    <!-- DELETE CONFIRM -->
    <p
      v-else-if="modalCrud.isDelete.value"
      class="message-area"
    >
      Tem certeza que deseja excluir o recebimento da mensalidade do cliente
      <strong class="highlight">{{ props.customer?.name }}</strong>
      referente ao mês de
      <strong class="highlight">{{ props.revenue?.month }}</strong>?
    </p>

    <!-- CREATE AND UPDATE FORM -->
    <RevenueForm
      v-else
      v-model="props.revenueForm"
      :months="months"
      :years="years"
      :customers-list="apiStore.customers.filter((c) => c.status === 'Ativo')"
      ref="formRef"
    />

    <template #footer>
        <BaseButton
          v-if="modalCrud.isDelete.value"
          :loading="loadingStore.isLoading"
          @click="$emit('delete-revenue')"
        >
          Confimar
        </BaseButton>
        <BaseButton
          v-else-if="showConfirmation"
          :loading="loadingStore.isLoading"
          @click="$emit('change-value')"
        >
          Confimar
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
import { useApiStore } from "@/stores/api";
import { useLoadingStore } from "@/stores/loading";
import { months, years } from "@/utils/constants";
import { type CrudModal } from "@/composables/useCrudModal";
import { type Customer } from "@/types/customer";
import { type Revenue, type CreateRevenueDTO } from "@/types/revenue";

import ModalCard from "@/components/ModalCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import RevenueForm from "@/app/revenue/RevenueForm.vue";

const apiStore = useApiStore();
const loadingStore = useLoadingStore();

const emit = defineEmits([
  "create-revenue", "update-revenue", "change-value",
  "delete-revenue", "close-modal"
]);

const props = defineProps<{
  modalCrud: CrudModal<Revenue>;
  revenueForm: CreateRevenueDTO;
  revenue: Revenue | null;
  customer: Customer | undefined;
  showConfirmation: boolean;
}>();

const formRef = ref<any>(null);

const modalTitle = computed(() => {
  switch (props.modalCrud.mode.value) {
    case "create": return "Adicionar Receita";
    case "update": return "Atualizar Receita";
    case "delete": return "Excluir Receita";
    default: return "";
  }
});

const formatValue = (value: number) => {
  return value.toFixed(2).toString().replace(/\./g, ",");
};

const submitForm = async () => {
  if (!formRef.value?.isValid) return;

  const payload = {
    ...props.revenueForm
  };

  if (props.modalCrud.mode.value === "create") {
    emit("create-revenue", payload)
  } else {
    emit("update-revenue", payload)
  }
};
</script>