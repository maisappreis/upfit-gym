import { crudService } from "./baseCrud.service";
import type {
  Expense,
  CreateExpenseDTO,
  UpdateExpenseDTO
} from "@/types/expense";

export const expenseService = crudService<
  Expense,
  CreateExpenseDTO,
  UpdateExpenseDTO
>("expense");