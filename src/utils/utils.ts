import { type Revenue } from "@/types/revenue";
import { type Expense } from "@/types/expense";
import { type SumPerMonth } from "@/types/chart";

export function useUtils() {
  const getMonthIndex = (month) => {
    console.log('month', month)
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
      "Todos os meses",
    ]
    return months.indexOf(month);
  };

  const sortData = (data: SumPerMonth[]): SumPerMonth[] => {
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

  const getCurrentYearMonthDay = (startDate) => {
    console.log('startDate', startDate)

    const currentDate = new Date(startDate);
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = currentDate.getMonth();
    const currentDay = startDate.split('-')[2]
  
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  
    let data = {
      year: currentYear,
      month: months[currentMonthIndex],
      day: currentDay
    }
  
    console.log('return data', data)
    return data;
  };

  const getNextMonth = (currentMonth, currentYear) => {
    console.log('currentMonth', currentMonth)
    console.log('currentYear', currentYear)

    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
  
    const currentMonthIndex = months.indexOf(currentMonth);
  
    let nextMonthIndex = (currentMonthIndex + 1) % 12;
    let nextYear = currentYear;
  
    if (nextMonthIndex === 0) {
      nextYear++;
    }
  
    const response = {
      month: months[nextMonthIndex],
      year: nextYear,
      monthNumber: nextMonthIndex + 1
    };
  
    console.log('response', response)
    return response;
  };

  const capitalize = (string: string): string => {
    return string
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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

  return {
    getMonthIndex,
    sortData,
    getCurrentYearMonthDay,
    getNextMonth,
    capitalize,
    filteredData
  };
};