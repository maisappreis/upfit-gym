import { months } from "@/shared/utils/constants";

const MONTHS_FILTER = [...months, "Todos os meses"];

/* ---------- BASICS ---------- */

export const getMonthIndex = (month: string) =>
  MONTHS_FILTER.indexOf(month);

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