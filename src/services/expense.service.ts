import type { Expense } from "@/types/expense";
import { crudService } from "./baseCrud.service";

export type CreateExpenseDTO = Omit<Expense, "id">;
export type UpdateExpenseDTO = Partial<CreateExpenseDTO>;

export const expenseService = crudService<
  Expense,
  CreateExpenseDTO,
  UpdateExpenseDTO
>("expense");