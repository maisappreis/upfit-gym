<template>
  <div class="chart-area">
    <Bar
      v-if="chartData.datasets.length > 0"
      :options="chartOptions"
      :data="chartData"
      :style="chartStyle"
    />
    <div v-else class="not-found">
      Sem dados para exibição do gráfico de Lucros
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useChart } from "@/composables/useChart";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartData,
  type ChartOptions,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const { monthlyProfit } = useChart();

const chartStyle = {
  height: "100%",
  position: "relative",
} as const;

const chartOptions: ChartOptions<"bar"> = {
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

const chartData = computed<ChartData<"bar">>(() => {
  if (!monthlyProfit.value) {
    return {
      labels: [],
      datasets: [],
    };
  }

  let labels = monthlyProfit.value.map((e) => e.month);
  let data = monthlyProfit.value.map((e) => e.sum);

  return {
    labels: labels,
    datasets: [
      {
        label: "Lucro",
        backgroundColor: "green",
        data: data
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