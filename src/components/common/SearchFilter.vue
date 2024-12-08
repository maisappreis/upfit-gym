<template>
  <input
    class="search-area"
    type="text"
    placeholder="Pesquisar nomes separados por vírgula..."
    v-model="search"
    @input="applyFilter"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const search = ref<string>("");
const searchedField = ref<string[]>([]);

const emit = defineEmits(["applySearch"]);

const applyFilter = () => {
  searchedField.value = search.value
    .split(",")
    .filter((value) => value)
    .map((value) => value.trim());

  emit("applySearch", searchedField.value);
};

watch(search, () => {
  if (search.value === "") {
    searchedField.value = [];
    emit("applySearch", searchedField.value);
  }
});
</script>

<style scoped>
.search-area {
  margin-left: 20px;
  padding: 12px;
  width: 25vw;

  font-weight: bold;
  font-size: 15px;
  border-radius: 5px;
  border: 2px solid #b4b4b4;
}

@media only screen and (max-width: 1000px) {
  .search-area {
    margin-left: 5px;
    padding: 2px;
    font-weight: lighter;
    font-size: 14px;
  }
}
</style>