import { defineStore } from "pinia"
import { ref } from "vue"

import { customerService } from '@/services/customer.service';
import { revenueService } from '@/services/revenue.service';
import { expenseService } from '@/services/expense.service';

import { type Customer } from "@/types/customer";
import { type Revenue } from "@/types/revenue";
import { type Expense } from "@/types/expense";

export const useApiStore = defineStore("api", () => {

  const customers = ref<Customer[]>([]);
  const revenue = ref<Revenue[]>([]);
  const expenses = ref<Expense[]>([]);

  const fetchCustomers = async () => {
    try {
      customers.value = await customerService.fetchAll();

      customers.value = customers.value.sort((a, b) =>
        a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
      );
    } catch (error) {
      console.error('Erro ao requisitar clientes.', error);
    }
  };

  const fetchRevenue = async () => {
    try {
      revenue.value = await revenueService.fetchAll();
    } catch (error) {
      console.error('Erro ao requisitar receitas.', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      expenses.value = await expenseService.fetchAll();
    } catch (error) {
      console.error('Erro ao requisitar despesas.', error);
    }
  };

  const fetchData = async () => {
    await Promise.all([
      fetchCustomers(),
      fetchRevenue(),
      fetchExpenses(),
    ]);
  };

  const canDeleteCustomer = (customerId: number): boolean => {
    return !revenue.value.some(
      (item) => item.customer === customerId
    );
  };

  return {
    customers,
    revenue,
    expenses,

    fetchCustomers,
    fetchRevenue,
    fetchExpenses,
    fetchData,

    canDeleteCustomer,
  };
});
