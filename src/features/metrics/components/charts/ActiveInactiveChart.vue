<template>
  <div>
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
import { getCssVar } from "@/shared/utils/dataUtils";
import type { Chart } from "@/features/metrics/types/chart";
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

const props = defineProps<{
  data: Chart
}>();

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
        data: props.data.data,
        backgroundColor: [
          getCssVar("--primary-color"),
          getCssVar("--red-darker"),
        ]
      }
    ]
  };
});
</script>