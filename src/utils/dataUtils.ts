import { type Revenue } from "@/types/revenue";
import { type Expense } from "@/types/expense";

export function useDataUtils() {

  const searchData = <T extends { name: string }>(
    data: T[],
    searchedField: string[]
  ): T[] => {
    const orderedData = orderData(data);

    if (!searchedField || searchedField.length === 0) {
      return orderedData;
    }

    return orderedData.reduce<T[]>((result, item) => {
      const listedFieldName = item.name.toLowerCase();

      const matched = searchedField.some((element) =>
        listedFieldName.includes(element.toLowerCase())
      );

      if (matched) {
        result.push(item);
      }

      return result;
    }, []);
  };

  const orderData = <T extends { name: string }>(
    data: T[],
  ): T[] => {
    if (data && data.length > 0) {
      return data.sort((a, b) => {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()
    
        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      return [];
    }
  };

  const capitalize = (string: string): string => {
    return string
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const filteredData = (
    data: (Revenue | Expense)[],
    currentMonth: string,
    currentYear: number | string,
    currentStatus: string
  ) => {
    let result: (Revenue | Expense)[];

    if (data && data.length > 0) {
      if (
          currentMonth === "Todos os meses" &&
          currentYear === "Todos" &&
          currentStatus === "Todos"
      ) {
        result = data;
      } else if (
          currentMonth !== "Todos os meses" &&
          currentYear === "Todos" &&
          currentStatus === "Todos"
      ) {
        result = data.filter((e) => e.month === currentMonth);
      } else if (
          currentMonth === "Todos os meses" &&
          currentYear !== "Todos" &&
          currentStatus === "Todos"
      ) {
        result = data.filter((e) => e.year === currentYear);
      } else if (
          currentMonth === "Todos os meses" &&
          currentYear === "Todos" &&
          currentStatus !== "Todos"
      ) {
        result = data.filter(
          (e) =>
            e.paid === currentStatus
          );
      } else if (
          currentMonth !== "Todos os meses" &&
          currentYear !== "Todos" &&
          currentStatus === "Todos"
      ) {
        result = data.filter(
          (e) =>
            e.month === currentMonth &&
            e.year === currentYear
          );
      } else if (
          currentMonth === "Todos os meses" &&
          currentYear !== "Todos" &&
          currentStatus !== "Todos"
      ) {
        result = data.filter(
          (e) =>
            e.year === currentYear &&
            e.paid === currentStatus
          );
      } else if (
          currentMonth !== "Todos os meses" &&
          currentYear === "Todos" &&
          currentStatus !== "Todos"
      ) {
        result = data.filter(
          (e) =>
              e.month === currentMonth &&
              e.paid === currentStatus
        );
      } else {
        result = data.filter(
          (e) =>
              e.month === currentMonth &&
              e.year === currentYear &&
              e.paid === currentStatus
          );
      }
    } else {
      result = [];
    }

    return result;
  };

  const getValidFloat = (value: number | null): number | null => {
    const cleanedValue = value ? value.toString().replace(",", ".") : null;
    const floatValue = cleanedValue ? parseFloat(cleanedValue) : null;
  
    if (floatValue && !isNaN(floatValue)) {
      return floatValue;
    } else {
      return null;
    }
  };

  return {
    searchData,
    capitalize,
    filteredData,
    getValidFloat
  };
};