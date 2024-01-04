<template>
    <div>
      <MetricsPage v-if="selectedPage === 'metrics'" />
      <RevenuePage v-if="selectedPage === 'revenue'" />
      <ExpensesPage v-if="selectedPage === 'expenses'" />
    </div>
</template>

<script>
import MetricsPage from './content/MetricsPage.vue';
import RevenuePage from './content/RevenuePage.vue';
import ExpensesPage from './content/ExpensesPage.vue';


export default {
  name: 'ContentPage',
  components: {
    RevenuePage, ExpensesPage, MetricsPage
  },
  props: {
    selectedPage: String
  }
}
</script>

<style scoped>
</style>