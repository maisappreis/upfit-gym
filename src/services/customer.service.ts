import axios from 'axios';
import type { Customer } from '@/types/customer';

export type CreateCustomerDTO = Omit<
  Customer,
  "id"
>;

export interface UpdateCustomerDTO extends Partial<CreateCustomerDTO> {}

export const customerService = {
  async fetchAll(): Promise<Customer[]> {
    const { data } = await axios.get<Customer[]>('/customer/');
    return data;
  },

  async create(payload: CreateCustomerDTO): Promise<Customer> {
    const { data } = await axios.post<Customer>('/customer/create/', payload);
    return data;
  },

  async update(
    id: number,
    payload: UpdateCustomerDTO
  ): Promise<Customer> {
    const { data } = await axios.patch<Customer>(
      `/customer/${id}/`,
      payload
    );
    return data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`/customer/${id}/`);
  },

  async inactivate(id: number): Promise<Customer> {
    const { data } = await axios.patch<Customer>(
      `/customer/${id}/`,
      { status: 'Inativo' }
    );
    return data;
  }
};
