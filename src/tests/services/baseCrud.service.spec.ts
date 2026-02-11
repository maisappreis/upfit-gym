import { describe, it, expect, vi, beforeEach } from "vitest";
import { crudService } from "@/services/baseCrud.service";
import { apiClient } from "@/services/apiClient";

vi.mock("@/services/apiClient", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

type TestEntity = {
  id: number;
  name: string;
};

describe("crudService", () => {
  const service = crudService<TestEntity, Omit<TestEntity, "id">, Partial<TestEntity>>("test");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchAll deve retornar lista de entidades", async () => {
    const mockData = [{ id: 1, name: "John" }];

    (apiClient.get as any).mockResolvedValue({ data: mockData });

    const result = await service.fetchAll();

    expect(apiClient.get).toHaveBeenCalledWith("/test/");
    expect(result).toEqual(mockData);
  });

  it("create deve enviar payload e retornar entidade criada", async () => {
    const payload = { name: "John" };
    const mockResponse = { id: 1, name: "John" };

    (apiClient.post as any).mockResolvedValue({ data: mockResponse });

    const result = await service.create(payload);

    expect(apiClient.post).toHaveBeenCalledWith("/test/create/", payload);
    expect(result).toEqual(mockResponse);
  });

  it("update deve enviar id e payload", async () => {
    const payload = { name: "Updated" };
    const mockResponse = { id: 1, name: "Updated" };

    (apiClient.patch as any).mockResolvedValue({ data: mockResponse });

    const result = await service.update(1, payload);

    expect(apiClient.patch).toHaveBeenCalledWith("/test/1/", payload);
    expect(result).toEqual(mockResponse);
  });

  it("delete deve chamar endpoint correto", async () => {
    (apiClient.delete as any).mockResolvedValue({});

    await service.delete(1);

    expect(apiClient.delete).toHaveBeenCalledWith("/test/1/");
  });
});
