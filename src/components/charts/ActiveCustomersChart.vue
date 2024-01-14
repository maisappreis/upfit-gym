<template>
    <div class="chart-area">
        <Line :data="chartData" :options="chartOptions" :style="myStyles" />
    </div>
</template>

<script>
import { Line } from "vue-chartjs";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default {
    name: "ActiveCustomersChart",

    components: { Line },

    props: {
        customers: Array,
        revenue: Array,
    },

    data() {
        return {
            chartData: {
                labels: [],
                datasets: [],
            },
            chartOptions: {
                responsive: true,
            },
        };
    },

    computed: {
        myStyles() {
            return {
                height: `100%`,
                position: "relative",
            };
        },
    },

    methods: {
        calculateActiveCustomersPerMonth() {
            const activeCustomersPerMonth = [];

            this.revenue.forEach((revenueRecord) => {
                 if (revenueRecord.paid === "Pago") {
                    const year = revenueRecord.year;
                    const month = revenueRecord.month;
                    const customerId = revenueRecord.customer_id;

                    const customer = this.customers.find(
                        (cust) => cust.id === parseInt(customerId)
                    );

                    if (customer && customer.status === "Ativo") {
                        const existingEntryIndex =
                            activeCustomersPerMonth.findIndex(
                                (entry) =>
                                    entry.year === year && entry.month === month
                            );

                        if (existingEntryIndex === -1) {
                            activeCustomersPerMonth.push({
                                year,
                                month,
                                sum: 1,
                            });
                        } else {
                            activeCustomersPerMonth[existingEntryIndex].sum++;
                        }
                    }
                }
            });

            return activeCustomersPerMonth;
        },
    },

    watch: {
        customers() {
            let activeCustomers = this.calculateActiveCustomersPerMonth();

            if (activeCustomers && activeCustomers.length > 0) {

                let activeCustomersLast12Months = this.$methods.filterLast12Months(activeCustomers);
                let labels = activeCustomersLast12Months.map((e) => e.month);
                let data = activeCustomersLast12Months.map((e) => e.sum);

                this.chartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Lucro",
                            backgroundColor: "green",
                            data: data,
                        },
                    ],
                };
            }
        },
    },
};
</script>

<style scoped>
.chart-area {
    margin: 20px;
    width: 45%;
}
</style>