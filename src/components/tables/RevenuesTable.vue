<template>
  <div>
    <div v-if="paginatedData.length > 0">
      <div class="table-overflow">
        <table
          class="table-area"
          style="max-height: 50vh; overflow: auto">
          <thead>
            <tr>
              <th>Ano</th>
              <th>Mês</th>
              <th>Nome</th>
              <th>Início</th>
              <th>Plano</th>
              <th>Venc.</th>
              <th>Valor</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(revenue, index) in paginatedData" :key="index">
              <td>{{ revenue.year }}</td>
              <td>{{ revenue.month }}</td>
              <td>{{ revenue.name }}</td>
              <td>{{ formatDate(revenue.start) }}</td>
              <td>{{ revenue.plan }}</td>
              <td>{{ revenue.payment_day }}</td>
              <td>
                R$ {{ revenue.value!.toFixed(2).toString().replace(/\./g, ',') }}
              </td>
              <td>
                <span
                  class="status paid"
                  :class="{
                    active: revenue.paid === 'Pago',
                    inactive: revenue.paid === 'À pagar',
                    sent: revenue.paid === 'Link enviado'
                  }"
                  @click="confirmPaidStatus(revenue)"
                >
                  {{ revenue.paid }}
                </span>
              </td>
              <td>
                <span class="align-right">
                  <font-awesome-icon
                    v-if="revenue.notes"
                    icon="fa-solid fa-circle-info"
                    class="table-icon"
                    @click="showNotes($event, revenue)"
                  />
                  <font-awesome-icon
                    icon="fa-solid fa-pen-to-square"
                    class="table-icon"
                    @click="emit('update-item', revenue)"
                  />
                  <font-awesome-icon
                    icon="fa-solid fa-trash-can"
                    class="table-icon"
                    @click="emit('delete-item', revenue)"
                  />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <PaginationTable
        :itemsPerPage="itemsPerPage"
        :currentPage="currentPage"
        :searchedField="searchedField"
        :data="data"
        @current-page="setCurrentPage"
        @items-per-page="setItemsPerPage"
      />
      <TooltipModal v-if="showingTooltip" :mouseX="mouseX" :mouseY="mouseY">
        <p class="tooltip-text">{{ tooltip }}</p>
      </TooltipModal>
    </div>
    <div v-else class="not-found">Nenhum resultado foi encontrado.</div>

    <ModalCard v-model="modalCrud.isOpen.value">
      <template #header>
        <span>
          Marcar como <strong>{{ statusMessage }}</strong>
        </span>
      </template>

      <p class="message-area" style="font-size: 20px">
        Gostaria de marcar essa receita como <strong>{{ statusMessage }}</strong>?
      </p>

      <template #footer>
        <BaseButton
          size="lg"
          :loading="loadingStore.isLoading"
          @click="changePaidStatus"
        >
          Confirmar
        </BaseButton>
        <BaseButton
          size="lg" variant="danger" @click="closeModal">
          Cancelar
        </BaseButton>
      </template>
    </ModalCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useApiStore } from "@/stores/api";
import { useLoadingStore } from "@/stores/loading";
import { useDateUtils } from "@/utils/dateUtils";
import { useDataUtils } from "@/utils/dataUtils";
import { useCrudModal } from "@/composables/useCrudModal";
import { revenueService } from "@/services/revenue.service";
import { type Revenue } from "@/types/revenue";

import PaginationTable from "@/components/common/PaginationTable.vue";
import TooltipModal from "@/components/common/TooltipModal.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import ModalCard from "@/components/common/ModalCard.vue";

const apiStore = useApiStore();
const loadingStore = useLoadingStore();

const modalCrud = useCrudModal<Revenue>();
const { formatDate, getNextMonth } = useDateUtils();
const { searchData } = useDataUtils();
const emit = defineEmits(["update-item", "delete-item"]);

const itemsPerPage = ref<number>(30);
const currentPage = ref<number>(1);
const showingTooltip = ref<boolean>(false);
const tooltip = ref<string>("");
const mouseX = ref<number>(0);
const mouseY = ref<number>(0);
const responseMessage = ref<string>("");
const statusMessage = ref<string>("");
const selectedRevenue = ref<Revenue>();

const props = defineProps<{
  data: Revenue[];
  searchedField: string[];
}>();

const paginatedData = computed(() => {
  const searchedData = searchData(props.data, props.searchedField);
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + Number(itemsPerPage.value);

  return searchedData.slice(startIndex, endIndex) as Revenue[];
});

const showNotes = (event: MouseEvent, revenue: Revenue) => {
  showingTooltip.value = !showingTooltip.value;
  tooltip.value = revenue.notes;
  mouseX.value = event.clientX - 40;
  mouseY.value = event.clientY + 15;
};

const confirmPaidStatus = (revenue: Revenue) => {
  selectedRevenue.value = revenue;

  switch (selectedRevenue.value!.paid) {
    case "À pagar":
      statusMessage.value = "link enviado";
      break;
    case "Link enviado":
      statusMessage.value = "pago";
      break;
    case "Pago":
      statusMessage.value = "à pagar";
      break;
  }

  modalCrud.openUpdate(selectedRevenue.value)
};

const closeModal = () => {
  modalCrud.close();
  statusMessage.value = "";
};

const setItemsPerPage = (newItemsPerPage: number) => {
  itemsPerPage.value = newItemsPerPage;
};

const setCurrentPage = (newCurrentPage: number) => {
  currentPage.value = newCurrentPage;
};

const changePaidStatus = async () => {
  loadingStore.start();
  try {
    let updatedPaidStatus = {} as { paid: "Pago" | "À pagar" | "Link enviado"};

    switch (selectedRevenue.value!.paid) {
      case "À pagar":
        updatedPaidStatus = { paid: "Link enviado" };
        break;
      case "Link enviado":
        updatedPaidStatus = { paid: "Pago" };
        break;
      case "Pago":
        updatedPaidStatus = { paid: "À pagar" };
        break;
    };

    await revenueService.update(selectedRevenue.value!.id, updatedPaidStatus);

    if (updatedPaidStatus.paid === "Pago") {
      if (selectedRevenue.value!.status === "Ativo") {
        createRevenueForNextMonth(selectedRevenue.value!);
      }
    }

    await apiStore.fetchRevenue();

    closeModal();
    responseMessage.value = "Status do pagamento salvo com sucesso!";
  } catch (error) {
    console.error("Erro ao atualizar o status de pagamento...", error);
    responseMessage.value = "Erro ao salvar o status do pagamento.";
  } finally {
    loadingStore.stop();
  }
};

const createRevenueForNextMonth = async (revenue: Revenue) => {
  try {
    let nextMonth = getNextMonth(revenue.month, revenue.year!);
    let paidStatus = "À pagar" as "Pago" | "À pagar";

    let newRevenue = {
      customer: revenue.customer,
      year: nextMonth.year,
      month: nextMonth.month,
      value: revenue.value,
      payment_day: revenue.payment_day,
      notes: revenue.notes,
      paid: paidStatus
    };

    await revenueService.create(newRevenue);
  } catch (error) {
    console.error("Erro ao criar receita.", error);
  }
};

watch(() => props.searchedField, () => {
  if (props.searchedField.length > 0) {
    currentPage.value = 1;
  }
});
</script>