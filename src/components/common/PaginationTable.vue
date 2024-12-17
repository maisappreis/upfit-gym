<template>
  <div class="pagination-area">
    <span class="pagination-items">
      Página {{ currentPage }} de {{ totalPages }}
    </span>
    <button
      class="pagination-button"
      @click="goToFirstPage"
      :class="{ inactive: currentPage === 1}"
      :disabled="currentPage === 1">
      &laquo;&laquo;
    </button>
    <button
      class="pagination-button"
      @click="previousPage"
      :class="{ inactive: currentPage === 1}"
      :disabled="currentPage === 1">
      &laquo;
    </button>
    <button
      v-for="(pageNumber, index) in pageNumbers"
      :key="index"
      class="pagination-button"
      @click="goToPage(pageNumber)"
      :class="{ active: pageNumber === currentPage }"
    >
      {{ pageNumber }}
    </button>
    <button class="pagination-button"
      @click="nextPage"
      :class="{ inactive: currentPage === totalPages}"
      :disabled="currentPage === totalPages">
      &raquo;
    </button>
    <button
      class="pagination-button"
      @click="goToLastPage"
      :class="{ inactive: currentPage === totalPages}"
      :disabled="currentPage === totalPages"
    >
      &raquo;&raquo;
    </button>
    <select v-model="linesPerPage">
      <option value="5">5</option>
      <option value="8">8</option>
      <option value="15">15</option>
      <option value="30">30</option>
    </select>
    <span class="pagination-items">
      Total de {{ totalItems }} itens
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { type Revenue } from "@/types/revenue";
import { type Expense } from "@/types/expense";
import { type Customer } from "@/types/customer";

const emit = defineEmits(["current-page", "items-per-page"]);

const props = defineProps<{
  currentPage: number;
  itemsPerPage: number;
  searchedField: string[];
  data: (Customer | Revenue | Expense)[];
}>();

const linesPerPage = ref(props.itemsPerPage);

const totalPages = computed(() => {
  return Math.ceil(props.data.length / props.itemsPerPage);
});

const totalItems = computed(() => {
  return props.data.length;
});

const pageNumbers = computed(() => {
  const range = 2;
  const start = Math.max(1, props.currentPage - range);
  const end = Math.min(totalPages.value, props.currentPage + range);

  const pageNumbers = []
  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  return pageNumbers;
});

const goToPage = (pageNumber: number) => {
  emit("current-page", pageNumber);
} 

const goToFirstPage = () => {
  emit("current-page", 1);
};

const goToLastPage = () => {
  emit("current-page", totalPages.value);
};

const previousPage = () => {
  if (props.currentPage > 1) {
    emit("current-page", props.currentPage - 1);
  }
};

const nextPage = () => {
  if (props.currentPage < totalPages.value) {
    emit("current-page", props.currentPage + 1);
  }
};

watch(() => props.itemsPerPage, (newVal) => {
  linesPerPage.value = newVal;
});

watch(linesPerPage, (newVal) => {
  emit("items-per-page", Number(newVal));
});
</script>

<style scoped>
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
  
  border-radius: 4px;
  margin-right: 5px;
}

.pagination-button:hover,
.pagination-button.active {
  background-color: red;
  cursor: pointer;
}

.pagination-button.inactive {
  background-color: rgb(173, 107, 107);
  cursor: default;
}

.pagination-items {
  font-weight: bold;
  font-size: 14px;
  margin: 10px;
}


@media only screen and (max-width: 1000px) {
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
}
</style>