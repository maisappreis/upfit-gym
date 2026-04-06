import { defineStore } from "pinia"
import { ref } from "vue"

import { expenseService } from '@/features/expense/services/expense.service';
import { type Expense } from "@/features/expense/types/expense";

export const useExpenseStore = defineStore("expense", () => {
  const expenses = ref<Expense[]>([]);

  const fetchExpenses = async () => {
    try {
      expenses.value = await expenseService.fetchAll();
    } catch (error) {
      console.error('Erro ao requisitar despesas.', error);
    }
  };

  return {
    expenses,
    fetchExpenses,
  };
});