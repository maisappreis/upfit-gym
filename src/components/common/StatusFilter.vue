<template>
  <div class="filter-area">
    <select
      class="form-select font min-width"
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

<style scoped>
.filter-area {
  display: flex;
  font-size: 20px;
}

.font {
  font-size: 16px;
  margin-left: 15px;
}

.min-width {
  min-width: 140px;
}

@media only screen and (max-width: 1000px) {
  .font {
    font-size: 14px;
  }
}
</style>