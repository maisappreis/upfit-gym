<template>
  <div>
    <div v-if="columns.length > 0 && paginatedData.length > 0">
      <div class="table-overflow">
        <table class="table-area" style="max-height: 50vh; overflow: auto">
          <thead>
            <tr>
              <th v-for="column in columns" :key="column.key" style="text-align: center">
                {{ column.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td v-for="column in columns" :key="column.key" style="text-align: center">
                <span v-if="column.key === 'actions'" class="align-right">
                  <font-awesome-icon
                    v-if="item.notes"
                    icon="fa-solid fa-circle-info"
                    class="icon"
                    @click="showNotes($event, item)"
                  />
                  <font-awesome-icon
                    icon="fa-solid fa-pen-to-square"
                    class="icon"
                    @click="$emit('updateItem', item)"
                  />
                  <font-awesome-icon
                    icon="fa-solid fa-trash-can"
                    class="icon"
                    @click="$emit('deleteItem', item)"
                  />
                </span>
                <span
                  v-else-if="column.key === 'status'"
                  class="status"
                  :class="{
                    active: item[column.key] === 'Ativo',
                    inactive: item[column.key] === 'Inativo'
                  }"
                >
                  {{ item[column.key] }}
                </span>
                <span v-else-if="column.key === 'value'">
                  R$
                  {{ item[column.key].toFixed(2).toString().replace(/\./g, ',') }}
                </span>
                <span v-else-if="column.key === 'start' || column.key === 'date'">
                  {{ formatDate(item[column.key]) }}
                </span>
                <span
                  v-else-if="column.key === 'paid'"
                  class="status paid"
                  :class="{
                    active: item[column.key] === 'Pago',
                    inactive: item[column.key] === 'À pagar',
                    sent: item[column.key] === 'Link enviado'
                  }"
                  @click="confirmPaidStatus(item)"
                >
                  {{ item[column.key] }}
                </span>
                <span v-else>
                  {{ item[column.key] }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-area">
        <span class="pagination-items">Página {{ currentPage }} de {{ totalPages }}</span>
        <button class="pagination-button" @click="goToFirstPage" :disabled="currentPage === 1">
          &laquo;&laquo;
        </button>
        <button class="pagination-button" @click="previousPage" :disabled="currentPage === 1">
          &laquo;
        </button>
        <button
          v-for="pageNumber in getPageNumbers()"
          :key="pageNumber"
          class="pagination-button"
          @click="goToPage(pageNumber)"
          :class="{ active: pageNumber === currentPage }"
        >
          {{ pageNumber }}
        </button>
        <button class="pagination-button" @click="nextPage" :disabled="currentPage === totalPages">
          &raquo;
        </button>
        <button
          class="pagination-button"
          @click="goToLastPage"
          :disabled="currentPage === totalPages"
        >
          &raquo;&raquo;
        </button>
        <select v-model="itemsPerPage">
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="8">8</option>
          <option value="15">15</option>
          <option value="30">30</option>
        </select>
        <span class="pagination-items">Total de {{ totalItems }} itens</span>
      </div>
      <TooltipModal v-if="showingTooltip" :mouseX="mouseX" :mouseY="mouseY">
        <p class="tooltip-text">{{ tooltip }}</p>
      </TooltipModal>
    </div>
    <div v-else class="not-found">Nenhum resultado foi encontrado.</div>
    <AlertMessage
      v-if="responseMessage"
      :responseMessage="responseMessage"
      @close-message="responseMessage = ''"
    >
      {{ responseMessage }}
    </AlertMessage>
    <ModalCard v-if="showModal" @executeAction="changePaidStatus" @closeModal="closeModal">
      <span class="message-area" style="font-size: 20px"
        >Marcar como <strong>{{ statusMessage }}</strong
        >?</span
      >
    </ModalCard>
    <div v-if="showModal" class="defocus"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import TooltipModal from "./TooltipModal.vue";
import AlertMessage from "./AlertMessage.vue";
import ModalCard from "./ModalCard.vue";
import { type Revenue } from "@/types/revenue";
import { type Expense } from "@/types/expense";
import { type Customer } from "@/types/customer";
import { useApiStore } from "@/stores/api";
import { usePageStore } from "@/stores/page";
import { useUtils } from "@/utils/utils";
import axios from "axios";

const apiStore = useApiStore();
const pageStore = usePageStore();
const { getNextMonth } = useUtils();

const itemsPerPage = ref<number>(8);
const currentPage = ref<number>(1);
const showingTooltip = ref<boolean>(false);
const tooltip = ref<string>("");
const mouseX = ref<number>(0);
const mouseY = ref<number>(0);
const responseMessage = ref<string>("");
const entity = ref<string>("");
const showModal = ref<boolean>(false);
const statusMessage = ref<string>("");
const selectedItem = ref<Revenue | Expense | Customer>();

const props = defineProps<{
  columns: array;
  data: array;
  searchedField: string[];
  requestMessage: string;
}>();


const paginatedData = computed(() => {
  if (props.searchedField && props.searchedField.length == 0) {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + Number(itemsPerPage.value);

    return filteredList.value.slice(startIndex, endIndex);
  } else {
    return filteredList.value;
  }
});

const totalPages = computed(() => {
  if (props.searchedField && props.searchedField.length > 0) {
    return Math.ceil(filteredList.value.length / itemsPerPage.value);
  } else {
    return Math.ceil(orderedData.value.length / itemsPerPage.value);
  }
});

const totalItems = computed(() => {
  if (props.searchedField && props.searchedField.length > 0) {
    return filteredList.value.length;
  } else {
    return orderedData.value.length;
  }
});

const filteredList = computed(() => {
  if (props.searchedField && props.searchedField.length > 0) {
    return orderedData.value.reduce((filteredData, item) => {
      const matched = props.searchedField.some((element) => {
        const searchedFieldName = element.toLowerCase();
        const listedFieldName = item.name.toLowerCase();

        return listedFieldName.includes(searchedFieldName);
      })
      if (matched) {
        filteredData.push(item);
      }
      return filteredData;
    }, []);
  } else {
    return orderedData.value;
  }
});

const orderedData = computed(() => {
  if (props.data && props.data.length > 0) {
    let orderedList = orderData(props.data);
    return orderedList;
  } else {
    return [];
  }
});

const showNotes = (event, item) => {
  showingTooltip.value = !showingTooltip.value;
  tooltip.value = item.notes;
  mouseX.value = event.clientX - 40;
  mouseY.value = event.clientY + 15;
};

const confirmPaidStatus = (item) => {
  selectedItem.value = item;

  if (pageStore.currentPage === "revenue") {
    if (selectedItem.value.paid == "À pagar") {
      statusMessage.value = "link enviado";
    } else if (selectedItem.value.paid == "Link enviado") {
      statusMessage.value = "pago";
    } else if (selectedItem.value.paid == "Pago") {
      statusMessage.value = "à pagar";
    }
  }

  if (pageStore.currentPage === "expenses") {
    if (selectedItem.value.paid == "À pagar") {
      statusMessage.value = "pago";
    } else if (selectedItem.value.paid == "Pago") {
      statusMessage.value = "à pagar";
    }
  }

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  statusMessage.value = "";
};

const changePaidStatus = async () => {
  try {
    let updatedPaidStatus = {};

    if (pageStore.currentPage === "expenses") {
      entity.value = "expense";
      if (selectedItem.value.paid === "À pagar") {
        updatedPaidStatus = {
          paid: "Pago"
        };
      } else if (selectedItem.value.paid === "Pago") {
        updatedPaidStatus = {
          paid: "À pagar"
        };
      }
    } else if (pageStore.currentPage === "revenue") {
      entity.value = "revenue";
      if (selectedItem.value.paid === "À pagar") {
        updatedPaidStatus = {
          paid: "Link enviado"
        };
      } else if (selectedItem.value.paid === "Link enviado") {
        updatedPaidStatus = {
          paid: "Pago"
        };
      } else if (selectedItem.value.paid === "Pago") {
        updatedPaidStatus = {
          paid: "À pagar"
        };
      }
    }

    await axios.patch(
      `${apiStore.apiURL}/${entity.value}/${selectedItem.value.id}/`,
      updatedPaidStatus
    );
    if (entity.value === "revenue") await apiStore.fetchRevenue();
    if (entity.value === "expense") await apiStore.fetchExpenses();
    responseMessage.value = "Status do pagamento salvo com sucesso!";

    if (updatedPaidStatus.paid === "Pago") {
      if (pageStore.currentPage === "revenue" && selectedItem.value.status === "Ativo") {
        createRevenueForNextMonth(selectedItem.value);
      } else if (
        pageStore.currentPage === "expenses" &&
        selectedItem.value.installments === ""
      ) {
        createExpenseForNextMonth(selectedItem.value);
      }
    }
    closeModal()
  } catch (error) {
    console.error("Erro ao atualizar o status de pagamento...", error);
    responseMessage.value = "Erro ao salvar o status do pagamento.";
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const getPageNumbers = () => {
  const range = 2;
  const start = Math.max(1, currentPage.value - range);
  const end = Math.min(totalPages.value, currentPage.value + range);

  const pageNumbers = []
  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }
  return pageNumbers;
};

const goToPage = (pageNumber: number) => {
  currentPage.value = pageNumber;
}; 

const goToFirstPage = () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1;
  }
};

const goToLastPage = () => {
  if (currentPage.value !== totalPages.value) {
    currentPage.value = totalPages.value;
  }
};

const orderData = (list) => {
  console.log("list", list)
  return list.sort((a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()

    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  });
};

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");

  const formattedDateString = `${day}/${month}/${year}`;
  return formattedDateString;
};

const createRevenueForNextMonth = async (item) => {
  try {
    let nextMonth = getNextMonth(item.month, item.year);

    let newRevenue = {
      customer: item.customer,
      year: nextMonth.year,
      month: nextMonth.month,
      value: item.value,
      payment_day: item.payment_day,
      notes: item.notes,
      paid: "À pagar"
    };

    await axios.post(`${apiStore.apiURL}/revenue/create/`, newRevenue);
    await apiStore.fetchRevenue();
  } catch (error) {
    console.error("Erro ao criar receita.", error);
  }
};

const createExpenseForNextMonth = async (item) => {
  try {
    let nextMonth = getNextMonth(item.month, item.year);
    let paymentDay = parseInt(item.date.slice(-2));
    let dueDate = `${nextMonth.year}-${nextMonth.monthNumber}-${paymentDay}`;

    let newExpense = {
      year: nextMonth.year,
      month: nextMonth.month,
      name: item.name,
      date: dueDate,
      value: item.value,
      paid: "À pagar",
      notes: item.notes
    };

    await axios.post(`${apiStore.apiURL}/expense/create/`, newExpense);
    await apiStore.fetchExpenses();
  } catch (error) {
    console.error("Erro ao criar despesa.", error);
  }
};

watch(() => props.requestMessage, () => {
  if (props.requestMessage) {
    responseMessage.value = props.requestMessage;
  }
});
</script>

<style scoped>
.table-overflow {
  max-height: 360px;
  overflow: auto;
}

.table-area {
  width: 100%;
  border-collapse: collapse;
}

thead {
  position: sticky;
  top: 0;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: var(--gray-dark-color);
  color: white;
}

tr:nth-child(even) {
  background-color: #eeeded;
}

tr:hover {
  background-color: var(--red-light-color);
}

.icon {
  font-size: 20px;
  margin: 0 10px;
  cursor: pointer;
}

.status {
  color: white;
  padding: 3px 10px;
  border-radius: 8px;
}

.paid {
  cursor: pointer;
}

.active {
  background-color: green;
}

.inactive {
  background-color: red;
}

.sent {
  background-color: orange;
}

.pagination-area {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.pagination-button {
  background-color: var(--red-dark-color);
  color: white;
  border: none;
  padding: 5px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  transition-duration: 0.4s;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 5px;
}

.pagination-button:hover,
.pagination-button.active {
  background-color: red;
}

.no-results {
  color: red;
  font-weight: bold;
  font-size: 30px;
}

.total-items {
  font-weight: bold;
  font-size: 16px;
  margin: 10px;
}

.pagination-items {
  font-weight: bold;
  font-size: 14px;
  margin: 10px;
}

.checkbox {
  transform: scale(1.5);
  margin-right: 5px;
}

.align-right {
  display: flex;
  justify-content: flex-end;
  margin-right: 15px;
}

@media only screen and (max-width: 1000px) {
  .table-overflow {
    max-height: 280px;
  }

  th,
  td {
    padding: 5px;
    font-size: 13px;
  }

  .icon {
    font-size: 15px;
    margin: 0 5px;
  }

  .pagination-area {
    margin-top: 10px;
  }

  .pagination-button {
    padding: 0px 16px;
    height: 30px;
  }

  .pagination-items {
    font-size: 12px;
    margin: 7px;
  }

  .align-right {
    margin-right: 0;
  }

  .status {
    padding: 3px 5px;
  }

  .tooltip-text {
    margin: 0;
    font-size: 12px;
  }
}
</style>