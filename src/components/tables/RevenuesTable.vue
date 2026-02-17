<template>
  <div>
    <div v-if="paginatedData.length > 0">
      <BaseTable
        :data="paginatedData"
        :columns="columns"
        rowKey="id"
      >
        <template #cell-start="{ row }">
          {{ formatDate(row.start) }}
        </template>

        <template #cell-value="{ row }">
          R$ {{ row.value!.toFixed(2).toString().replace(/\./g, ',') }}
        </template>

        <template #cell-paid="{ row }">
          <span
            class="status paid"
            :class="{
              active: row.paid === 'Pago',
              inactive: row.paid === 'À pagar',
              sent: row.paid === 'Link enviado'
            }"
            @click="confirmPaidStatus(row)"
          >
            {{ row.paid }}
          </span>
        </template>

        <template #cell-actions="{ row }">
          <span class="align-right">
            <span
              v-if="row.notes"
              :ref="el => setRef(row.id, el)"
              @mouseenter="hoveredId = row.id"
              @mouseleave="hoveredId = null"
            >
              <font-awesome-icon
                icon="fa-solid fa-circle-info"
                class="table-icon"
              />
            </span>

            <TooltipModal
              :anchor="refsMap[row.id]"
              :visible="hoveredId === row.id"
            >
              {{ row.notes }}
            </TooltipModal>

            <font-awesome-icon
              icon="fa-solid fa-pen-to-square"
              class="table-icon"
              @click="$emit('update-item', row)"
            />

            <font-awesome-icon
              icon="fa-solid fa-trash-can"
              class="table-icon"
              @click="$emit('delete-item', row)"
            />
          </span>
        </template>

        <template #footer>
          <PaginationTable
            v-model:currentPage="currentPage"
            v-model:itemsPerPage="itemsPerPage"
            :totalItems="data.length"
          />
        </template>
      </BaseTable>
    </div>

    <div v-else class="not-found">
      Nenhum resultado foi encontrado.
    </div>

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
import { ref } from "vue";
import { useApiStore } from "@/stores/api";
import { useLoadingStore } from "@/stores/loading";
import { formatDate, getNextMonth } from "@/utils/dateUtils";
import { searchData } from "@/utils/dataUtils";
import { useCrudModal } from "@/composables/useCrudModal";
import { useTooltipAnchors } from "@/composables/useTooltipAnchors";
import { useTablePagination } from "@/composables/useTablePagination";
import { revenueService } from "@/services/revenue.service";
import { type Revenue } from "@/types/revenue";

import BaseTable, { type BaseTableColumn } from "@/components/base/BaseTable.vue";
import PaginationTable from "@/components/base/PaginationTable.vue";
import TooltipModal from "@/components/base/TooltipModal.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import ModalCard from "@/components/base/ModalCard.vue";

const apiStore = useApiStore();
const loadingStore = useLoadingStore();

const props = defineProps<{
  data: Revenue[];
  searchedField: string[];
}>();

const emit = defineEmits(["update-item", "delete-item"]);

const modalCrud = useCrudModal<Revenue>();
const { hoveredId, refsMap, setRef } = useTooltipAnchors();
const {
  itemsPerPage,
  currentPage,
  paginatedData
} = useTablePagination(
  () => props.data,
  () => props.searchedField,
  searchData
);

const responseMessage = ref<string>("");
const statusMessage = ref<string>("");
const selectedRevenue = ref<Revenue>();
const columns: BaseTableColumn<Revenue>[] = [
  { key: "year", label: "Ano" },
  { key: "month", label: "Mês" },
  { key: "name", label: "Nome" },
  { key: "start", label: "Início" },
  { key: "plan", label: "Plano" },
  { key: "payment_day", label: "Venc." },
  { key: "value", label: "Valor" },
  { key: "paid", label: "Status" },
  { key: "actions", label: "" },
];

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
</script>