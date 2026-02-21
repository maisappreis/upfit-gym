import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/services/apiClient";
import { type Expense, type CreateExpenseDTO, type UpdateExpenseDTO } from "@/types/expense";
import { expenseService } from "@/services/expense.service";

vi.mock("@/services/apiClient", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

describe("expenseService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchAll must call /expense/ with get", async () => {
    const mockData = [
      {
        id: 1,
        name: "Rent",
        month: "Janeiro",
        date: "2026-02-12",
        paid: "À pagar",
        value: 235,
        year: 2026,
        installments: "",
        notes: ""
      }
    ];

    (apiClient.get as any).mockResolvedValue({ data: mockData });

    const result = await expenseService.fetchAll();

    expect(apiClient.get).toHaveBeenCalledWith("/expense/");
    expect(result).toEqual(mockData);
  });

  it("create must call /expense/create/ with post", async () => {
    const payload = {
      name: "Rent",
      month: "Janeiro",
      date: "2026-02-12",
      paid: "À pagar",
      value: 235,
      year: 2026,
      installments: "",
      notes: ""
    } as CreateExpenseDTO;

    (apiClient.post as any).mockResolvedValue({
      data: payload
    });

    const result = await expenseService.create(payload);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/expense/create/",
      payload
    );

    expect(result).toEqual(payload);
  });

  it("update must call /expense/{id}/ with patch", async () => {
    const payload = {
      name: "Rent",
      month: "Janeiro",
      date: "2026-02-12",
      paid: "À pagar",
      value: 235,
      year: 2026,
      installments: "",
      notes: ""
    } as UpdateExpenseDTO;

    const mockResponse = {
      id: 1,
      name: "Rent Updated",
      month: "Janeiro",
      date: "2026-02-12",
      paid: "À pagar",
      value: 235,
      year: 2026,
      installments: "",
      notes: ""
    } as Expense;

    (apiClient.patch as any).mockResolvedValue({
      data: mockResponse
    });

    const result = await expenseService.update(1, payload);

    expect(apiClient.patch).toHaveBeenCalledWith(
      "/expense/1/",
      payload
    );

    expect(result).toEqual(mockResponse);
  });

  it("delete must call /expense/{id}/ with delete", async () => {
    (apiClient.delete as any).mockResolvedValue({});

    await expenseService.delete(1);

    expect(apiClient.delete).toHaveBeenCalledWith(
      "/expense/1/"
    );
  });
});

