<template>
  <div class="flex">
    <select
      class="form-select ml-input"
      v-model="model"
      name="status"
    >
      <option
        v-for="status in options"
        :key="status"
        :value="status"
      >
        {{ status }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";

const props = defineProps<{
    modelValue?: string;
    options: string[];
    defaultValue: string;
  }>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const model = computed({
  get: () => props.modelValue ?? props.defaultValue,
  set: (value: string) => emit("update:modelValue", value),
});

onMounted(() => {
  if (!props.modelValue) {
    emit("update:modelValue", props.defaultValue);
  }
});
</script>