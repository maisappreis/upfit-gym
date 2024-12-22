<template>
  <div class="chart-area">
    <LineChart
      v-if="chartData.datasets.length > 0"
      :data="chartData"
      :options="chartOptions"
      :style="myStyles"
    />
    <div v-else class="not-found">
      Sem dados para exibição do gráfico de Clientes Ativos
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { Line as LineChart } from "vue-chartjs";
import { Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useApiStore } from "@/stores/api";
import { type Data, type Options } from "@/types/chart";
import { type Customer } from "@/types/customer";
import { type SumPerMonth } from "@/types/chart";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const apiStore = useApiStore();

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

const calculateActiveCustomersPerMonth = (): SumPerMonth[] => {
  const activeCustomersPerMonth = [] as SumPerMonth[];

  apiStore.revenue.forEach((revenueRecord) => {
    if (revenueRecord.paid === "Pago") {
      const year = revenueRecord.year;
      const month = revenueRecord.month;
      const customerId = revenueRecord.customer;
      const customer = apiStore.customers.find((c) => c.id === customerId) as Customer;

      if (customer && customer.status === "Ativo") {
        const existingEntryIndex = activeCustomersPerMonth.findIndex(
          (entry) => entry.year === year && entry.month === month
        );

        if (existingEntryIndex === -1) {
          activeCustomersPerMonth.push({
            year,
            month,
            sum: 1
          });
        } else {
          activeCustomersPerMonth[existingEntryIndex].sum++;
        }
      }
    }
  })

  return activeCustomersPerMonth;
};

const drawChart = () => {
  let activeCustomers = [] as SumPerMonth[];
  if (
    apiStore.revenue &&
    apiStore.revenue.length > 0 &&
    apiStore.customers &&
    apiStore.customers.length > 0
  ) {
    activeCustomers = calculateActiveCustomersPerMonth();
  }

  if (activeCustomers && activeCustomers.length > 0) {
    let labels = activeCustomers.map((e) => e.month);
    let data = activeCustomers.map((e) => e.sum);

    chartData.value = {
      labels: labels,
      datasets: [
        {
          label: "Clientes",
          backgroundColor: "blue",
          borderColor: "rgba(110, 93, 207, 0.8)",
          pointRadius: 4,
          data: data
        }
      ]
    };
  }
};

watch(() => apiStore.revenue, () => {
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