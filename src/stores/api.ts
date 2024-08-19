import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useApiStore = defineStore('api', () => {
  const isAuthenticated = ref(false)
  const apiBase = ref(`${import.meta.env.VITE_API_URL}`)
  const apiURL = ref('')
  const tokenCSRF = ref('')

  const customers = ref([])
  const revenue = ref([])
  const expenses = ref([])

  const checkAuthentication = async () => {
    axios.defaults.withCredentials = true
    const tokenLogin = localStorage.getItem('authTokenLogin');

    if (tokenCSRF.value && tokenLogin) {
      isAuthenticated.value = true
      apiURL.value = apiBase.value
    } else {
      isAuthenticated.value = false
      apiURL.value = `${apiBase.value}/test`
    }
  }

  const getCSRFToken = async () => {
    const response = await axios.get(`${apiBase.value}/accounts/get-csrf-token/`, { withCredentials: true });
    tokenCSRF.value = response.data.csrfToken !== undefined ? response.data.csrfToken : null;
  }

  const clearAuthData = () => {
    localStorage.removeItem('authTokenLogin')
    tokenCSRF.value = ''
    location.reload()
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

  const fetchData = async () => {
    await fetchCustomers()
    await fetchRevenue()
    await fetchExpenses()
  }

  
  return {
    isAuthenticated,
    apiBase,
    apiURL,
    checkAuthentication,
    getCSRFToken,
    clearAuthData,
    tokenCSRF,
    fetchData,
    fetchCustomers,
    fetchRevenue,
    fetchExpenses,
    customers,
    revenue,
    expenses
  }
})
