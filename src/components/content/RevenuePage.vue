<template>
  <div class="content-area">
    <div class="flex-between mb-normal">
      <BaseButton size="lg" @click="modalCrud.openCreate">
        <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
        Nova Receita
      </BaseButton>

      <div style="display: flex; justify-content: flex-end">
        <MonthFilter
          @get-month="currentMonth = $event"
          @get-year="currentYear = $event"
          @get-status="currentStatus = $event"
          :statusList="statusList"
        />
        <SearchFilter @apply-search="searchedField = $event" />
      </div>
    </div>

    <RevenuesTable
      :data="filteredRevenue"
      :searchedField="searchedField"
      @update-item="modalCrud.openUpdate($event)"
      @delete-item="showDeleteModal"
    />

    <ModalCard
      v-if="modalCrud.isOpen.value"
      :isForm="modalCrud.isForm.value"
      @execute-action="getModalAction"
      @close-modal="closeModal"
    >
      <h3 v-if="modalCrud.isDelete.value" class="message-area">
        Tem certeza que deseja excluir o recebimento da mensalidade do cliente
        <strong class="highlight">{{ messageData.name }}</strong>
        referente ao mês de
        <strong class="highlight">{{ messageData.date }}</strong>?
      </h3>
      <h3 v-else-if="showConfirmation" class="message-area">
        O valor atual da mensalidade do cliente
        <strong class="highlight">{{ confirmationData.name }}</strong> é de
        <strong class="highlight">R${{ formatValue(confirmationData.currentValue) }}</strong>
        segundo o seu cadastro. Você gostaria de atualizar todos os futuros pagamentos deste cliente
        para este novo valor de
        <strong class="highlight">R${{ formatValue(confirmationData.updatedValue) }}</strong>?
        <div class="form-buttons-area">
          <BaseButton size="lg" @click="getModalAction">
            Confirmar
          </BaseButton>
          <BaseButton size="lg" variant="danger" @click="closeModal">
            Cancelar
          </BaseButton>
        </div>
      </h3>
      <RevenueForm
        v-else
        :item="selectedRevenue"
        :customers="apiStore.customers"
        :action="modalCrud.mode.value"
        :modalTitle="modalTitle"
        @close-modal="closeModal"
        @get-confirmation="getConfirmation"
      />
    </ModalCard>

    <div v-if="modalCrud.isOpen.value" class="defocus"></div>

    <AlertMessage v-if="alertStore.visible" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useApiStore } from "@/stores/api";
import { useAlertStore } from "@/stores/alert";
import { useLoadingStore } from "@/stores/loading";
import { useCrudModal } from "@/composables/useCrudModal";
import { useDateUtils } from "@/utils/dateUtils";
import { useDataUtils } from "@/utils/dataUtils";
import { customerService } from "@/services/customer.service";
import { revenueService } from "@/services/revenue.service";
import { type Revenue, type UpdatedRevenue, type Message } from "@/types/revenue";

import BaseButton from "@/components/common/BaseButton.vue";
import RevenuesTable from "@/components/tables/RevenuesTable.vue";
import AlertMessage from "@/components/common/AlertMessage.vue";
import SearchFilter from "@/components/common/SearchFilter.vue";
import ModalCard from "@/components/common/ModalCard.vue";
import MonthFilter from "@/components/common/MonthFilter.vue";
import RevenueForm from "../forms/RevenueForm.vue";

import axios from "axios";

const apiStore = useApiStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();

const modalCrud = useCrudModal<Revenue>();
const { filteredData } = useDataUtils();
const { getNextMonth } = useDateUtils();

const statusList = ref<string[]>(["Pago", "À pagar", "Link enviado", "Todos"]);
const searchedField = ref<string[]>([]);
const messageData = ref<Message>({} as Message);
const currentMonth = ref<string>("");
const currentYear = ref<number>(0);
const currentStatus = ref<string>("");
const showConfirmation = ref<boolean>(false);
const confirmationData = ref<UpdatedRevenue>({} as UpdatedRevenue);

const selectedRevenue = computed(() => modalCrud.entity.value);

const modalTitle = computed(() => {
  switch (modalCrud.mode.value) {
    case "create": return "Adicionar Receita";
    case "update": return "Atualizar Receita";
    default: return "";
  }
});

const filteredRevenue = computed(() => {
  return filteredData(
    apiStore.revenue as Revenue[],
    currentMonth.value,
    currentYear.value,
    currentStatus.value
  ) as Revenue[];
});

const showDeleteModal = (revenue: Revenue) => {
  modalCrud.openDelete(revenue);

  let date = `${revenue.month}/${revenue.year}`;
  messageData.value = {
    name: revenue.name,
    date: date
  };
};

const deleteRevenue = async () => {
  loadingStore.start();
  try {
    await revenueService.delete(selectedRevenue.value!.id);
    await apiStore.fetchRevenue();

    alertStore.success("Receita excluída com sucesso!");
    closeModal();
  } catch (error) {
    alertStore.error("Erro ao excluir receita.", error);
  } finally {
    loadingStore.stop();
  }
};

const closeModal = () => {
  modalCrud.close();
  showConfirmation.value = false;
};

const getConfirmation = (data: UpdatedRevenue) => {
  confirmationData.value = data;
  modalCrud.openUpdate(selectedRevenue.value!);
  showConfirmation.value = true;
};

const getModalAction = async () => {
  if (showConfirmation.value) {
    updateFutureRevenue();
    await updateCustomerValue();
    closeModal();
    await apiStore.fetchData();
  } else {
    deleteRevenue();
  }
};

const updateFutureRevenue = () => {
  let nextMonth = getNextMonth(
    confirmationData.value.month,
    confirmationData.value.year
  );
  let nextRevenues = apiStore.revenue.filter(
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
      value: confirmationData.value.updatedValue
    };

    await customerService.update(confirmationData.value.id, updatedCustomer);
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
      value: confirmationData.value.updatedValue
    };
    await revenueService.update(id, updatedRevenue);
  } catch (error) {
    console.error("Erro ao atualizar receita.", error);
  }
};

const incrementData = () => {
  apiStore.customers.forEach((customer) => {
    const matchingRevenues = apiStore.revenue.filter(
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

const formatValue = (value: number) => {
  // TODO: Bug aqui, tem value entrando como string
  return Number(value).toFixed(2).toString().replace(/\./g, ",");
};

watch(() => apiStore.revenue, () => {
  incrementData();
});

onMounted(() => {
  if (apiStore.customers && apiStore.customers.length > 0) {
    incrementData();
  }
});
</script>