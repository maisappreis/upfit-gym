import { defineStore } from "pinia"
import { ref } from "vue"

import { revenueService } from '@/features/revenue/services/revenue.service';
import { type Revenue } from "@/features/revenue/types/revenue";

export const useRevenueStore = defineStore("revenue", () => {
  const revenue = ref<Revenue[]>([]);

  const fetchRevenue = async () => {
    try {
      revenue.value = await revenueService.fetchAll();
    } catch (error) {
      console.error('Erro ao requisitar receitas.', error);
    }
  };

  return {
    revenue,
    fetchRevenue
  };
});