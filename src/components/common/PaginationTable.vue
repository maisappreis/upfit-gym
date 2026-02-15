<template>
  <div class="pagination-area" role="navigation" aria-label="Pagination">
    <span class="pagination-items">
      Página {{ currentPage }} de {{ totalPages }}
    </span>

    <button
      class="pagination-button"
      aria-label="Primeira página"
      @click="goToFirstPage"
      :class="{ inactive: isFirstPage }"
      :disabled="isFirstPage"
    >
      &laquo;&laquo;
    </button>

    <button
      class="pagination-button"
      aria-label="Página anterior"
      @click="previousPage"
      :class="{ inactive: isFirstPage }"
      :disabled="isFirstPage"
    >
      &laquo;
    </button>

    <button
      v-for="pageNumber in pageNumbers"
      :key="pageNumber"
      class="pagination-button"
      @click="goToPage(pageNumber)"
      :class="{ active: pageNumber === currentPage }"
      :aria-label="`Página ${pageNumber}`"
      :aria-current="pageNumber === currentPage ? 'page' : undefined"
    >
      {{ pageNumber }}
    </button>

    <button
      class="pagination-button"
      aria-label="Próxima página"
      @click="nextPage"
      :class="{ inactive: isLastPage }"
      :disabled="isLastPage"
    >
      &raquo;
    </button>

    <button
      class="pagination-button"
      aria-label="Última página"
      @click="goToLastPage"
      :class="{ inactive: isLastPage }"
      :disabled="isLastPage"
    >
      &raquo;&raquo;
    </button>

    <select v-model="linesPerPage">
      <option :value="5">5</option>
      <option :value="10">10</option>
      <option :value="15">15</option>
      <option :value="20">20</option>
      <option :value="25">25</option>
      <option :value="30">30</option>
      <option :value="50">50</option>
    </select>

    <span class="pagination-items">
      Total de {{ totalItems }} itens
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const emit = defineEmits<{
  (e: "update:currentPage", value: number): void;
  (e: "update:itemsPerPage", value: number): void;
}>();

const props = defineProps<{
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}>();

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.totalItems / props.itemsPerPage))
);

const isFirstPage = computed(() => props.currentPage === 1);
const isLastPage = computed(() => props.currentPage === totalPages.value);

const linesPerPage = computed({
  get: () => props.itemsPerPage,
  set: (value: number) => emit("update:itemsPerPage", value),
});

const pageNumbers = computed<number[]>(() => {
  const range = 2;
  const start = Math.max(1, props.currentPage - range);
  const end = Math.min(totalPages.value, props.currentPage + range);

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const goToPage = (pageNumber: number) => {
  emit("update:currentPage", pageNumber);
};

const goToFirstPage = () => {
  emit("update:currentPage", 1);
};

const goToLastPage = () => {
  emit("update:currentPage", totalPages.value);
};

const previousPage = () => {
  if (!isFirstPage.value) {
    emit("update:currentPage", props.currentPage - 1);
  }
};

const nextPage = () => {
  if (!isLastPage.value) {
    emit("update:currentPage", props.currentPage + 1);
  }
};
</script>

<style scoped>
.pagination-area {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  gap: 5px;
}

.pagination-button {
  background-color: var(--red-dark-color);
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  transition: 0.2s;
}

.pagination-button:hover,
.pagination-button.active {
  background-color: var(--color-danger, red);
  cursor: pointer;
}

.pagination-button.inactive {
  background-color: rgb(173, 107, 107);
  cursor: default;
}

.pagination-items {
  font-weight: bold;
  font-size: 14px;
  margin: 0 10px;
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
    margin: 0 6px;
  }
}
</style>