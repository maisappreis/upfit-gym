<template>
  <input
    class="form-input ml-input search-area"
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
  width: 25vw;
}

@media only screen and (max-width: 1000px) {
  .search-area {
    width: 20vw;
  }
}
</style>