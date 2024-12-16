<template>
  <div class="filter-area">
    <select
      class="form-select font month"
      id="month"
      name="month"
      v-model="month"
      @change="$emit('get-month', month)"
      required
    >
      <option v-for="(month, index) in months" :key="index" :value="month">
        {{ month }}
      </option>
    </select>
    <select
      class="form-select font year"
      id="year"
      name="year"
      v-model="year"
      @change="$emit('get-year', year)"
      required
    >
      <option v-for="(year, index) in years" :key="index" :value="year">
        {{ year }}
      </option>
    </select>
    <select
      class="form-select font min-width"
      id="status"
      name="status"
      v-model="paymentStatus"
      @change="$emit('get-status', paymentStatus)"
      required
    >
      <option disabled selected value="Todos">Status:</option>
      <option v-for="(status, index) in statusList" :key="index" :value="status">
        {{ status }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { months, years } from "@/utils/variablesTs";

const month = ref<string>("");
const year = ref<number>(0);
const paymentStatus = ref<string>("");

const emit = defineEmits(["get-month", "get-year", "get-status"]);

defineProps({
  statusList: Array
});

const getDate = () => {
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  year.value = currentDate.getFullYear();
  month.value = months[currentMonth];

  emit("get-month", month.value);
  emit("get-year", year.value);
};

const getStatus = () => {
  paymentStatus.value = "Todos";

  emit("get-status", paymentStatus.value);
};

onMounted(() => {
  getDate();
  getStatus();
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

.min-width {
  min-width: 140px;
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

  .min-width {
    min-width: 80px;
  }
}
</style>