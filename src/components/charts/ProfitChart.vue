<template>
    <div class="chart-area">
        <Bar
            id="my-chart-id"
            :options="chartOptions"
            :data="chartData"
            :style="myStyles"
        />
    </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);

export default {
    name: "ProfitChart",

    components: { Bar },

    props: {
        monthlyProfit: Array,
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

    watch: {
        monthlyProfit() {
            if (this.monthlyProfit && this.monthlyProfit.length > 0) {
                let monthlyProfitLast12Months = this.$methods.filterLast12Months(this.monthlyProfit);

                let labels = monthlyProfitLast12Months.map((e) => e.month);
                let data = monthlyProfitLast12Months.map((e) => e.sum);

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