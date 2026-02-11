import type { Revenue } from '@/types/revenue';
import { crudService } from "./baseCrud.service";

export type CreateRevenueDTO = Omit<
  Revenue,
  "id" | "name" | "plan" | "start" | "status"
>;
export type UpdateRevenueDTO = Partial<CreateRevenueDTO>;

export const revenueService = crudService<
  Revenue,
  CreateRevenueDTO,
  UpdateRevenueDTO
>("revenue");
