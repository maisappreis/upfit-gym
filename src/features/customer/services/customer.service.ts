import { crudService } from "../../../shared/services/baseCrud.service";
import type {
  Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO
} from "@/features/customer/types/customer";

export const customerService = crudService<
  Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO
>("customer");