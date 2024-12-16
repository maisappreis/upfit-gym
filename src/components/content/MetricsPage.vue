<template>
  <div class="content-area">
    <RevenueExpensesChart
      :monthlyRevenue="monthlyRevenueOrdered"
      :monthlyExpenses="monthlyExpensesOrdered"
    />
    <div class="chart-area">
      <ActiveCustomersChart />
      <ProfitChart :monthlyProfit="monthlyProfit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import RevenueExpensesChart from "../charts/RevenueExpensesChart.vue";
import ActiveCustomersChart from "../charts/ActiveCustomersChart.vue";
import ProfitChart from "../charts/ProfitChart.vue";
import { type SumPerMonth } from "@/types/chart";
import type { Revenue } from "@/types/revenue";
import type { Expense } from "@/types/expense";
import { useApiStore } from "@/stores/api";
import { useUtils } from "@/utils/utils";

const apiStore = useApiStore();
const { sortData } = useUtils();

const monthlyRevenueOrdered = ref<SumPerMonth[]>([]);
const monthlyExpensesOrdered = ref<SumPerMonth[]>([]);
const monthlyProfit = ref<SumPerMonth[]>([]);

const sumMonthlyAmounts = (data: (Revenue | Expense)[]) => {
  const summedValuesMap = new Map();

  data.forEach((item) => {
    const key = `${item.year}-${item.month}`;

    if (!summedValuesMap.has(key)) {
      summedValuesMap.set(key, {
        year: item.year,
        month: item.month,
        sum: 0,
      });
    }
    summedValuesMap.get(key).sum += item.value;
  });
  return Array.from(summedValuesMap.values());
};

const calculateProfit = () => {
  const resultArray = [] as SumPerMonth[];

  monthlyRevenueOrdered.value.forEach((revenueItem) => {
    const expenseItem = monthlyExpensesOrdered.value.find(
      (expense) => expense.year === revenueItem.year && expense.month === revenueItem.month
    );

    const profit = {
      year: revenueItem.year,
      month: revenueItem.month,
      sum: revenueItem.sum - (expenseItem ? expenseItem.sum : 0),
    };

    resultArray.push(profit);
  });

  monthlyProfit.value = resultArray;
};

const prepareDataForCalculation = () => {
  if (apiStore.revenue.length > 0  || apiStore.expenses.length > 0) {
    let paidRevenue = apiStore.revenue.filter((e) => e.paid === 'Pago');
    let paidExpenses = apiStore.expenses.filter((e) => e.paid === 'Pago');

    let monthlyRevenue = sumMonthlyAmounts(paidRevenue);
    let monthlyExpenses = sumMonthlyAmounts(paidExpenses);

    monthlyRevenueOrdered.value = sortData(monthlyRevenue);
    monthlyExpensesOrdered.value = sortData(monthlyExpenses);

    calculateProfit();
  }
};

watch(() => apiStore.expenses, () => {
  prepareDataForCalculation();
});

onMounted(() => {
  prepareDataForCalculation();
});
</script>

<style scoped>
.chart-area {
  display: flex;
  justify-content: space-around;
}

@media only screen and (max-width: 1000px) {
  .chart-area {
    flex-direction: column;
    justify-content: center;
  }
}
</style>