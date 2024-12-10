<template>
  <div>
    <MetricsPage v-if="pageStore.currentPage === 'metrics'" />
    <CustomersPage v-if="pageStore.currentPage === 'customers'" />
    <RevenuePage v-if="pageStore.currentPage === 'revenue'" />
    <ExpensesPage v-if="pageStore.currentPage === 'expenses'" />
  </div>
</template>

<script setup lang="ts">
import MetricsPage from "@/components/content/MetricsPage.vue";
import CustomersPage from "@/components/content/CustomersPage.vue";
import RevenuePage from "@/components/content/RevenuePage.vue";
import ExpensesPage from "@/components/content/ExpensesPage.vue";
import { usePageStore } from "@/stores/page";

const pageStore = usePageStore();
</script>
