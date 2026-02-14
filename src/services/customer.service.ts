import { crudService } from "./baseCrud.service";
import type {
  Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO
} from "@/types/customer";

export const customerService = crudService<
  Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO
>("customer");