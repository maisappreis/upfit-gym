import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "axios";

import { type Customer } from "@/types/customer";
import { type Revenue } from "@/types/revenue";
import { type Expense } from "@/types/expense";

import { customerService } from '@/services/customer.service';
// import { revenueService } from '@/services/revenue.service';
// import { expenseService } from '@/services/expense.service';

export const useApiStore = defineStore("api", () => {

  // 🌐 API CONFIG
  const apiBase = ref(import.meta.env.VITE_API_BASE);
  const apiURL = ref<string>(`${apiBase.value}/upfit/test`);
  const isConfigured = ref(false);

  // 📦 STATE
  const customers = ref<Customer[]>([]);
  const revenue = ref<Revenue[]>([]);
  const expenses = ref<Expense[]>([]);

  // 🔁 API URL
  const setApiURL = (url: string) => {
    apiURL.value = url;
    axios.defaults.baseURL = url;
  };

  // 📡 FETCH ACTIONS
  const fetchCustomers = async () => {
    try {
      customers.value = await customerService.fetchAll();
    } catch (error) {
      console.error('Erro ao requisitar clientes.', error);
    }
  };

  // const fetchRevenue = async () => {
  //   try {
  //     revenue.value = await revenueService.fetchAll();
  //   } catch (error) {
  //     console.error('Erro ao requisitar receitas.', error);
  //   }
  // };

  // const fetchExpenses = async () => {
  //   try {
  //     expenses.value = await expenseService.fetchAll();
  //   } catch (error) {
  //     console.error('Erro ao requisitar despesas.', error);
  //   }
  // };

  // const fetchData = async () => {
  //   await Promise.all([
  //     fetchCustomers(),
  //     fetchRevenue(),
  //     fetchExpenses(),
  //   ]);
  // };

  const fetchRevenue = async () => {
    try {
      const response = await axios.get(`${apiURL.value}/revenue/`);
      revenue.value = response.data;
    } catch (error) {
      console.error("Erro ao requisitar a lista de receitas.", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${apiURL.value}/expense/`);
      expenses.value = response.data;
    } catch (error) {
      console.error("Erro ao requisitar a lista de despesas.", error);
    }
  };

  const fetchData = async () => {
    await fetchCustomers();
    await fetchRevenue();
    await fetchExpenses();
  };

   // 🧠 DOMAIN LOGIC
  const canDeleteCustomer = (customerId: number): boolean => {
    return !revenue.value.some(
      (item) => item.customer === customerId
    );
  };

  // 🔧 AXIOS CONFIG
  const configureAxios = () => {
    if (isConfigured.value) return;

    axios.defaults.baseURL = apiURL.value;
    axios.defaults.headers.common["Content-Type"] = "application/json";

    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) return Promise.reject(error);

          try {
            const { data } = await axios.post("/token/refresh/", {
              refresh: refreshToken,
            });

            localStorage.setItem("accessToken", data.access);
            axios.defaults.headers.common.Authorization = `Bearer ${data.access}`;

            return axios(originalRequest);
          } catch (refreshError) {
            console.error("Erro ao renovar token", refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    isConfigured.value = true;
  };

  return {
    // config
    apiBase,
    apiURL,
    setApiURL,
    configureAxios,

    // state
    customers,
    revenue,
    expenses,

    // actions
    fetchCustomers,
    fetchRevenue,
    fetchExpenses,
    fetchData,

    // domain helpers
    canDeleteCustomer,
  };
});
