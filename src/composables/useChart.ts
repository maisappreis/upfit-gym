import { computed } from "vue";
import { useApiStore } from "@/stores/api";
import { useDateUtils } from "@/utils/dateUtils";

import type { Revenue } from "@/types/revenue";
import type { Expense } from "@/types/expense";
import type { SumPerMonth } from "@/types/chart";

export function useChart() {
  const apiStore = useApiStore();
  const { sortDataByDate } = useDateUtils();

  const sumMonthlyAmounts = (
    data: (Revenue | Expense)[]
  ): SumPerMonth[] => {
    const map = new Map<string, SumPerMonth>();

    data.forEach((item) => {
      const key = `${item.year}-${item.month}`;

      if (!map.has(key)) {
        map.set(key, {
          year: item.year!,
          month: item.month,
          sum: 0,
        });
      }

      map.get(key)!.sum += item.value!;
    });

    return Array.from(map.values());
  };

  /* ---------- REVENUE / EXPENSES ---------- */

  const monthlyRevenueOrdered = computed<SumPerMonth[]>(() => {
    const paidRevenue = apiStore.revenue.filter(
      (e) => e.paid === "Pago"
    );

    return sortDataByDate(
      sumMonthlyAmounts(paidRevenue)
    );
  });

  const monthlyExpensesOrdered = computed<SumPerMonth[]>(() => {
    const paidExpenses = apiStore.expenses.filter(
      (e) => e.paid === "Pago"
    );

    return sortDataByDate(
      sumMonthlyAmounts(paidExpenses)
    );
  });

  /* ---------- PROFIT ---------- */

  const monthlyProfit = computed<SumPerMonth[]>(() => {
    const expenseMap = new Map(
      monthlyExpensesOrdered.value.map((e) => [
        `${e.year}-${e.month}`,
        e.sum,
      ])
    );

    return monthlyRevenueOrdered.value.map((revenueItem) => {
      const key = `${revenueItem.year}-${revenueItem.month}`;

      return {
        year: revenueItem.year,
        month: revenueItem.month,
        sum:
          revenueItem.sum -
          (expenseMap.get(key) ?? 0),
      };
    });
  });

  /* ---------- CUSTOMERS ---------- */

  const activeCustomers = computed(() => {
    return apiStore.customers.filter(
      (c) => c.status === "Ativo"
    ).length;
  });

  const inactiveCustomers = computed(() => {
    return apiStore.customers.filter(
      (c) => c.status === "Inativo"
    ).length;
  });

  return {
    monthlyRevenueOrdered,
    monthlyExpensesOrdered,
    monthlyProfit,
    activeCustomers,
    inactiveCustomers,
  };
};