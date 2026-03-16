import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/app/LoginView.vue")
    },
    {
      path: "/",
      component: () => import("@/app/LayoutView.vue"),
      children: [
        {
          path: "", redirect: "/metricas"
        },
        {
          path: "metricas",
          component: () => import("@/app/metrics/MetricsPage.vue"),
          meta: {
            icon: "fa-solid fa-chart-line",
            title: "Métricas",
            subtitle: "Visualização gráfica de receita, despesas, lucro e clientes",
            requiresAuth: true
          }
        },
        {
          path: "clientes",
          component: () => import("@/app/customer/CustomersPage.vue"),
          meta: {
            icon: "fa-solid fa-users",
            title: "Clientes",
            subtitle: "Cadastramento dos clientes",
            requiresAuth: true
          }
        },
        {
          path: "receitas",
          component: () => import("@/app/revenue/RevenuePage.vue"),
          meta: {
            icon: "fa-solid fa-hand-holding-dollar",
            title: "Receitas",
            subtitle: "Controle do recebimento das mensalidades dos clientes",
            requiresAuth: true
          }
        },
        {
          path: "despesas",
          component: () => import("@/app/expense/ExpensesPage.vue"),
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