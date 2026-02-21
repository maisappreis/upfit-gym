import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/services/apiClient";
import { type Revenue, type CreateRevenueDTO, type UpdateRevenueDTO } from "@/types/revenue";
import { revenueService } from "@/services/revenue.service";

vi.mock("@/services/apiClient", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

describe("revenueService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchAll must call /revenue/ with get", async () => {
    const mockData = [
      {
        id: 1,
        customer: 1,
        month: "Janeiro",
        name: "Maria",
        notes: "",
        paid: "À pagar",
        payment_day: 10,
        plan: "5x",
        start: "2026-02-12",
        status: "Ativo",
        value: 560,
        year: 2026
      }
    ];

    (apiClient.get as any).mockResolvedValue({ data: mockData });

    const result = await revenueService.fetchAll();

    expect(apiClient.get).toHaveBeenCalledWith("/revenue/");
    expect(result).toEqual(mockData);
  });

  it("create must call /revenue/create/ with post", async () => {
    const payload = {
      customer: 1,
      month: "Janeiro",
      notes: "",
      paid: "À pagar",
      payment_day: 10,
      value: 560,
      year: 2026
    } as CreateRevenueDTO;

    (apiClient.post as any).mockResolvedValue({
      data: payload
    });

    const result = await revenueService.create(payload);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/revenue/create/",
      payload
    );

    expect(result).toEqual(payload);
  });

  it("update must call /revenue/{id}/ with patch", async () => {
    const payload = {
      customer: 1,
      month: "Janeiro",
      notes: "",
      paid: "À pagar",
      payment_day: 10,
      value: 560,
      year: 2026
    } as UpdateRevenueDTO;

    const mockResponse = {
      id: 1,
      customer: 1,
      month: "Janeiro",
      name: "Maria",
      notes: "",
      paid: "À pagar",
      payment_day: 10,
      plan: "Mensal",
      start: "2026-02-12",
      status: "Ativo",
      value: 560,
      year: 2026
    } as Revenue;

    (apiClient.patch as any).mockResolvedValue({
      data: mockResponse
    });

    const result = await revenueService.update(1, payload);

    expect(apiClient.patch).toHaveBeenCalledWith(
      "/revenue/1/",
      payload
    );

    expect(result).toEqual(mockResponse);
  });

  it("delete must call /revenue/{id}/ with delete", async () => {
    (apiClient.delete as any).mockResolvedValue({});

    await revenueService.delete(1);

    expect(apiClient.delete).toHaveBeenCalledWith(
      "/revenue/1/"
    );
  });
});

