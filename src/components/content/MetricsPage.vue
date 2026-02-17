<template>
  <div class="content-area center">
    <div class="chart-area">
      <RevenueExpensesChart class="chart-item"/>
      <ActiveInactiveChart class="chart-item"/>
    </div>

    <div class="chart-area mt">
      <ActiveCustomersChart class="chart-item" />
      <ProfitChart class="chart-item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import RevenueExpensesChart from "../charts/RevenueExpensesChart.vue";
import ActiveInactiveChart from "../charts/ActiveInactiveChart.vue";
import ActiveCustomersChart from "../charts/ActiveCustomersChart.vue";
import ProfitChart from "../charts/ProfitChart.vue";
</script>

<style scoped>
.center {
  justify-content: center;
}

.chart-area {
  display: flex;
  justify-content: space-around;
}

.chart-item {
  width: 50%;
}

@media only screen and (max-width: 1000px) {
  .chart-area {
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }
}
</style>