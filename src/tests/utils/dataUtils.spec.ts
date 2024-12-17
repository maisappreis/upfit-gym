import { describe, it, expect } from "vitest";
import { useDataUtils } from "@/utils/dataUtils";
import { type Expense } from "@/types/expense";
import { type Customer } from "@/types/customer";

describe("useDataUtils", () => {
  const { searchData, capitalize, filteredData, getValidFloat } = useDataUtils();

  describe("searchData", () => {
    const customersData = [
      {
        id: 1,
        name: "John Doe",
        frequency: "3x",
        plan: "Mensal",
        value: 350,
        start: "2024-12-17",
        status: "Pago",
        notes: "Notes to teste."
      },{
        id: 2,
        name: "Jane Smith",
        frequency: "4x",
        plan: "Mensal",
        value: 350,
        start: "2024-12-23",
        status: "Pago",
        notes: "Notes to teste."
      }
    ] as Customer[];

    it("should return ordered data when searchedField is empty", () => {
      const result = searchData(customersData, []);
      expect(result[0].name).toBe("Jane Smith");
      expect(result[1].name).toBe("John Doe");
    });

    it("should filter and return only matching data based on searchedField", () => {
      const result = searchData(customersData, ["John"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("John Doe");
    });

    it("should return an empty array if no match is found", () => {
      const result = searchData(customersData, ["Alice"]);
      expect(result).toEqual([]);
    });
  });

  describe("capitalize", () => {
    it("should capitalize the first letter of each word", () => {
      const result = capitalize("john doe");
      expect(result).toBe("John Doe");
    });

    it("should handle single-word strings", () => {
      const result = capitalize("john");
      expect(result).toBe("John");
    });

    it("should handle empty strings", () => {
      const result = capitalize("");
      expect(result).toBe("");
    });
  });

  describe("filteredData", () => {
    const expenseData = [
      { id: 1, name: "Bill 1", month: "Janeiro", year: 2024, date: "2024-01-25", paid: "Pago", value: 250, installments: "", notes: "notes"},
      { id: 2, name: "Bill 2", month: "Fevereiro", year: 2023, date: "2023-02-25", paid: "À pagar", value: 800, installments: "", notes: "notes"},
      { id: 3, name: "Bill 3", month: "Janeiro", year: 2023, date: "2023-01-25", paid: "Pago", value: 350, installments: "", notes: "notes"},
    ] as Expense[];

    it("should return all data when all filters are set to 'Todos'", () => {
      const result = filteredData(expenseData, "Todos os meses", "Todos", "Todos");
      expect(result).toEqual(expenseData);
    });

    it("should filter by month", () => {
      const result = filteredData(expenseData, "Janeiro", "Todos", "Todos");
      expect(result).toHaveLength(2);
    });

    it("should filter by year", () => {
      const result = filteredData(expenseData, "Todos os meses", 2023, "Todos");
      expect(result).toHaveLength(2);
    });

    it("should filter by status", () => {
      const result = filteredData(expenseData, "Todos os meses", "Todos", "Pago");
      expect(result).toHaveLength(2);
    });

    it("should combine multiple filters", () => {
      const result = filteredData(expenseData, "Janeiro", 2023, "Pago");
      expect(result).toHaveLength(1);
      expect(result[0].year).toBe(2023);
    });
  });

  describe("getValidFloat", () => {
    it("should convert valid numbers to float", () => {
      expect(getValidFloat(123)).toBe(123);
      expect(getValidFloat("123,45" as unknown as number)).toBe(123.45);
    });

    it("should return null for invalid numbers", () => {
      expect(getValidFloat(null)).toBeNull();
      expect(getValidFloat("invalid" as unknown as number)).toBeNull();
    });

    it("should handle numbers with commas", () => {
      const result = getValidFloat("123,45" as unknown as number);
      expect(result).toBe(123.45);
    });
  });
});
