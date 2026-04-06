import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/features/auth/stores/auth";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/features/auth/components/LoginView.vue")
    },
    {
      path: "/",
      component: () => import("@/shared/components/layout/LayoutView.vue"),
      children: [
        {
          path: "", redirect: "/metricas"
        },
        {
          path: "metricas",
          component: () => import("@/features/metrics/components/MetricsPage.vue"),
          meta: {
            icon: "fa-solid fa-chart-line",
            title: "Métricas",
            subtitle: "Visualização gráfica de receita, despesas, lucro e clientes",
            requiresAuth: true
          }
        },
        {
          path: "clientes",
          component: () => import("@/features/customer/components/CustomersPage.vue"),
          meta: {
            icon: "fa-solid fa-users",
            title: "Clientes",
            subtitle: "Cadastramento dos clientes",
            requiresAuth: true
          }
        },
        {
          path: "receitas",
          component: () => import("@/features/revenue/components/RevenuePage.vue"),
          meta: {
            icon: "fa-solid fa-hand-holding-dollar",
            title: "Receitas",
            subtitle: "Controle do recebimento das mensalidades dos clientes",
            requiresAuth: true
          }
        },
        {
          path: "despesas",
          component: () => import("@/features/expense/components/ExpensesPage.vue"),
          meta: {
            icon: "fa-solid fa-money-bill-transfer",
            title: "Despesas",
            subtitle: "Controle do pagamento das contas",
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/login"
    },
  ]
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth &&
    !authStore.isAuthenticated
  ) {
    return "/login";
  }
});

export default router;