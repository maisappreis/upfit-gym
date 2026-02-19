import type { Revenue } from "@/types/revenue";
import type { Expense } from "@/types/expense";

/* ---------- TYPES ---------- */

type NamedItem = { name: string };
type PayableItem = Revenue | Expense;

/* ---------- HELPERS ---------- */

export const normalize = (value: string): string =>
  value.trim().toLowerCase();

export const getCssVar = (name: string) =>
  getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

/* ---------- SORT ---------- */

export const orderData = <T extends NamedItem>(data: T[]): T[] => {
  if (!data?.length) return [];

  return [...data].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR", {
      sensitivity: "base",
    })
  );
};

/* ---------- SEARCH ---------- */

export const searchData = <T extends NamedItem>(
  data: T[],
  searchedField: string[]
): T[] => {
  const orderedData = orderData(data);

  if (!searchedField?.length) return orderedData;

  const normalizedSearch = searchedField.map(normalize);

  return orderedData.filter((item) => {
    const name = normalize(item.name);

    return normalizedSearch.some((term) =>
      name.includes(term)
    );
  });
};

/* ---------- STRING ---------- */

export const capitalize = (value: string): string => {
  return value
    .toLowerCase()
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

/* ---------- FILTERS ---------- */

export interface DataFilterParams {
  currentMonth: string;
  currentYear: number | string;
  currentStatus: string;
}

export const filteredData = <T extends PayableItem>(
  data: T[],
  {
    currentMonth,
    currentYear,
    currentStatus,
  }: DataFilterParams
): T[] => {
  if (!data?.length) return [];

  return data.filter((item) => {
    const matchMonth =
      currentMonth === "Todos os meses" ||
      item.month === currentMonth;

    const matchYear =
      currentYear === "Todos" ||
      item.year === currentYear;

    const matchStatus =
      currentStatus === "Todos" ||
      item.paid === currentStatus;

    return matchMonth && matchYear && matchStatus;
  });
};