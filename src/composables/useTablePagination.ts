import { ref, computed, watch } from "vue";
import { searchData } from "@/utils/dataUtils";

type NamedItem = { name: string };

export function useTablePagination<T extends NamedItem>(
  data: () => T[],
  searchedField: () => string[],
) {
  const itemsPerPage = ref(30);
  const currentPage = ref(1);

  const paginatedData = computed(() => {
    const searched = searchData(data(), searchedField());

    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;

    return searched.slice(start, end);
  });

  watch([data, searchedField, itemsPerPage], () => {
    currentPage.value = 1;
  });

  return {
    itemsPerPage,
    currentPage,
    paginatedData,
  };
};