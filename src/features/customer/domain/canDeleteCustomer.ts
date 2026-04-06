import { useRevenueStore } from "@/features/revenue/stores/useRevenueStore";

const revenueStore = useRevenueStore();

export function canDeleteCustomer(
  customerId: number,
): boolean {
  return !revenueStore.revenue.some(
    (item) => item.customer === customerId
  );
}