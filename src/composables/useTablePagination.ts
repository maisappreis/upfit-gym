import { ref, computed, watch } from "vue";

export function useTablePagination<T>(
  data: () => T[],
  searchedField: () => string[],
  searchFn: (data: T[], search: string[]) => T[]
) {
  const itemsPerPage = ref(30);
  const currentPage = ref(1);

  const paginatedData = computed(() => {
    const searched = searchFn(data(), searchedField());

    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;

    return searched.slice(start, end);
  });

  watch(searchedField, () => {
    currentPage.value = 1;
  });

  return {
    itemsPerPage,
    currentPage,
    paginatedData,
  };
};