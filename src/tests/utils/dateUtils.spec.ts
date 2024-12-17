import { describe, it, expect } from "vitest";
import { useDateUtils } from "@/utils/dateUtils";

describe("useDateUtils", () => {
  const {
    getMonthIndex,
    sortDataByDate,
    getCurrentYearMonthDay,
    getNextMonth,
    formatDate,
  } = useDateUtils();

  describe("getMonthIndex", () => {
    it("deve retornar o índice correto do mês", () => {
      expect(getMonthIndex("Janeiro")).toBe(0);
      expect(getMonthIndex("Dezembro")).toBe(11);
      expect(getMonthIndex("Todos os meses")).toBe(12);
    });

    it("deve retornar -1 para um mês inválido", () => {
      expect(getMonthIndex("Inexistente")).toBe(-1);
    });
  });

  describe("sortDataByDate", () => {
    it("deve ordenar os dados corretamente por ano e mês", () => {
      const data = [
        { year: 2023, month: "Fevereiro", sum: 100 },
        { year: 2023, month: "Janeiro", sum: 200 },
        { year: 2022, month: "Dezembro", sum: 150 },
      ];
      const sorted = sortDataByDate(data);
      expect(sorted).toEqual([
        { year: 2022, month: "Dezembro", sum: 150 },
        { year: 2023, month: "Janeiro", sum: 200 },
        { year: 2023, month: "Fevereiro", sum: 100 },
      ]);
    });
  });

  describe("getCurrentYearMonthDay", () => {
    it("deve retornar o ano, mês e dia atuais da data fornecida", () => {
      const result = getCurrentYearMonthDay("2024-12-16");
      expect(result).toEqual({
        year: 2024,
        month: "Dezembro",
        day: "16",
      });
    });

    it("deve lidar com uma data válida", () => {
      const result = getCurrentYearMonthDay("2023-08-01");
      expect(result).toEqual({
        year: 2023,
        month: "Agosto",
        day: "01",
      });
    });
  });

  describe("getNextMonth", () => {
    it("deve retornar o próximo mês e ano para meses intermediários", () => {
      const result = getNextMonth("Janeiro", 2024);
      expect(result).toEqual({
        month: "Fevereiro",
        year: 2024,
        monthNumber: 2,
      });
    });

    it("deve retornar o próximo ano quando o mês for Dezembro", () => {
      const result = getNextMonth("Dezembro", 2024);
      expect(result).toEqual({
        month: "Janeiro",
        year: 2025,
        monthNumber: 1,
      });
    });
  });

  describe("formatDate", () => {
    it("deve formatar a data no formato brasileiro", () => {
      const result = formatDate("2024-12-16");
      expect(result).toBe("16/12/2024");
    });

    it("deve lidar com datas de outro formato", () => {
      const result = formatDate("2023-01-01");
      expect(result).toBe("01/01/2023");
    });
  });
});
