import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "axios";
import { type Customer } from "@/types/customer";
import { type Revenue } from "@/types/revenue";
import { type Expense } from "@/types/expense";

export const useApiStore = defineStore("api", () => {
  const apiBase = ref(import.meta.env.VITE_API_BASE);
  const apiURL = ref<string>(`${apiBase.value}/upfit/test`);

  const customers = ref<Customer[]>([]);
  const revenue = ref<Revenue[]>([]);
  const expenses = ref<Expense[]>([]);

  const setApiURL = (url: string) => {
    apiURL.value = url;
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${apiURL.value}/customer/`);
      customers.value = response.data;
    } catch (error) {
      console.error("Erro ao requisitar a lista de clientes.", error);
    }
  };

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

  const configureAxios = () => {
    axios.defaults.headers.common["Content-Type"] = "application/json";

    axios.interceptors.request.use(
      (config) => {
        axios.defaults.baseURL = apiURL.value;
        
        const token = localStorage.getItem("accessToken")
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
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem("refreshToken");
    
          if (refreshToken) {
            try {
              const response = await axios.post("/token/refresh/", { refresh: refreshToken });
              const { access } = response.data;
              localStorage.setItem("accessToken", access);
              axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
              return axios(originalRequest);
            } catch (refreshError) {
                console.error(refreshError);
            }
          }
        }
        return Promise.reject(error);
      }
    );
  };

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
    expenses,
    configureAxios
  };
});
