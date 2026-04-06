<template>
  <div class="content-area">
    <div class="flex space-between mb-normal">
      <BaseButton size="lg" @click="modalCrud.openCreate">
        <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
        <span class="text-add">Nova Receita</span>
      </BaseButton>

      <div style="display: flex; justify-content: flex-end">
        <DateFilter
          v-model:modelValueMonth="currentMonth"
          v-model:modelValueYear="currentYear"
        />
        <StatusFilter
          v-model="currentStatus"
          :options="['Pago', 'À pagar', 'Link enviado', 'Todos']"
          defaultValue="Todos"
        />
        <SearchFilter v-model="searchedField" />
      </div>
    </div>

    <RevenuesTable
      :data="filteredRevenue"
      :searchedField="searchedField"
      @update-item="openUpdateModal($event)"
      @delete-item="openDeleteModal"
    />

    <RevenueModal
      :modalCrud="modalCrud"
      :revenueForm="revenueForm"
      :revenue="selectedRevenue"
      :customer="currentCustomer"
      :showConfirmation="showConfirmationOfValueChange"
      @create-revenue="createRevenue"
      @update-revenue="updateRevenue"
      @delete-revenue="deleteRevenue"
      @change-value="changeValue"
      @close-modal="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useAlertStore } from "@/shared/stores/alert";
import { useLoadingStore } from "@/shared/stores/loading";
import { useCrudModal } from "@/shared/composables/useCrudModal";
import { getNextMonth } from "@/shared/utils/dateUtils";
import { filteredData } from "@/shared/utils/dataUtils";
import { useAppData } from "@/shared/composables/useAppData";
import { useCustomerStore } from "@/features/customer/stores/useCustomerStore";
import { useRevenueStore } from "@/features/revenue/stores/useRevenueStore";
import { customerService } from "@/features/customer/services/customer.service";
import { revenueService } from "@/features/revenue/services/revenue.service";
import { type Customer } from "@/features/customer/types/customer";
import { type Revenue, type CreateRevenueDTO } from "@/features/revenue/types/revenue";

import RevenuesTable from "@/features/revenue/components/RevenuesTable.vue";
import RevenueModal from "@/features/revenue/components/RevenueModal.vue";
import BaseButton from "@/shared/components/BaseButton.vue";
import DateFilter from "@/shared/components/DateFilter.vue";
import SearchFilter from "@/shared/components/SearchFilter.vue";
import StatusFilter from "@/shared/components/StatusFilter.vue";

const customerStore = useCustomerStore();
const revenueStore = useRevenueStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();
const modalCrud = useCrudModal<Revenue>();
const { fetchData } = useAppData();

const searchedField = ref<string[]>([]);
const currentMonth = ref<string>("");
const currentYear = ref<number>(0);
const currentStatus = ref<string>("");
const showConfirmationOfValueChange = ref<boolean>(false);
const revenueForm = ref<CreateRevenueDTO>({
  customer: null,
  month: "",
  notes: "",
  paid: "À pagar",
  payment_day: null,
  value: null,
  year: null
});

const selectedRevenue = computed(() => modalCrud.entity.value);

const currentCustomer = computed(() => {
  if (!selectedRevenue.value) return
  return customerStore.customers.find((e: Customer) => e.id === selectedRevenue.value!.customer);
});

const filteredRevenue = computed(() => {
  return filteredData(revenueStore.revenue, {
    currentMonth: currentMonth.value,
    currentYear: currentYear.value,
    currentStatus: currentStatus.value,
  });
});

const changeValue = async () => {
  updateFutureRevenue();
  await updateCustomerValue();
  closeModal();
  await fetchData();
};

const updateFutureRevenue = () => {
  let nextMonth = getNextMonth(
    selectedRevenue.value!.month,
    selectedRevenue.value!.year!
  );
  let nextRevenues = revenueStore.revenue.filter(
    (e) => e.month === nextMonth.month && e.year === nextMonth.year
  );

  for (let i = 0; i < nextRevenues.length; i++) {
    updateRevenueValue(nextRevenues[i].id);
  }
};

const updateCustomerValue = async () => {
  loadingStore.start();
  try {
    let updatedCustomer = {
      value: revenueForm.value.value!
    };

    await customerService.update(selectedRevenue.value!.customer!, updatedCustomer);
    alertStore.success("Cliente atualizado com sucesso!");
  } catch (error) {
    alertStore.error("Erro ao atualizar cliente.", error);
  } finally {
    loadingStore.stop();
  }
};

const updateRevenueValue = async (id: number) => {
  try {
    let updatedRevenue = {
      value: revenueForm.value.value!
    };
    await revenueService.update(id, updatedRevenue);
  } catch (error) {
    console.error("Erro ao atualizar receita.", error);
  }
};

const openUpdateModal = (revenue: Revenue) => {
  revenueForm.value = {
    customer: revenue.customer,
    month: revenue.month,
    notes: revenue.notes,
    paid: revenue.paid,
    payment_day: revenue.payment_day,
    value: revenue.value,
    year: revenue.year
  };

  modalCrud.openUpdate(revenue);
};

const openDeleteModal = (revenue: Revenue) => {
  modalCrud.openDelete(revenue);
};

const closeModal = () => {
  modalCrud.close();
  showConfirmationOfValueChange.value = false;

  revenueForm.value = {
    customer: null,
    month: "",
    notes: "",
    paid: "À pagar",
    payment_day: null,
    value: null,
    year: null
  };
};

const createRevenue = async (payload: CreateRevenueDTO) => {
  loadingStore.start();

  try {
    await revenueService.create({
      ...payload,
      paid: "À pagar",
    });
    await revenueStore.fetchRevenue();

    closeModal();
    alertStore.success("Receita criada com sucesso!");
  } catch (error) {
    alertStore.error("Erro ao criar receita.", error);
  } finally {
    loadingStore.stop();
  }
};

const updateRevenue = async (payload: CreateRevenueDTO) => {
  loadingStore.start();

  try {
    await revenueService.update(selectedRevenue.value!.id, payload);
    await revenueStore.fetchRevenue();

    checkChangesInValue();

    alertStore.success("Receita atualizada com sucesso!");
  } catch (error) {
    alertStore.error("Erro ao atualizar receita.", error);
  } finally {
    loadingStore.stop();
  }
};

const checkChangesInValue = () => {
  if (currentCustomer.value) {
    const revenueValueWasChanged = currentCustomer.value.value !== Number(revenueForm.value.value);

    if (revenueValueWasChanged) {
      modalCrud.openUpdate(selectedRevenue.value!);
      showConfirmationOfValueChange.value = true;
    } else {
      closeModal();
    }
  } 
};

const deleteRevenue = async () => {
  loadingStore.start();
  try {
    await revenueService.delete(selectedRevenue.value!.id);
    await revenueStore.fetchRevenue();

    alertStore.success("Receita excluída com sucesso!");
    closeModal();
  } catch (error) {
    alertStore.error("Erro ao excluir receita.", error);
  } finally {
    loadingStore.stop();
  }
};

const incrementData = () => {
  customerStore.customers.forEach((customer) => {
    const matchingRevenues = revenueStore.revenue.filter(
      (revenue) => revenue.customer === customer.id
    );

    matchingRevenues.forEach((matchingRevenue) => {
      matchingRevenue.name = customer.name
      matchingRevenue.start = customer.start
      matchingRevenue.plan = customer.plan
      matchingRevenue.status = customer.status
    });
  });
};

watch(() => revenueStore.revenue, () => {
  incrementData();
});

onMounted(() => {
  if (customerStore.customers && customerStore.customers.length > 0) {
    incrementData();
  }
});
</script>