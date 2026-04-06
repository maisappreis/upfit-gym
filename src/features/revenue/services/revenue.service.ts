import { crudService } from "../../../shared/services/baseCrud.service";
import type {
  Revenue,
  CreateRevenueDTO,
  UpdateRevenueDTO
} from '@/features/revenue/types/revenue';

export const revenueService = crudService<
  Revenue,
  CreateRevenueDTO,
  UpdateRevenueDTO
>("revenue");
