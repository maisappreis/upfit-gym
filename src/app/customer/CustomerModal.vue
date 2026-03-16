<template>
  <ModalCard v-model="modalCrud.isOpen.value">
    <template #header>
      <span>
        {{ modalTitle }}
      </span>
    </template>

    <!-- DELETE BLOCKED -->
    <p
      v-if="modalCrud.isDelete.value && modalCrud.deleteIsBlocked.value"
      class="message-area"
    >
      Não é possível excluir o cliente
      <strong class="highlight">{{ customerName }}</strong>,
      pois isso excluiria todo o seu histórico de receitas.
      Ao invés de excluí-lo, mude seu status para
      <strong class="highlight">Inativo</strong>.
    </p>

    <!-- DELETE CONFIRM -->
    <p
      v-else-if="modalCrud.isDelete.value"
      class="message-area"
    >
      Tem certeza que deseja excluir o cliente
      <strong class="highlight">{{ customerName }}</strong>?
    </p>

    <!-- CREATE AND UPDATE FORM -->
    <CustomersForm
      v-else
      v-model="props.customerForm"
      ref="formRef"
    />

    <template #footer>
        <BaseButton
          v-if="modalCrud.isDelete.value"
          size="lg"
          :loading="loadingStore.isLoading"
          @click="confirmDelete"
        >
          {{ buttonMessage }}
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
import { capitalize } from "@/utils/dataUtils";
import { useLoadingStore } from "@/stores/loading";
import ModalCard from "@/components/ModalCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import CustomersForm from "@/app/customer/CustomersForm.vue";
import { type Customer, type CreateCustomerDTO } from "@/types/customer";
import { type CrudModal } from "@/composables/useCrudModal";

const loadingStore = useLoadingStore();

const emit = defineEmits([
  "create-customer", "update-customer",
  "inactive-customer", "delete-customer", "close-modal"
]);

const props = defineProps<{
  modalCrud: CrudModal<Customer>;
  customerForm: CreateCustomerDTO;
}>();

const formRef = ref<any>(null);

const customerName = computed(() => props.modalCrud.entity.value?.name ?? "");

const modalTitle = computed(() => {
  switch (props.modalCrud.mode.value) {
    case "create": return "Adicionar Cliente";
    case "update": return "Atualizar Cliente";
    case "delete": return "Excluir Cliente";
    default: return "";
  }
});

const buttonMessage = computed(() =>
  props.modalCrud.mode.value === "delete" && props.modalCrud.deleteIsBlocked.value
    ? "Inativar"
    : "Confirmar"
);

const confirmDelete = () => {
  props.modalCrud.deleteIsBlocked.value ? emit("inactive-customer") : emit("delete-customer");
};

const submitForm = async () => {
  if (!formRef.value?.isValid) return;

  const payload = {
    ...props.customerForm,
    name: capitalize(props.customerForm.name),
  };

  if (props.modalCrud.mode.value === "create") {
    emit("create-customer", payload)
  } else {
    emit("update-customer", payload)
  }
};
</script>