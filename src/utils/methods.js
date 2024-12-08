export const globalMethods = {
  methods: {
    filterLast12Months(array) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      const last12Months = array.filter((entry) => {
        if (entry.year === currentYear) {
          const currentMonthIndex = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          );
          const entryMonthIndex = new Date(
            currentDate.getFullYear(),
            this.getMonthIndex(entry.month),
            1
          );
          return entryMonthIndex >= currentMonthIndex;
        } else {
          return (
            entry.year === currentYear - 1 &&
            this.getMonthIndex(entry.month) >= currentDate.getMonth()
          );
        }
      });

      return last12Months;
    },

    getMonthIndex(month) {
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
    },

    sortData(data) {
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
      };

      return data.sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return monthOrder[a.month] - monthOrder[b.month];
      });
    },

    getCurrentYearMonthDay(startDate) {
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

      return data
    },

    getNextMonth(currentMonth, currentYear) {
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
    
      return response;
    },
    capitalize(string) {
      return string
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }
};

export const sortData = (data) => {
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
  };

  return data.sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }
    return monthOrder[a.month] - monthOrder[b.month];
  });
};