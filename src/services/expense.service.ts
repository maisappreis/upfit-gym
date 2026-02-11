import axios from 'axios';
import type { Expense } from '@/types/expense';

export type CreateExpenseDTO = Omit<
  Expense,
  "id"
>;

export interface UpdateExpenseDTO extends Partial<CreateExpenseDTO> {}

export const expenseService = {
  async fetchAll(): Promise<Expense[]> {
    const { data } = await axios.get<Expense[]>('/expense/');
    return data;
  },

  async create(payload: CreateExpenseDTO): Promise<Expense> {
    const { data } = await axios.post<Expense>('/expense/create/', payload);
    return data;
  },

  async update(
    id: number,
    payload: UpdateExpenseDTO
  ): Promise<Expense> {
    const { data } = await axios.patch<Expense>(
      `/expense/${id}/`,
      payload
    );
    return data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`/expense/${id}/`);
  },
};