<template>
  <div class="content-area">
    <div class="flex-between mb-normal">
      <BaseButton size="lg" @click="modalCrud.openCreate">
        <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
        Novo Cliente
      </BaseButton>

      <div style="display: flex; justify-content: flex-end">
        <StatusFilter @get-status="currentStatus = $event" />
        <SearchFilter @apply-search="searchedField = $event" />
      </div>
    </div>

    <CustomersTable
      :data="filteredCustomers"
      :searchedField="searchedField"
      @update-item="modalCrud.openUpdate($event);"
      @delete-item="showDeleteModal"
    />

    <ModalCard
      v-if="modalCrud.isOpen.value"
      :isForm="modalCrud.isForm.value"
      :buttonMessage="buttonMessage"
      @execute-action="confirmDelete"
      @close-modal="modalCrud.close"
    >
      <h3 v-if="modalCrud.isDelete.value && modalCrud.deleteIsBlocked.value" class="message-area">
        Não é possível excluir o cliente 
        <strong class="highlight">{{ customerName }}</strong>, 
        pois isso excluiria todo o seu histórico de receitas. Ao invés de excluí-lo, 
        mude seu status para <strong class="highlight">Inativo</strong>.
      </h3>
      <h3 v-else-if="modalCrud.isDelete.value && !modalCrud.deleteIsBlocked.value" class="message-area">
        Tem certeza que deseja excluir o cliente
        <strong class="highlight">{{ customerName }}</strong>?
      </h3>
      <CustomersForm
        v-else
        :item="selectedCustomer"
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
import { customerService } from "@/services/customer.service";
import { type Customer } from "@/types/customer";

import BaseButton from "@/components/common/BaseButton.vue";
import CustomersTable from "@/components/tables/CustomersTable.vue";
import AlertMessage from "@/components/common/AlertMessage.vue";
import SearchFilter from "@/components/common/SearchFilter.vue";
import ModalCard from "@/components/common/ModalCard.vue";
import CustomersForm from "@/components/forms/CustomersForm.vue";
import StatusFilter from "@/components/common/StatusFilter.vue";

const apiStore = useApiStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();

const modalCrud = useCrudModal<Customer>();

const searchedField = ref<string[]>([]);
const currentStatus = ref<"Inativo" | "Ativo" | "Todos">("Ativo");

const selectedCustomer = computed(() => modalCrud.entity.value);
const customerName = computed(() => modalCrud.entity.value?.name ?? "");

const modalTitle = computed(() => {
  switch (modalCrud.mode.value) {
    case "create": return "Adicionar Cliente";
    case "update": return "Atualizar Cliente";
    default: return "";
  }
});

const buttonMessage = computed(() =>
  modalCrud.mode.value === "delete" && modalCrud.deleteIsBlocked.value
    ? "Inativar"
    : "Confirmar"
);

const filteredCustomers = computed(() =>
  apiStore.customers.filter(customer =>
    currentStatus.value === "Todos"
      ? true
      : customer.status === currentStatus.value
  )
);

const showDeleteModal = (custumer: Customer) => {
  modalCrud.openDelete(custumer, !apiStore.canDeleteCustomer(custumer.id));
};

const confirmDelete = () => {
  modalCrud.deleteIsBlocked.value ? inactiveCustomer() : deleteCustomer();
};

const deleteCustomer = async () => {
  loadingStore.start();

  try {
    await customerService.delete(selectedCustomer.value!.id);
    await apiStore.fetchCustomers();

    alertStore.success("Cliente excluído com sucesso");
    modalCrud.close();
  } catch (error) {
    alertStore.error("Erro ao excluir cliente.", error);
  } finally {
    loadingStore.stop();
  }
};

const inactiveCustomer = async () => {
  loadingStore.start();

  try {
    await customerService.update(selectedCustomer.value!.id, { status: 'Inativo' });
    await apiStore.fetchCustomers();
    
    alertStore.success("Cliente inativado com sucesso!");
    modalCrud.close();
  } catch (error) {
    alertStore.error("Erro ao inativar cliente", error);
  } finally {
    loadingStore.stop();
  }
};
</script>