import { type SumPerMonth } from "@/types/chart";
import { months } from "@/utils/constants";

const MONTHS_FILTER = [...months, "Todos os meses"];

const MONTH_ORDER: Record<string, number> = Object.fromEntries(
  months.map((m, i) => [m, i + 1])
);

/* ---------- BASICS ---------- */

export const getMonthIndex = (month: string) =>
  MONTHS_FILTER.indexOf(month);

/* ---------- SORT ---------- */

export const sortDataByDate = (
  data: SumPerMonth[]
): SumPerMonth[] => {
  return [...data].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return MONTH_ORDER[a.month] - MONTH_ORDER[b.month];
  });
};

/* ---------- DATE PARSING ---------- */

export const getCurrentYearMonthDay = (startDate: string) => {
  const [year, month, day] = startDate
    .split("-")
    .map(Number);

  return {
    year,
    month: months[month - 1],
    day: String(day).padStart(2, "0"),
  };
};

export const getNextMonth = (
  currentMonth: string,
  currentYear: number
) => {
  const idx = months.indexOf(currentMonth);
  const nextIdx = (idx + 1) % 12;

  return {
    month: months[nextIdx],
    year: currentYear + (nextIdx === 0 ? 1 : 0),
    monthNumber: nextIdx + 1,
  };
};

export const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

export const getYearAndMonth = (dueDate: string) => {
  const parsedDate = new Date(dueDate);

  return {
    year: parsedDate.getFullYear(),
    month: months[parsedDate.getMonth()],
  };
};