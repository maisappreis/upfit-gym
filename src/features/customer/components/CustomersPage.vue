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
import { useAlertStore } from "@/shared/stores/alert";
import { useLoadingStore } from "@/shared/stores/loading";
import { useCrudModal } from "@/shared/composables/useCrudModal";
import { useCustomerStore } from "@/features/customer/stores/useCustomerStore";
import { useRevenueStore } from "@/features/revenue/stores/useRevenueStore";
import { customerService } from "@/features/customer/services/customer.service";
import { revenueService } from "@/features/revenue/services/revenue.service";
import { getCurrentYearMonthDay } from "@/shared/utils/dateUtils";
import { canDeleteCustomer } from "@/features/customer/domain/canDeleteCustomer";
import { type Customer, type CreateCustomerDTO } from "@/features/customer/types/customer";

import CustomersTable from "@/features/customer/components/CustomersTable.vue";
import CustomerModal from "@/features/customer/components/CustomersModal.vue";
import BaseButton from "@/shared/components/BaseButton.vue";
import SearchFilter from "@/shared/components/SearchFilter.vue";
import StatusFilter from "@/shared/components/StatusFilter.vue";

const customerStore = useCustomerStore();
const revenueStore = useRevenueStore();
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
  customerStore.customers.filter(customer =>
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
  modalCrud.openDelete(custumer, !canDeleteCustomer(custumer.id));
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
    await customerStore.fetchCustomers();

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
    await customerStore.fetchCustomers();

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
    await revenueStore.fetchRevenue();
  } catch (error) {
    console.error("Erro ao criar receita.", error);
  }
};

const deleteCustomer = async () => {
  loadingStore.start();

  try {
    await customerService.delete(selectedCustomer.value!.id);
    await customerStore.fetchCustomers();

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
    await customerStore.fetchCustomers();
    
    closeModal();
    alertStore.success("Cliente inativado com sucesso!");
  } catch (error) {
    alertStore.error("Erro ao inativar cliente", error);
  } finally {
    loadingStore.stop();
  }
};
</script>