<template>
  <div>
    <MetricsPage
      v-if="pageStore.currentPage === 'metrics'"
      :customers="customers"
      :revenue="revenue"
      :expenses="expenses"
      @updateData="getData"
    />
    <CustomersPage
      v-if="pageStore.currentPage === 'customers'"
      :customers="customers"
      :revenue="revenue"
      @updateData="getData"
    />
    <RevenuePage
      v-if="pageStore.currentPage === 'revenue'"
      :revenue="revenue"
      :customers="customers"
      @updateData="getData"
    />
    <ExpensesPage
      v-if="pageStore.currentPage === 'expenses'"
      :expenses="expenses"
      @updateData="getData"
    />
  </div>
</template>

<script>
import MetricsPage from './content/MetricsPage.vue'
import CustomersPage from './content/CustomersPage.vue'
import RevenuePage from './content/RevenuePage.vue'
import ExpensesPage from './content/ExpensesPage.vue'
import { mapStores } from 'pinia'
import { useApiStore } from '@/stores/api'
import { usePageStore } from '@/stores/page'
import axios from 'axios'

export default {
  name: 'ContentPage',

  components: {
    RevenuePage,
    ExpensesPage,
    MetricsPage,
    CustomersPage
  },

  data() {
    return {
      customers: [],
      revenue: [],
      expenses: []
    }
  },

  computed: {
    ...mapStores(useApiStore, usePageStore)
  },

  methods: {
    async getCustomers() {
      try {
        let response = await axios.get(`${this.apiStore.apiURL}/customer/`) // TODO: está chamando isso 4x, corrigir.
        this.customers = response.data
      } catch (error) {
        console.error('Erro ao requisitar a lista de clientes.', error)
      }
    },

    async getRevenue() {
      try {
        let response = await axios.get(`${this.apiStore.apiURL}/revenue/`)
        this.revenue = response.data
      } catch (error) {
        console.error('Erro ao requisitar a lista de receitas.', error)
      }
    },

    async getExpenses() {
      try {
        let response = await axios.get(`${this.apiStore.apiURL}/expense/`)
        this.expenses = response.data
      } catch (error) {
        console.error('Erro ao requisitar a lista de despesas.', error)
      }
    },

    getData() {
      this.getCustomers()
      this.getRevenue()
      this.getExpenses()
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
