<template>
  <div>
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
import { getCssVar } from "@/shared/utils/dataUtils";
import type { Chart } from "@/features/metrics/types/chart";
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

const props = defineProps<{
  data: Chart
}>();

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
        label: "Lucro",
        backgroundColor: getCssVar("--primary-color"),
        data: props.data.data,
      }
    ]
  };
});
</script>