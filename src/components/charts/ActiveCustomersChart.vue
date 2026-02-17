<template>
  <div class="chart-area">
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
import { Line as LineChart } from "vue-chartjs";
import { useApiStore } from "@/stores/api";
import type { Customer } from "@/types/customer";
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

const apiStore = useApiStore();

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

const customersMap = computed(() => {
  return new Map<number, Customer>(
    apiStore.customers.map((c) => [c.id, c])
  );
});

const activeCustomersPerMonth = computed(() => {
  const monthMap = new Map<string, { month: string; sum: number }>();

  apiStore.revenue.forEach((record) => {
    if (record.paid !== "Pago") return;

    const customer = customersMap.value.get(record.customer!);

    if (!customer || customer.status !== "Ativo") return;

    const key = `${record.year}-${record.month}`;
    const current = monthMap.get(key);

    if (!current) {
      monthMap.set(key, {
        month: record.month,
        sum: 1,
      });
    } else {
      current.sum += 1;
    }
  });

  return Array.from(monthMap.values());
});

const chartData = computed<ChartData<"line">>(() => {
  if (!activeCustomersPerMonth.value.length) {
    return {
      labels: [],
      datasets: [],
    };
  }

  return {
    labels: activeCustomersPerMonth.value.map((e) => e.month),
    datasets: [
      {
        label: "Clientes",
        backgroundColor: "blue",
        borderColor: "rgba(110, 93, 207, 0.8)",
        pointRadius: 4,
        data: activeCustomersPerMonth.value.map((e) => e.sum),
      },
    ],
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