<template>
  <div>
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
import { getCssVar } from "@/utils/dataUtils";
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
        backgroundColor: getCssVar("--primary-color"),
        borderColor: getCssVar("--primary-color"),
        pointRadius: 4,
        data: revenueData
      },
      {
        label: 'Despesas',
        backgroundColor: getCssVar("--red-darker"),
        borderColor: getCssVar("--red-darker"),
        pointRadius: 4,
        data: expensesData
      }
    ]
  };
});
</script>