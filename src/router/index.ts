import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/components/views/LoginView.vue")
    },
    {
      path: "/",
      component: () => import("@/components/views/LayoutView.vue"),
      children: [
        {
          path: "", redirect: "/metricas"
        },
        {
          path: "metricas",
          component: () => import("@/components/content/MetricsPage.vue"),
          meta: {
            icon: "fa-solid fa-chart-line",
            title: "Métricas",
            subtitle: "Visualização gráfica de receita, despesas, lucro e clientes"
          }
        },
        {
          path: "clientes",
          component: () => import("@/components/content/CustomersPage.vue"),
          meta: {
            icon: "fa-solid fa-users",
            title: "Clientes",
            subtitle: "Cadastramento dos clientes"
          }
        },
        {
          path: "receitas",
          component: () => import("@/components/content/RevenuePage.vue"),
          meta: {
            icon: "fa-solid fa-hand-holding-dollar",
            title: "Receitas",
            subtitle: "Controle do recebimento das mensalidades dos clientes"
          }
        },
        {
          path: "despesas",
          component: () => import("@/components/content/ExpensesPage.vue"),
          meta: {
            icon: "fa-solid fa-money-bill-transfer",
            title: "Despesas",
            subtitle: "Controle do pagamento das contas"
          }
        }
      ]
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/"
    },
  ]
});

export default router;