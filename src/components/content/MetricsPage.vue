<template>
  <div class="content-area">
    <div class="chart-area">
      <RevenueExpensesChart
        class="chart-item"
        :monthlyRevenue="monthlyRevenueOrdered"
        :monthlyExpenses="monthlyExpensesOrdered"
      />
      <ActiveInactiveChart
        class="chart-item"
        :activeCustomers="activeCustomers"
        :inactiveCustomers="inactiveCustomers" />
    </div>
    <div
      class="chart-area"
      style="margin-top: 20px">
      <ActiveCustomersChart
        class="chart-item"/>
      <ProfitChart
        class="chart-item"
        :monthlyProfit="monthlyProfit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import RevenueExpensesChart from "../charts/RevenueExpensesChart.vue";
import ActiveInactiveChart from "../charts/ActiveInactiveChart.vue";
import ActiveCustomersChart from "../charts/ActiveCustomersChart.vue";
import ProfitChart from "../charts/ProfitChart.vue";
import { type SumPerMonth } from "@/types/chart";
import type { Revenue } from "@/types/revenue";
import type { Expense } from "@/types/expense";
import { useApiStore } from "@/stores/api";
import { useDateUtils } from "@/utils/dateUtils";

const apiStore = useApiStore();
const { sortDataByDate } = useDateUtils();

const monthlyRevenueOrdered = ref<SumPerMonth[]>([]);
const monthlyExpensesOrdered = ref<SumPerMonth[]>([]);
const monthlyProfit = ref<SumPerMonth[]>([]);
const activeCustomers = ref<number>(0);
const inactiveCustomers = ref<number>(0);

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

    monthlyRevenueOrdered.value = sortDataByDate(monthlyRevenue);
    monthlyExpensesOrdered.value = sortDataByDate(monthlyExpenses);

    calculateProfit();
  }
};

const countActiveAndInactiveCustomers = () => {
  if (apiStore.customers.length > 0) {
    const actives = apiStore.customers.filter(customer => customer.status === "Ativo");
    const inactives = apiStore.customers.filter(customer => customer.status === "Inativo");

    activeCustomers.value = actives.length;
    inactiveCustomers.value = inactives.length;
  }
};

watch(() => apiStore.expenses, () => {
  prepareDataForCalculation();
  countActiveAndInactiveCustomers();
});

onMounted(() => {
  prepareDataForCalculation();
  countActiveAndInactiveCustomers();
});
</script>

<style scoped>
.chart-area {
  display: flex;
  justify-content: space-around;
}

.chart-item {
  width: 50%;
}

@media only screen and (max-width: 1000px) {
  .chart-area {
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }
}
</style>