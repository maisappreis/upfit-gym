<template>
  <div class="content-area">
    <div class="flex-between mb-normal">
      <BaseButton size="lg" @click="modalCrud.openCreate">
        <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
        Nova Receita
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

    <ModalCard v-model="modalCrud.isOpen.value">
      <template #header>
        <span>
          {{ modalTitle }}
        </span>
      </template>

      <!-- CHANGE VALUE CONFIRM -->
      <p
        v-if="showConfirmationOfValueChange"
        class="message-area"
      >
        O valor atual da mensalidade do cliente
        <strong class="highlight">{{ currentCustomer?.name }}</strong> é de
        <strong class="highlight">R${{ formatValue(currentCustomer?.value!) }}</strong>
        segundo o seu cadastro. Você gostaria de atualizar todos os futuros pagamentos deste cliente
        para este novo valor de
        <strong class="highlight">R${{ formatValue(Number(revenueForm.value!)) }}</strong>?
      </p>

      <!-- DELETE CONFIRM -->
      <p
        v-else-if="modalCrud.isDelete.value"
        class="message-area"
      >
        Tem certeza que deseja excluir o recebimento da mensalidade do cliente
        <strong class="highlight">{{ currentCustomer?.name }}</strong>
        referente ao mês de
        <strong class="highlight">{{ selectedRevenue?.month }}</strong>?
      </p>

      <!-- CREATE AND UPDATE FORM -->
      <RevenueForm
        v-else
        v-model="revenueForm"
        :months="months"
        :years="years"
        :customers-list="apiStore.customers.filter((c) => c.status === 'Ativo')"
        ref="formRef"
      />

      <template #footer>
          <BaseButton
            v-if="modalCrud.isDelete.value"
            :loading="loadingStore.isLoading"
            @click="deleteRevenue"
          >
            Confimar
          </BaseButton>
          <BaseButton
            v-else-if="showConfirmationOfValueChange"
            :loading="loadingStore.isLoading"
            @click="changeValue"
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
          <BaseButton size="lg" variant="danger" @click="modalCrud.close">
            Cancelar
          </BaseButton>
      </template>
    </ModalCard>
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
import { months, years } from "@/utils/variables";
import { type Customer } from "@/types/customer";
import { type Revenue, type CreateRevenueDTO } from "@/types/revenue";

import BaseButton from "@/components/base/BaseButton.vue";
import RevenuesTable from "@/components/tables/RevenuesTable.vue";
import ModalCard from "@/components/base/ModalCard.vue";
import DateFilter from "@/components/base/DateFilter.vue";
import SearchFilter from "@/components/base/SearchFilter.vue";
import StatusFilter from "@/components/base/StatusFilter.vue";
import RevenueForm from "@/components/forms/RevenueForm.vue";

const apiStore = useApiStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();

const modalCrud = useCrudModal<Revenue>();
const { filteredData } = useDataUtils();
const { getNextMonth } = useDateUtils();

const searchedField = ref<string[]>([]);
const currentMonth = ref<string>("");
const currentYear = ref<number>(0);
const currentStatus = ref<string>("");
const showConfirmationOfValueChange = ref<boolean>(false);
const formRef = ref<any>(null);
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
  return apiStore.customers.find((e: Customer) => e.id === selectedRevenue.value!.customer);
});

const modalTitle = computed(() => {
  switch (modalCrud.mode.value) {
    case "create": return "Adicionar Receita";
    case "update": return "Atualizar Receita";
    case "delete": return "Excluir Receita";
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

const changeValue = async () => {
  updateFutureRevenue();
  await updateCustomerValue();
  closeModal();
  await apiStore.fetchData();
};

const updateFutureRevenue = () => {
  let nextMonth = getNextMonth(
    selectedRevenue.value!.month,
    selectedRevenue.value!.year!
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

const formatValue = (value: number) => {
  return value.toFixed(2).toString().replace(/\./g, ",");
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

const submitForm = async () => {
  if (!formRef.value?.isValid) return;

  const payload = {
    ...revenueForm.value
  };

  if (modalCrud.mode.value === "create") {
    createRevenue(payload);
  } else {
    updateRevenue(
      selectedRevenue.value!.id,
      payload
    );
  }
};

const createRevenue = async (payload: CreateRevenueDTO) => {
  loadingStore.start();

  try {
    await revenueService.create({
      ...payload,
      paid: "À pagar",
    });
    await apiStore.fetchRevenue();

    closeModal();
    alertStore.success("Receita criada com sucesso!");
  } catch (error) {
    alertStore.error("Erro ao criar receita.", error);
  } finally {
    loadingStore.stop();
  }
};

const updateRevenue = async (revenueId: number, payload: CreateRevenueDTO) => {
  loadingStore.start();

  try {
    await revenueService.update(revenueId, payload);
    await apiStore.fetchRevenue();

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
    await apiStore.fetchRevenue();

    alertStore.success("Receita excluída com sucesso!");
    closeModal();
  } catch (error) {
    alertStore.error("Erro ao excluir receita.", error);
  } finally {
    loadingStore.stop();
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

watch(() => apiStore.revenue, () => {
  incrementData();
});

onMounted(() => {
  if (apiStore.customers && apiStore.customers.length > 0) {
    incrementData();
  }
});
</script>