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
                labels: ["Janeiro", "Fevereiro", "Março", "Abril"],
                datasets: [
                    {
                        label: "Clientes Ativos",
                        backgroundColor: "blue",
                        data: [30, 40, 50, 45],
                    },
                ],
            },
            chartOptions: {
                responsive: true,
                // options: {
                //     plugins: {
                //         legend: {
                //             labels: {
                //                 font: {
                //                     size: 20,
                //                 },
                //             },
                //         },
                //     },
                // },
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
};
</script>

<style scoped>
.chart-area {
    margin: 20px;
    width: 45%;
}
</style>