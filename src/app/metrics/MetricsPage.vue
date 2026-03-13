<template>
  <div class="chart-area">
    <RevenueExpensesChart class="chart-item" :data="chartData.revenue_versus_expense" />
    <ActiveInactiveChart class="chart-item" :data="chartData.active_inactive_customers" />
    <ActiveCustomersChart class="chart-item" :data="chartData.number_of_active_customer_per_month" />
    <ProfitChart class="chart-item" :data="chartData.monthly_profit" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import RevenueExpensesChart from "@/app/metrics/charts/RevenueExpensesChart.vue";
import ActiveInactiveChart from "@/app/metrics/charts/ActiveInactiveChart.vue";
import ActiveCustomersChart from "@/app/metrics/charts/ActiveCustomersChart.vue";
import ProfitChart from "@/app/metrics/charts/ProfitChart.vue";
import { dashboardService } from "@/services/dashboard.service";
import type { Dashboard } from "@/types/chart";

const chartData = ref<Dashboard>({
  active_inactive_customers: {
    labels: [],
    data: []
  },
  number_of_active_customer_per_month: {
    labels: [],
    data: []
  },
  monthly_profit: {
    labels: [],
    data: []
  },
  revenue_versus_expense: {
    labels: [],
    data: {
      revenue: [],
      expense: []
    }
  }
});

const fetchChartData = async () => {
  try {
    chartData.value = await dashboardService.list();
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard");
  }
};

onMounted(async() => {
  await fetchChartData();
});
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