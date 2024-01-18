export const globalComputed = {
    computed: {
        filteredData(data, currentMonth, currentYear, currentStatus) {
            if (
                currentMonth === "Todos os meses" &&
                currentYear === "Todos" &&
                currentStatus === "Todos"
            ) {
                return data
            } else if (
                currentMonth !== "Todos os meses" &&
                currentYear === "Todos" &&
                currentStatus === "Todos"
            ) {
                return data.filter(
                    (e) =>
                        e.month === currentMonth
                );
            } else if (
                currentMonth === "Todos os meses" &&
                currentYear !== "Todos" &&
                currentStatus === "Todos"
            ) {
                return data.filter((e) => e.year === currentYear);
            } else if (
                currentMonth === "Todos os meses" &&
                currentYear === "Todos" &&
                currentStatus !== "Todos"
            ) {
                return data.filter(
                    (e) =>
                        e.paid === currentStatus
                );
            } else if (
                currentMonth !== "Todos os meses" &&
                currentYear !== "Todos" &&
                currentStatus === "Todos"
            ) {
                return data.filter(
                    (e) =>
                        e.month === currentMonth &&
                        e.year === currentYear
                );
            } else if (
                currentMonth === "Todos os meses" &&
                currentYear !== "Todos" &&
                currentStatus !== "Todos"
            ) {
                return data.filter(
                    (e) =>
                        e.year === currentYear &&
                        e.paid === currentStatus
                );
            } else if (
                currentMonth !== "Todos os meses" &&
                currentYear === "Todos" &&
                currentStatus !== "Todos"
            ) {
                return data.filter(
                    (e) =>
                        e.month === currentMonth &&
                        e.paid === currentStatus
                );
            } else {
                return data.filter(
                    (e) =>
                        e.month === currentMonth &&
                        e.year === currentYear &&
                        e.paid === currentStatus
                );
            }
        },
    },
};