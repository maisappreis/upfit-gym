import { type SumPerMonth } from "@/types/chart";

export function useDateUtils() {
  const getMonthIndex = (month: string) => {
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
    const currentDate = new Date(startDate);
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = currentDate.getMonth();
    const currentDay = startDate.split("-")[2]
  
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  
    const data = {
      year: currentYear,
      month: months[currentMonthIndex],
      day: currentDay
    } as {
      year: number;
      month: string;
      day: string;
    };
  
    return data;
  };

  const getNextMonth = (currentMonth: string, currentYear: number) => {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
  
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

  return {
    getMonthIndex,
    sortDataByDate,
    getCurrentYearMonthDay,
    getNextMonth,
    formatDate
  };
};