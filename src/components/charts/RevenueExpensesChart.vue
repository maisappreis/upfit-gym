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
    name: "RevenueExpensesChart",

    components: { Line },

    props: {
        monthlyRevenue: Array,
        monthlyExpenses: Array,
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
                width: "100%",
                position: "relative",
            };
        },
    },

    watch: {
        monthlyRevenue() {
            if (
                this.monthlyRevenue.length > 0 &&
                this.monthlyExpenses.length > 0
            ) {
                let monthlyRevenueLast12Months = this.$methods.filterLast12Months(this.monthlyRevenue);
                let monthlyExpensesLast12Months = this.$methods.filterLast12Months(this.monthlyExpenses);

                let labels = monthlyRevenueLast12Months.map((e) => e.month);
                let revenueData = monthlyRevenueLast12Months.map((e) => e.sum);
                let expensesData = monthlyExpensesLast12Months.map((e) => e.sum);

                this.chartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Receita",
                            backgroundColor: "green",
                            data: revenueData,
                        },
                        {
                            label: "Despesas",
                            backgroundColor: "red",
                            data: expensesData,
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
    height: 40%;
}
</style>