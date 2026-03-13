import { apiClient } from "./apiClient";
import { type Dashboard } from "@/types/chart";

export const dashboardService = {

  async list(): Promise<Dashboard> {
    const { data } = await apiClient.get<Dashboard>('/dashboard_charts/');
    return data;
  },
};