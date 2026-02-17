<template>
  <div class="chart-area">
    <LineChart
      v-if="chartData.datasets.length > 0"
      :options="chartOptions"
      :data="chartData"
      :style="chartStyle"
    />
    <div v-else class="not-found">
      Sem dados para exibição do gráfico de Receitas x Despesas
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useChart } from "@/composables/useChart";
import { Line as LineChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const {
  monthlyRevenueOrdered,
  monthlyExpensesOrdered,
} = useChart();

const chartStyle = {
  height: "100%",
  position: "relative",
} as const;

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "gray",
        boxHeight: 15,
        boxWidth: 15,
        font: {
          size: 20
        }
      }
    },
    tooltip: {
      enabled: true,
      bodySpacing: 5,
      padding: 15,
      displayColors: false,
      titleFont: {
        size: 18
      },
      bodyFont: {
        size: 15
      }
    }
  }
};

const chartData = computed<ChartData<"line">>(() => {
  if (!monthlyRevenueOrdered.value.length || !monthlyExpensesOrdered.value.length) {
    return {
      labels: [],
      datasets: [],
    };
  }

  let labels = monthlyRevenueOrdered.value.map((e) => e.month);
  let revenueData = monthlyRevenueOrdered.value.map((e) => e.sum);
  let expensesData = monthlyExpensesOrdered.value.map((e) => e.sum);

  return {
    labels: labels,
    datasets: [
      {
        label: 'Receita',
        backgroundColor: 'green',
        borderColor: 'rgba(64, 163, 79, 0.8)',
        pointRadius: 4,
        data: revenueData
      },
      {
        label: 'Despesas',
        backgroundColor: 'red',
        pointRadius: 4,
        borderColor: 'rgba(168, 59, 68, 0.8)',
        data: expensesData
      }
    ]
  };
});
</script>

<style scoped>
.chart-area {
  height: 50%;
  min-height: 230px;
}

@media only screen and (max-width: 1000px) {
  .chart-area {
    height: 250px;
  }
}
</style>