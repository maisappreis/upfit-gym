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
  
    formatDate(date) {
      const [year, month, day] = date.split('-');

      const formattedDateString = `${day}/${month}/${year}`;
      return formattedDateString
  }
  },
};