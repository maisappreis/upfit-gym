<template>
  <div>
    <MetricsPage
      v-if="selectedPage === 'metrics'"
      :customers="customers"
      :revenue="revenue"
      :expenses="expenses"
      @updateData="getData"
    />
    <CustomersPage
      v-if="selectedPage === 'customers'"
      :customers="customers"
      :revenue="revenue"
      :selectedPage="selectedPage"
      @updateData="getData"
    />
    <RevenuePage
      v-if="selectedPage === 'revenue'"
      :revenue="revenue"
      :customers="customers"
      :selectedPage="selectedPage"
      @updateData="getData"
    />
    <ExpensesPage
      v-if="selectedPage === 'expenses'"
      :expenses="expenses"
      :selectedPage="selectedPage"
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

  props: {
    selectedPage: String
  },

  computed: {
    ...mapStores(useApiStore)
  },

  methods: {
    async getCustomers() {
      try {
        let response = await axios.get(`${this.apiStore.apiURL}/customer/`)
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
