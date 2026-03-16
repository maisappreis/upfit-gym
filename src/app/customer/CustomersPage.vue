<template>
  <div class="content-area">
    <div class="flex space-between mb-normal">
      <BaseButton size="lg" @click="modalCrud.openCreate">
        <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
        <span class="text-add">Novo Cliente</span>
      </BaseButton>

      <div style="display: flex; justify-content: flex-end">
        <StatusFilter
          v-model="currentStatus"
          :options="['Ativo', 'Inativo', 'Todos']"
          defaultValue="Ativo"
        />
        <SearchFilter v-model="searchedField" />
      </div>
    </div>

    <CustomersTable
      :data="filteredCustomers"
      :searchedField="searchedField"
      @update-item="openUpdateModal($event)"
      @delete-item="openDeleteModal"
    />

    <CustomerModal
      :modalCrud="modalCrud"
      :customerForm="customerForm"
      @create-customer="createCustomer"
      @update-customer="updateCustomer"
      @inactive-customer="inactiveCustomer"
      @delete-customer="deleteCustomer"
      @close-modal="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useApiStore } from "@/stores/api";
import { useAlertStore } from "@/stores/alert";
import { useLoadingStore } from "@/stores/loading";
import { useCrudModal } from "@/composables/useCrudModal";
import { customerService } from "@/services/customer.service";
import { revenueService } from "@/services/revenue.service";
import { getCurrentYearMonthDay } from "@/utils/dateUtils";
import { type Customer, type CreateCustomerDTO } from "@/types/customer";

import CustomersTable from "@/app/customer/CustomersTable.vue";
import CustomerModal from "@/app/customer/CustomerModal.vue";
import BaseButton from "@/components/BaseButton.vue";
import SearchFilter from "@/components/SearchFilter.vue";
import StatusFilter from "@/components/StatusFilter.vue";

const apiStore = useApiStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();
const modalCrud = useCrudModal<Customer>();

const searchedField = ref<string[]>([]);
const currentStatus = ref<"Inativo" | "Ativo" | "Todos">("Ativo");
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

const filteredCustomers = computed(() =>
  apiStore.customers.filter(customer =>
    currentStatus.value === "Todos"
      ? true
      : customer.status === currentStatus.value
  )
);

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

const updateCustomer = async (payload: CreateCustomerDTO) => {
  loadingStore.start();

  try {
    await customerService.update(selectedCustomer.value!.id, payload);
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