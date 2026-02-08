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
        <StatusFilter @get-status="getStatus" />
        <SearchFilter @apply-search="applySearch" />
      </div>
    </div>
    <CustomersTable
      :data="filteredCustomers"
      :searchedField="searchedField"
      :alertMessage="alertMessage"
      @update-item="updateCustomer"
      @delete-item="showDeleteModal"
      @show-message="alertMessage = $event"
    />
    <ModalCard
      v-if="showModal"
      :isForm="isForm"
      :buttonMessage="buttonMessage"
      @execute-action="getModalAction"
      @close-modal="closeModal"
    >
      <h3 v-if="action === 'delete' && blockDelete" class="message-area">
        Não é possível excluir o cliente 
        <strong class="highlight">{{ customerName }}</strong>, 
        pois isso excluiria todo o seu histórico de receitas. Ao invés de excluí-lo, 
        mude seu status para <strong class="highlight">Inativo</strong>.
      </h3>
      <h3 v-else-if="action === 'delete' && !blockDelete" class="message-area">
        Tem certeza que deseja excluir o cliente
        <strong class="highlight">{{ customerName }}</strong>?
      </h3>
      <CustomersForm
        v-else
        :item="selectedCustomer"
        :action="action"
        :modalTitle="modalTitle"
        @close-modal="closeModal"
        @show-message="alertMessage = $event"
      />
    </ModalCard>
    <div v-if="showModal" class="defocus"></div>
    <AlertMessage
      v-if="alertMessage"
      :responseMessage="alertMessage"
      @close-message="alertMessage = ''"
    >
      {{ alertMessage }}
    </AlertMessage>
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
import { useLoadingStore } from "@/stores/loading";
import { type Customer } from "@/types/customer";
import { customerService } from "@/services/customer.service";

// TODO:
// type ModalAction = 'create' | 'update' | 'delete';

const apiStore = useApiStore();
const loadingStore = useLoadingStore();

const searchedField = ref<string[]>([]);
const showModal = ref<boolean>(false);
const selectedCustomer = ref<Customer>({} as Customer);
const action = ref<"create" | "update" | "delete" | "">("");
// const action = ref<ModalAction | null>(null);
const customerName = ref<string>("");
const modalTitle = ref<string>("");
const alertMessage = ref<string>("");
const currentStatus = ref<"Inativo" | "Ativo" | "Todos">("Ativo");
const buttonMessage = ref<string>("Confirmar");
const isForm = ref<boolean>(false);
const blockDelete = ref<boolean>(false);

const filteredCustomers = computed(() => {
  if (apiStore.customers && apiStore.customers.length > 0) {
    if (currentStatus.value === "Todos") {
      return apiStore.customers;
    } else {
      return apiStore.customers.filter((e) => e.status === currentStatus.value);
    }
  } else {
    return [];
  }
});

// TODO
// const filteredCustomers = computed(() =>
//   apiStore.customers.filter(customer =>
//     currentStatus.value === 'Todos'
//       ? true
//       : customer.status === currentStatus.value
//   )
// );

const applySearch = (field: string[]) => {
  searchedField.value = field;
};

const addCustomer = () => {
  showModal.value = true;
  isForm.value = true;
  action.value = "create";
  modalTitle.value = "Adicionar Cliente";
};

const updateCustomer = (item: Customer) => {
  selectedCustomer.value = item;
  showModal.value = true;
  isForm.value = true;
  action.value = "update";
  modalTitle.value = "Atualizar Cliente";
};

const getModalAction = () => {
  if (blockDelete.value) {
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

    showModal.value = false;
    alertMessage.value = "Cliente excluído com sucesso!";

    // TODO
    // feedback.success('Cliente excluído com sucesso');
  } catch (error) {
    // feedback.error('Erro ao excluir cliente');
    console.error("Erro ao excluir cliente.", error);
    alertMessage.value = "Erro ao excluir cliente.";
  } finally {
    loadingStore.stop();
  }
};

const inactiveCustomer = async () => {
  loadingStore.start();
  try {
    await customerService.inactivate(selectedCustomer.value.id);
    await apiStore.fetchCustomers();
    
    showModal.value = false;
    alertMessage.value = "Cliente inativado com sucesso!";
  } catch (error) {
    console.error("Erro ao inativar cliente.", error);
    alertMessage.value = "Erro ao inativar cliente.";
  } finally {
    loadingStore.stop();
  }
};

const showDeleteModal = (item: Customer) => {
  selectedCustomer.value = item;
  showModal.value = true;
  action.value = "delete";
  let revenueHistory = apiStore.revenue.filter((e) => e.customer === item.id);
  // TODO
  // blockDelete.value = !canDeleteCustomer(item.id);

  customerName.value = item.name;

  if (revenueHistory.length > 0) {
    blockDelete.value = true;
    buttonMessage.value = "Inativar";
  } else {
    blockDelete.value = false;
  }
};

const closeModal = () => {
  showModal.value = false;
  isForm.value = false;
  buttonMessage.value = "Confirmar";
};

const getStatus = (status: "Inativo" | "Ativo" | "Todos") => {
  currentStatus.value = status;
};
</script>