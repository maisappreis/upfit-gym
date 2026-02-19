<template>
  <div class="flex">
    <select
      class="form-select ml-input min-width-input"
      v-model="monthModel"
      name="month"
    >
      <option
        v-for="month in monthOptions"
        :key="month"
        :value="month"
      >
        {{ month }}
      </option>
    </select>

    <select
      class="form-select ml-input"
      v-model="yearModel"
      name="year"
    >
      <option
        v-for="year in yearOptions"
        :key="year"
        :value="year"
      >
        {{ year }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { months, years } from "@/utils/constants";

type MonthValue = string;
type YearValue = number | "Todos";

const props = defineProps<{
  modelValueMonth?: MonthValue;
  modelValueYear?: YearValue;
}>();

const emit = defineEmits<{
  (e: "update:modelValueMonth", value: MonthValue): void;
  (e: "update:modelValueYear", value: YearValue): void;
}>();

const monthOptions = computed<MonthValue[]>(() => [
  ...months,
  "Todos",
]);

const yearOptions = computed<YearValue[]>(() => [
  ...years,
  "Todos",
]);

const monthModel = computed<MonthValue>({
  get: () => props.modelValueMonth ?? "Todos",
  set: (value) => emit("update:modelValueMonth", value),
});

const yearModel = computed<YearValue>({
  get: () => props.modelValueYear ?? "Todos",
  set: (value) => emit("update:modelValueYear", value),
});

onMounted(() => {
  if (!props.modelValueMonth || !props.modelValueYear) {
    const currentDate = new Date();
    const currentMonth = months[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    emit("update:modelValueMonth", currentMonth);
    emit("update:modelValueYear", currentYear);
  }
});
</script>