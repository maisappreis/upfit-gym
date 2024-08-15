<template>
  <div class="chart-area">
    <Bar
      v-if="chartData.datasets.length > 0"
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
      :style="myStyles"
    />
    <h4 v-else>Sem dados para exibição do gráfico de Lucros</h4>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'ProfitChart',

  components: { Bar },

  props: {
    monthlyProfit: Array
  },

  data() {
    return {
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: 'gray',
              boxHeight: 15,
              boxWidth: 15,
              font: {
                size: '20px'
              }
            }
          },
          tooltip: {
            enabled: true,
            bodySpacing: 5,
            padding: 15,
            displayColors: false,
            titleFont: {
              size: 18
            },
            bodyFont: {
              size: 15
            }
          }
        }
      }
    }
  },

  computed: {
    myStyles() {
      return {
        height: `100%`,
        position: 'relative'
      }
    }
  },

  watch: {
    monthlyProfit() {
      if (this.monthlyProfit && this.monthlyProfit.length > 0) {
        let monthlyProfitLast12Months = this.$methods.filterLast12Months(this.monthlyProfit)

        let labels = monthlyProfitLast12Months.map((e) => e.month)
        let data = monthlyProfitLast12Months.map((e) => e.sum)

        this.chartData = {
          labels: labels,
          datasets: [
            {
              label: 'Lucro',
              backgroundColor: 'green',
              data: data
            }
          ]
        }
      }
    }
  }
}
</script>

<style scoped>
.chart-area {
  margin: 20px;
  width: 45%;
}

@media only screen and (max-width: 1000px) {
  .chart-area {
    margin: 0 10px 0 0;
  }
}
</style>