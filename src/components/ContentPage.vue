<template>
    <div class="content">
      <MetricsPage v-if="selectedPage === 'metrics'" />
      <CustomersPage v-if="selectedPage === 'customers'" />
      <RevenuePage v-if="selectedPage === 'revenue'" />
      <ExpensesPage v-if="selectedPage === 'expenses'" />
    </div>
</template>

<script>
import MetricsPage from './content/MetricsPage.vue';
import CustomersPage from './content/CustomersPage.vue';
import RevenuePage from './content/RevenuePage.vue';
import ExpensesPage from './content/ExpensesPage.vue';


export default {
  name: 'ContentPage',
  components: {
    RevenuePage, ExpensesPage, MetricsPage, CustomersPage
  },
  props: {
    selectedPage: String
  }
}
</script>

<style scoped>

.content {
  position: fixed;
  top: 90px;
  left: 230px;

  width: 87vw;
  height: 83vh;
  background-color:var(--gray-light-color);
}
</style>