import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/services/apiClient";
import { type Customer } from "@/types/customer";
import {
  customerService,
  type CreateCustomerDTO,
  type UpdateCustomerDTO
} from "@/services/customer.service";

vi.mock("@/services/apiClient", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

describe("customerService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchAll must call /customer/ with get", async () => {
    const mockData = [
      {
        id: 1,
        name: "Maria",
        frequency: "1x",
        plan: "Mensal",
        value: 555,
        start: "2025-03-02",
        status: "Ativo",
        notes: ""
      }
    ];

    (apiClient.get as any).mockResolvedValue({ data: mockData });

    const result = await customerService.fetchAll();

    expect(apiClient.get).toHaveBeenCalledWith("/customer/");
    expect(result).toEqual(mockData);
  });

  it("create must call /customer/create/ with post", async () => {
    const payload = {
      name: "Maria",
      frequency: "1x",
      plan: "Mensal",
      value: 555,
      start: "2025-03-02",
      status: "Ativo",
      notes: ""
    } as CreateCustomerDTO;

    (apiClient.post as any).mockResolvedValue({
      data: payload
    });

    const result = await customerService.create(payload);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/customer/create/",
      payload
    );

    expect(result).toEqual(payload);
  });

  it("update must call /customer/{id}/ with patch", async () => {
    const payload = {
      name: "Maria Updated",
      frequency: "1x",
      plan: "Mensal",
      value: 555,
      start: "2025-03-02",
      status: "Ativo",
      notes: ""
    } as UpdateCustomerDTO;
    
    const mockResponse = {
      id: 1,
      name: "Maria Updated",
      frequency: "1x",
      plan: "Mensal",
      value: 555,
      start: "2025-03-02",
      status: "Ativo",
      notes: ""  
    } as Customer;

    (apiClient.patch as any).mockResolvedValue({
      data: mockResponse
    });

    const result = await customerService.update(1, payload);

    expect(apiClient.patch).toHaveBeenCalledWith(
      "/customer/1/",
      payload
    );

    expect(result).toEqual(mockResponse);
  });

  it("delete must call /customer/{id}/ with delete", async () => {
    (apiClient.delete as any).mockResolvedValue({});

    await customerService.delete(1);

    expect(apiClient.delete).toHaveBeenCalledWith(
      "/customer/1/"
    );
  });
});

