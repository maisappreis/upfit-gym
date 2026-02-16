import { defineStore } from "pinia";
import { ref } from "vue";

export const PAGE_CONFIG = {
  metrics: {
    icon: "fa-solid fa-chart-line",
    title: "Métricas",
    subtitle: "Visualização gráfica de receita, despesas, lucro e clientes"
  },
  customers: {
    icon: "fa-solid fa-users",
    title: "Clientes",
    subtitle: "Cadastramento dos clientes"
  },
  revenue: {
    icon: "fa-solid fa-hand-holding-dollar",
    title: "Receitas",
    subtitle: "Controle do recebimento das mensalidades dos clientes"
  },
  expenses: {
    icon: "fa-solid fa-money-bill-transfer",
    title: "Despesas",
    subtitle: "Controle do pagamento das contas"
  },
} as const;

type PageName = keyof typeof PAGE_CONFIG;

export const usePageStore = defineStore("page", () => {
    const currentPage = ref<PageName>("metrics");

    const openPage = (page: "metrics" | "customers" | "revenue" | "expenses") => {
        currentPage.value = page;
    };

    return {
        currentPage,
        openPage,
    };
});