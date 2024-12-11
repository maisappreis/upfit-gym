<template>
  <div class="chart-area">
    <LineChart
      v-if="chartData.datasets.length > 0"
      :data="chartData"
      :options="chartOptions"
      :style="myStyles"
    />
    <div v-else class="not-found">Sem dados para exibição do gráfico de Receitas x Despesas</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Line as LineChart } from "vue-chartjs"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend } from "chart.js";
import { type Data, type Options } from "@/types/chart";
import { type SumPerMonth } from "@/types/chart";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const props = defineProps<{
  monthlyRevenue: SumPerMonth[];
  monthlyExpenses: SumPerMonth[];
}>();

const chartData = ref<Data>({
  labels: [],
  datasets: []
});
const chartOptions = ref<Options>({
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
});

const myStyles = computed(() => {
  return {
    height: "100%",
    width: "85%",
    position: "relative"
  };
});

const drawChart = () => {
  if (props.monthlyRevenue.length > 0 && props.monthlyExpenses.length > 0) {
    let labels = props.monthlyRevenue.map((e) => e.month);
    let revenueData = props.monthlyRevenue.map((e) => e.sum);
    let expensesData = props.monthlyExpenses.map((e) => e.sum);

    chartData.value = {
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
  }
};

watch(() => props.monthlyRevenue, () => {
  drawChart();
});
</script>

<style scoped>
.chart-area {
  width: 100%;
  height: 50%;
  min-height: 200px;
}

@media only screen and (max-width: 1000px) {
  .chart-area {
    height: fit-content;
    min-height: 400px;
  }
}
</style>