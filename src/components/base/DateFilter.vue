<template>
  <div class="filter-area">
    <select
      class="form-select font month"
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
      class="form-select font year"
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
import { months, years } from "@/utils/variables";

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

<style scoped>
.filter-area {
  display: flex;
  font-size: 20px;
}

.font {
  font-size: 16px;
  margin-left: 15px;
}

.month {
  min-width: 100px;
}

.year {
  max-width: 80px;
}

@media only screen and (max-width: 1000px) {
  .font {
    font-size: 14px;
    margin-left: 5px;
  }

  .month {
    min-width: 80px;
  }

  .year {
    max-width: 80px;
  }
}
</style>