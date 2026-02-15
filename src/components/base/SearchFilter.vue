<template>
  <input
    class="search-area"
    type="text"
    :placeholder="placeholder"
    v-model="searchModel"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string[];
    placeholder?: string;
  }>(),
  {
    placeholder: "Pesquisar...",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

const searchModel = computed({
  get: () => (props.modelValue ?? []).join(", "),
  set: (value: string) => {
    const parsed = value
      .split(",")
      .map(v => v.trim())
      .filter(Boolean);

    emit("update:modelValue", parsed);
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