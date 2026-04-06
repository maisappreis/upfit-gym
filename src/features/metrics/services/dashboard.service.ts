import { apiClient } from "../../../shared/services/apiClient";
import { type Dashboard } from "@/features/metrics/types/chart";

export const dashboardService = {

  async list(): Promise<Dashboard> {
    const { data } = await apiClient.get<Dashboard>('/dashboard_charts/');
    return data;
  },
};