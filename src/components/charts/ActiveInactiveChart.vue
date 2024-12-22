<template>
  <div class="chart-area">
    <PieChart
      v-if="chartData.datasets.length > 0"
      :data="chartData"
      :options="chartOptions"
      :style="myStyles"
    />
    <div v-else class="not-found">
      Sem dados para exibição do gráfico de clientes Ativos x Inativos
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { Pie as PieChart } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { type Data, type Options } from "@/types/chart";

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
  activeCustomers: number;
  inactiveCustomers: number;
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
});

const myStyles = computed(() => {
  return {
    height: "100%",
    position: "relative"
  };
});

const drawChart = () => {
  if (props.activeCustomers > 0 || props.inactiveCustomers > 0) {
    chartData.value = {
      labels: ["Ativos", "Inativos"],
      datasets: [
        {
          label: "Clientes",
          data: [props.activeCustomers, props.inactiveCustomers],
          backgroundColor: ["green", "red"]
        }
      ]
    };
  }
};

watch(() => props.activeCustomers, () => {
  drawChart();
});

onMounted(() => {
  drawChart();
});
</script>

<style scoped>
.chart-area {
  height: 50%;
  min-height: 250px;
}

@media only screen and (max-width: 1000px) {
  .chart-area {
    height: 250px;
  }
}
</style>