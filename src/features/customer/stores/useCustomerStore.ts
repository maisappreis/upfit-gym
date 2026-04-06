import { defineStore } from "pinia"
import { ref } from "vue"

import { customerService } from '@/features/customer/services/customer.service';
import { type Customer } from "@/features/customer/types/customer";

export const useCustomerStore = defineStore("customer", () => {
  const customers = ref<Customer[]>([]);

  const fetchCustomers = async () => {
    try {
      customers.value = await customerService.fetchAll();

      customers.value = customers.value.sort((a, b) =>
        a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
      );
    } catch (error) {
      console.error('Erro ao requisitar clientes.', error);
    }
  };

  return {
    customers,
    fetchCustomers,
  };
});