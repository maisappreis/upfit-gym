import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useApiStore = defineStore('api', () => {
  const isAuthenticated = ref(false)
  const apiURL = ref('')
  const currentPath = ref('')
  const tokenCSRF = ref('')

  const customers = ref([])
  const revenue = ref([])
  const expenses = ref([])

  const getPath = (path: string) => {
    currentPath.value = path
  }

  const checkAuthentication = async () => {
    axios.defaults.withCredentials = true

    if (currentPath.value === '/login' && tokenCSRF.value == null) {
      apiURL.value = `${import.meta.env.VITE_API_URL}`
    } else {
      if (tokenCSRF.value) {
        isAuthenticated.value = true
        apiURL.value = `${import.meta.env.VITE_API_URL}`
      } else {
        isAuthenticated.value = false
        apiURL.value = `${import.meta.env.VITE_API_URL}/test`
      }
    }
  }

  const getCSRFToken = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/accounts/get-csrf-token/`, { withCredentials: true });
    tokenCSRF.value = response.data.csrfToken !== undefined ? response.data.csrfToken : null;
  }

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${apiURL.value}/customer/`)
      customers.value = response.data
    } catch (error) {
      console.error('Erro ao requisitar a lista de clientes.', error)
    }
  }

  const fetchRevenue = async () => {
    try {
      const response = await axios.get(`${apiURL.value}/revenue/`)
      revenue.value = response.data
    } catch (error) {
      console.error('Erro ao requisitar a lista de receitas.', error)
    }
  }

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${apiURL.value}/expense/`)
      expenses.value = response.data
    } catch (error) {
      console.error('Erro ao requisitar a lista de despesas.', error)
    }
  }

  const getData = async () => {
    await fetchCustomers()
    await fetchRevenue()
    await fetchExpenses()
  }

  
  return {
    isAuthenticated,
    apiURL,
    checkAuthentication,
    getPath,
    getCSRFToken,
    tokenCSRF,
    getData,
    fetchCustomers,
    fetchRevenue,
    fetchExpenses,
    customers,
    revenue,
    expenses
  }
})
