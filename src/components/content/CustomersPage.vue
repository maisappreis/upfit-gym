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
      @update-item="openUpdateModal($event)"
      @delete-item="openDeleteModal"
    />

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
        v-model="customerForm"
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
            @click="modalCrud.close"
          >
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
import { useDateUtils } from "@/utils/dateUtils";
import { useDataUtils } from "@/utils/dataUtils";
import { customerService } from "@/services/customer.service";
import { revenueService } from "@/services/revenue.service";
import { type Customer, type CreateCustomerDTO } from "@/types/customer";

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
const { capitalize } = useDataUtils();
const { getCurrentYearMonthDay } = useDateUtils();

const searchedField = ref<string[]>([]);
const currentStatus = ref<"Inativo" | "Ativo" | "Todos">("Ativo");
const formRef = ref<any>(null);
const customerForm = ref<CreateCustomerDTO>({
  name: "",
  frequency: "",
  start: "",
  plan: "Mensal",
  value: null,
  status: "Ativo",
  notes: ""
});

const selectedCustomer = computed(() => modalCrud.entity.value);
const customerName = computed(() => modalCrud.entity.value?.name ?? "");

const modalTitle = computed(() => {
  switch (modalCrud.mode.value) {
    case "create": return "Adicionar Cliente";
    case "update": return "Atualizar Cliente";
    case "delete": return "Excluir Cliente";
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

const confirmDelete = () => {
  modalCrud.deleteIsBlocked.value ? inactiveCustomer() : deleteCustomer();
};

const closeModal = () => {
  modalCrud.close();

  customerForm.value = {
    name: "",
    frequency: "",
    start: "",
    plan: "Mensal",
    value: null,
    status: "Ativo",
    notes: ""
  };
};

const openUpdateModal = (customer: Customer) => {
  customerForm.value = {
    name: customer.name,
    frequency: customer.frequency,
    start: customer.start,
    plan: customer.plan,
    value: customer.value,
    status: customer.status,
    notes: customer.notes ?? "",
  };

  modalCrud.openUpdate(customer);
};

const openDeleteModal = (custumer: Customer) => {
  modalCrud.openDelete(custumer, !apiStore.canDeleteCustomer(custumer.id));
};

const submitForm = async () => {
  if (!formRef.value?.isValid) return;

  const payload = {
    ...customerForm.value,
    name: capitalize(customerForm.value.name),
  };

  if (modalCrud.mode.value === "create") {
    createCustomer(payload);
  } else {
    updateCustomer(
      selectedCustomer.value!.id,
      payload
    );
  }
};

const createCustomer = async (payload: CreateCustomerDTO) => {
  loadingStore.start();

  try {
    let response = await customerService.create(payload);
    await apiStore.fetchCustomers();

    if (customerForm.value.status === "Ativo") {
      setTimeout(() => {
        createRevenue(response);
      }, 500);
    }

    closeModal();
    alertStore.success("Cliente criado com sucesso!");
  } catch (error) {
    alertStore.error("Erro ao criar cliente.", error);
  } finally {
    loadingStore.stop();
  }
};

const updateCustomer = async (customerId: number, payload: CreateCustomerDTO) => {
  loadingStore.start();

  try {
    await customerService.update(customerId, payload);
    await apiStore.fetchCustomers();

    closeModal();
    alertStore.success("Cliente atualizado com sucesso!");
  } catch (error) {
    alertStore.error("Erro ao atualizar cliente.", error);
  } finally {
    loadingStore.stop();
  }
};

const createRevenue = async (customer: Customer) => {
  try {
    let date = getCurrentYearMonthDay(customer.start);
    let paidStatus = "À pagar" as "Pago" | "À pagar";

    let newRevenue = {
      customer: customer.id,
      year: date.year,
      month: date.month,
      value: customer.value,
      payment_day: Number(date.day),
      notes: customer.notes,
      paid: paidStatus
    };

    await revenueService.create(newRevenue);
    await apiStore.fetchRevenue();
  } catch (error) {
    console.error("Erro ao criar receita.", error);
  }
};

const deleteCustomer = async () => {
  loadingStore.start();

  try {
    await customerService.delete(selectedCustomer.value!.id);
    await apiStore.fetchCustomers();

    closeModal();
    alertStore.success("Cliente excluído com sucesso");
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
    
    closeModal();
    alertStore.success("Cliente inativado com sucesso!");
  } catch (error) {
    alertStore.error("Erro ao inativar cliente", error);
  } finally {
    loadingStore.stop();
  }
};
</script>