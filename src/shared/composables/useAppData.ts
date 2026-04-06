import { useCustomerStore } from "@/features/customer/stores/useCustomerStore";
import { useRevenueStore } from "@/features/revenue/stores/useRevenueStore";
import { useExpenseStore } from "@/features/expense/stores/useExpenseStore";

export function useAppData() {
  const customerStore = useCustomerStore();
  const revenueStore = useRevenueStore();
  const expenseStore = useExpenseStore();

  const fetchData = async () => {
    await Promise.all([
      customerStore.fetchCustomers(),
      revenueStore.fetchRevenue(),
      expenseStore.fetchExpenses(),
    ]);
  };

  return { fetchData };
};