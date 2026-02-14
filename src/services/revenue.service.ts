import { crudService } from "./baseCrud.service";
import type {
  Revenue,
  CreateRevenueDTO,
  UpdateRevenueDTO
} from '@/types/revenue';

export const revenueService = crudService<
  Revenue,
  CreateRevenueDTO,
  UpdateRevenueDTO
>("revenue");
