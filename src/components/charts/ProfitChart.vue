<template>
  <div class="chart-area">
    <Bar
      v-if="chartData.datasets.length > 0"
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
      :style="myStyles"
    />
    <div v-else class="not-found">Sem dados para exibição do gráfico de Lucros</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Bar } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend,
  BarElement, CategoryScale, LinearScale } from "chart.js";
import { type Data, type Options } from "@/types/chart";
import { type SumPerMonth } from "@/types/chart";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps<{
  monthlyProfit: SumPerMonth[];
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
    position: "relative"
  };
});

const drawChart = () => {
  if (props.monthlyProfit && props.monthlyProfit.length > 0) {
    let labels = props.monthlyProfit.map((e) => e.month);
    let data = props.monthlyProfit.map((e) => e.sum);

    chartData.value = {
      labels: labels,
      datasets: [
        {
          label: "Lucro",
          backgroundColor: "green",
          data: data
        }
      ]
    };
  }
};

watch(() => props.monthlyProfit, () => {
  drawChart();
});
</script>

<style scoped>
.chart-area {
  height: 50%;
  min-height: 200px;
}

@media only screen and (max-width: 1000px) {
  .chart-area {
    margin: 0 10px 0 0;
    height: fit-content;
  }
}
</style>