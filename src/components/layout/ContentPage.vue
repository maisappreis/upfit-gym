<template>
  <div>
    <MetricsPage v-if="pageStore.currentPage === 'metrics'" />
    <CustomersPage v-if="pageStore.currentPage === 'customers'" />
    <RevenuePage v-if="pageStore.currentPage === 'revenue'" />
    <ExpensesPage v-if="pageStore.currentPage === 'expenses'" />
  </div>
</template>

<script>
import MetricsPage from "@/components/content/MetricsPage.vue";
import CustomersPage from "@/components/content/CustomersPage.vue";
import RevenuePage from "@/components/content/RevenuePage.vue";
import ExpensesPage from "@/components/content/ExpensesPage.vue";
import { mapStores } from "pinia";
import { usePageStore } from "@/stores/page";

export default {
  name: 'ContentPage',

  components: {
    RevenuePage,
    ExpensesPage,
    MetricsPage,
    CustomersPage
  },

  computed: {
    ...mapStores(usePageStore)
  }
}
</script>
