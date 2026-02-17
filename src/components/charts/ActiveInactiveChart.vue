<template>
  <div class="chart-area">
    <PieChart
      v-if="chartData.datasets.length > 0"
      :options="chartOptions"
      :data="chartData"
      :style="chartStyle"
    />
    <div v-else class="not-found">
      Sem dados para exibição do gráfico de clientes Ativos x Inativos
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useChart } from "@/composables/useChart";
import { Pie as PieChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const {
  activeCustomers,
  inactiveCustomers,
} = useChart();

const chartStyle = {
  height: "100%",
  position: "relative",
} as const;

const chartOptions: ChartOptions<"pie"> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "gray",
        font: {
          size: 16
        },
        boxHeight: 0,
        boxWidth: 0
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

const chartData = computed<ChartData<"pie">>(() => {
  if (!activeCustomers.value || !inactiveCustomers.value) {
    return {
      labels: [],
      datasets: [],
    };
  }

  return {
    labels: ["Ativos", "Inativos"],
    datasets: [
      {
        label: "Clientes",
        data: [activeCustomers.value, inactiveCustomers.value],
        backgroundColor: ["green", "red"]
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