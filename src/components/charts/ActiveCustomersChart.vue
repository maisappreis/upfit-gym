<template>
  <div>
    <LineChart
      v-if="chartData.datasets.length > 0"
      :options="chartOptions"
      :data="chartData"
      :style="chartStyle"
    />
    <div v-else class="not-found">
      Sem dados para exibição do gráfico de Clientes Ativos
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getCssVar } from "@/utils/dataUtils";
import type { Chart } from "@/types/chart";
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

const props = defineProps<{
  data: Chart
}>();

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
          size: 20,
        },
      },
    },
    tooltip: {
      enabled: true,
      bodySpacing: 5,
      padding: 15,
      displayColors: false,
      titleFont: {
        size: 18,
      },
      bodyFont: {
        size: 15,
      },
    },
  },
};

const chartData = computed<ChartData<"line">>(() => {
  if (!props.data.labels.length) {
    return {
      labels: [],
      datasets: [],
    };
  }

  return {
    labels: props.data.labels,
    datasets: [
      {
        label: "Clientes",
        backgroundColor: getCssVar("--primary-color"),
        borderColor: getCssVar("--primary-color"),
        pointRadius: 4,
        data: props.data.data
      },
    ],
  };
});
</script>