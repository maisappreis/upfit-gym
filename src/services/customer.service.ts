import type { Customer } from "@/types/customer";
import { crudService } from "./baseCrud.service";

export type CreateCustomerDTO = Omit<Customer, "id">;
export type UpdateCustomerDTO = Partial<CreateCustomerDTO>;

export const customerService = crudService<
  Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO
>("customer");