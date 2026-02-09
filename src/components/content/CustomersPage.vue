<template>
  <div class="content-area">
    <div class="flex-between mb-normal">
      <DefaultButton
        @execute-action="addCustomer"
        style="background-color: var(--red-dark-color)">
        <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
        <span class="button-text">Novo Cliente</span>
      </DefaultButton>
      <div style="display: flex; justify-content: flex-end">
        <StatusFilter @get-status="currentStatus = $event" />
        <SearchFilter @apply-search="searchedField = $event" />
      </div>
    </div>
    <CustomersTable
      :data="filteredCustomers"
      :searchedField="searchedField"
      @update-item="updateCustomer"
      @delete-item="showDeleteModal"
    />
    <ModalCard
      v-if="isModalOpen"
      :isForm="isForm"
      :buttonMessage="buttonMessage"
      @execute-action="getModalAction"
      @close-modal="closeModal"
    >
      <h3 v-if="isDeleteAction && modal.blockDelete" class="message-area">
        Não é possível excluir o cliente 
        <strong class="highlight">{{ customerName }}</strong>, 
        pois isso excluiria todo o seu histórico de receitas. Ao invés de excluí-lo, 
        mude seu status para <strong class="highlight">Inativo</strong>.
      </h3>
      <h3 v-else-if="isDeleteAction && !modal.blockDelete" class="message-area">
        Tem certeza que deseja excluir o cliente
        <strong class="highlight">{{ customerName }}</strong>?
      </h3>
      <CustomersForm
        v-else
        :item="selectedCustomer"
        :action="modal.mode"
        :modalTitle="modalTitle"
        @close-modal="closeModal"
      />
    </ModalCard>
    <div v-if="isModalOpen" class="defocus"></div>
    <AlertMessage v-if="alertStore.visible" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import CustomersTable from "@/components/tables/CustomersTable.vue";
import DefaultButton from "@/components/common/DefaultButton.vue";
import AlertMessage from "@/components/common/AlertMessage.vue";
import SearchFilter from "@/components/common/SearchFilter.vue";
import ModalCard from "@/components/common/ModalCard.vue";
import CustomersForm from "@/components/forms/CustomersForm.vue";
import StatusFilter from "@/components/common/StatusFilter.vue";
import { useApiStore } from "@/stores/api";
import { useAlertStore } from "@/stores/alert";
import { useLoadingStore } from "@/stores/loading";
import { type Customer } from "@/types/customer";
import { customerService } from "@/services/customer.service";

type ModalMode = 'create' | 'update' | 'delete' | null;

interface ModalState {
  mode: ModalMode;
  customer: Customer | null;
  blockDelete: boolean;
}

const apiStore = useApiStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();

const searchedField = ref<string[]>([]);
const selectedCustomer = ref<Customer>({} as Customer);
const customerName = ref<string>("");
const currentStatus = ref<"Inativo" | "Ativo" | "Todos">("Ativo");
const modal = ref<ModalState>({
  mode: null,
  customer: null,
  blockDelete: false
});

const isModalOpen = computed(() => modal.value.mode !== null);

const isDeleteAction = computed(() => modal.value.mode === "delete");

const isForm = computed(() =>
  modal.value.mode === "create" || modal.value.mode === "update"
);

const modalTitle = computed(() => {
  switch (modal.value.mode) {
    case "create": return "Adicionar Cliente";
    case "update": return "Atualizar Cliente";
    default: return "";
  }
});

const buttonMessage = computed(() =>
  modal.value.mode === "delete" && modal.value.blockDelete
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

const addCustomer = () => {
  modal.value = {
    mode: 'create',
    customer: null,
    blockDelete: false
  };
};

const updateCustomer = (customer: Customer) => {
  selectedCustomer.value = customer;

  modal.value = {
    mode: 'update',
    customer: customer,
    blockDelete: false
  };
};

const getModalAction = () => {
  if (modal.value.blockDelete) {
    inactiveCustomer();
  } else {
    deleteCustomer();
  }
};

const deleteCustomer = async () => {
  loadingStore.start();

  try {
    await customerService.delete(selectedCustomer.value.id);
    await apiStore.fetchCustomers();

    alertStore.success("Cliente excluído com sucesso");
  } catch (error) {
    alertStore.error("Erro ao excluir cliente.", error);
  } finally {
    loadingStore.stop();
    modal.value.mode = null;
  }
};

const inactiveCustomer = async () => {
  loadingStore.start();

  try {
    await customerService.inactivate(selectedCustomer.value.id);
    await apiStore.fetchCustomers();
    
    alertStore.success("Cliente inativado com sucesso!");
  } catch (error) {
    alertStore.error("Erro ao inativar cliente", error);
  } finally {
    loadingStore.stop();
    modal.value.mode = null;
  }
};

const showDeleteModal = (custumer: Customer) => {
  selectedCustomer.value = custumer;
  customerName.value = custumer.name;

  modal.value = {
    mode: "delete",
    customer: custumer,
    blockDelete: !apiStore.canDeleteCustomer(custumer.id)
  };
};

const closeModal = () => {
  modal.value = {
    mode: null,
    customer: null,
    blockDelete: false
  };
};
</script>