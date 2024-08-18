<template>
  <div>
    <MetricsPage v-if="pageStore.currentPage === 'metrics'" />
    <CustomersPage v-if="pageStore.currentPage === 'customers'" />
    <RevenuePage v-if="pageStore.currentPage === 'revenue'" />
    <ExpensesPage v-if="pageStore.currentPage === 'expenses'" />
  </div>
</template>

<script>
import MetricsPage from './content/MetricsPage.vue'
import CustomersPage from './content/CustomersPage.vue'
import RevenuePage from './content/RevenuePage.vue'
import ExpensesPage from './content/ExpensesPage.vue'
import { mapStores } from 'pinia'
import { usePageStore } from '@/stores/page'

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
