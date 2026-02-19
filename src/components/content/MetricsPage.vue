<template>
  <div class="chart-area">
    <RevenueExpensesChart class="chart-item" />
    <ActiveInactiveChart class="chart-item" />
    <ActiveCustomersChart class="chart-item" />
    <ProfitChart class="chart-item" />
  </div>
</template>

<script setup lang="ts">
import RevenueExpensesChart from "../charts/RevenueExpensesChart.vue";
import ActiveInactiveChart from "../charts/ActiveInactiveChart.vue";
import ActiveCustomersChart from "../charts/ActiveCustomersChart.vue";
import ProfitChart from "../charts/ProfitChart.vue";
</script>

<style scoped>
.chart-area {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  height: calc(100vh - var(--header-height) - 40px);
  margin: var(--content-margin);
  box-sizing: border-box;
}

.chart-item {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: var(--box-shadow);

  overflow: hidden;

  display: flex;
  justify-content: center;
}

@media only screen and (max-width: 1000px) {
  .chart-area {
    grid-template-columns: 1fr;
    height: auto;
  }

  .chart-item {
    padding: 10px;
    height: 300px;
  }
}
</style>