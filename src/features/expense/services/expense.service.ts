import { crudService } from "../../../shared/services/baseCrud.service";
import type {
  Expense,
  CreateExpenseDTO,
  UpdateExpenseDTO
} from "@/features/expense/types/expense";

export const expenseService = crudService<
  Expense,
  CreateExpenseDTO,
  UpdateExpenseDTO
>("expense");