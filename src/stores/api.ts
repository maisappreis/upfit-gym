import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '../axiosConfig';

export const useApiStore = defineStore('api', () => {
  // const apiBase = ref(`${import.meta.env.VITE_API_URL}`)
  const apiBase = ref('https://django-apis-two.vercel.app/api/upfit')
  const apiURL = ref('')

  const customers = ref([])
  const revenue = ref([])
  const expenses = ref([])

  const setApiURL = (url) => {
    apiURL.value = url
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
    setApiURL,
    apiBase,
    apiURL,
    fetchData,
    fetchCustomers,
    fetchRevenue,
    fetchExpenses,
    customers,
    revenue,
    expenses
  }
})
