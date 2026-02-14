import { type SumPerMonth } from "@/types/chart";
import { months } from "@/utils/variables";

export function useDateUtils() {
  const getMonthIndex = (month: string) => {
    const monthsFilter = [...months, "Todos os meses",]
    return monthsFilter.indexOf(month);
  };

  const sortDataByDate = (data: SumPerMonth[]): SumPerMonth[] => {
    const monthOrder = {
      Janeiro: 1,
      Fevereiro: 2,
      Março: 3,
      Abril: 4,
      Maio: 5,
      Junho: 6,
      Julho: 7,
      Agosto: 8,
      Setembro: 9,
      Outubro: 10,
      Novembro: 11,
      Dezembro: 12,
    } as { [key:string]: number };
  
    return data.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return monthOrder[a.month] - monthOrder[b.month];
    });
  };

  const getCurrentYearMonthDay = (startDate: string) => {
    const [year, month, day] = startDate.split("-").map(Number);
  
    const data = {
      year,
      month: months[month - 1],
      day: day.toString().padStart(2, "0"),
    };
  
    return data;
  };

  const getNextMonth = (currentMonth: string, currentYear: number) => {
    const currentMonthIndex = months.indexOf(currentMonth);
    const nextMonthIndex = (currentMonthIndex + 1) % 12;
    let nextYear = currentYear;
  
    if (nextMonthIndex === 0) {
      nextYear++;
    }
  
    const response = {
      month: months[nextMonthIndex],
      year: nextYear,
      monthNumber: nextMonthIndex + 1
    };
  
    return response;
  };

  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-");
    const formattedDateString = `${day}/${month}/${year}`;
    return formattedDateString;
  };

  const getYearAndMonth = (dueDate: string) => {
    const parsedDate = new Date(dueDate);
    const year = parsedDate.getFullYear();
    const monthNumber = parsedDate.getMonth();
    const month = months[monthNumber];

    return { year, month };
  };

  return {
    getMonthIndex,
    sortDataByDate,
    getCurrentYearMonthDay,
    getNextMonth,
    formatDate,
    getYearAndMonth
  };
};