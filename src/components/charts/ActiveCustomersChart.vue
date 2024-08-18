<template>
  <div class="chart-area">
    <LineChart
      v-if="chartData.datasets.length > 0"
      :data="chartData"
      :options="chartOptions"
      :style="myStyles"
    />
    <div v-else class="not-found">Sem dados para exibição do gráfico de Clientes Ativos</div>
  </div>
</template>

<script>
import { Line as LineChart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { mapStores } from 'pinia'
import { useApiStore } from '@/stores/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default {
  name: 'ActiveCustomersChart',

  components: { LineChart },

  props: {
    customers: Array,
    revenue: Array
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
    ...mapStores(useApiStore),
    myStyles() {
      return {
        height: `100%`,
        position: 'relative'
      }
    }
  },

  methods: {
    calculateActiveCustomersPerMonth() {
      const activeCustomersPerMonth = []

      this.apiStore.revenue.forEach((revenueRecord) => {
        if (revenueRecord.paid === 'Pago') {
          const year = revenueRecord.year
          const month = revenueRecord.month
          const customerId = revenueRecord.customer

          const customer = this.apiStore.customers.find((cust) => cust.id === customerId)

          if (customer && customer.status === 'Ativo') {
            const existingEntryIndex = activeCustomersPerMonth.findIndex(
              (entry) => entry.year === year && entry.month === month
            )

            if (existingEntryIndex === -1) {
              activeCustomersPerMonth.push({
                year,
                month,
                sum: 1
              })
            } else {
              activeCustomersPerMonth[existingEntryIndex].sum++
            }
          }
        }
      })

      return activeCustomersPerMonth
    },

    drawChart() {
      let activeCustomers = []
      if (
        this.apiStore.revenue &&
        this.apiStore.revenue.length > 0 &&
        this.apiStore.customers &&
        this.apiStore.customers.length > 0
      ) {
        activeCustomers = this.calculateActiveCustomersPerMonth()
      }

      if (activeCustomers && activeCustomers.length > 0) {
        let activeCustomersLast12Months = this.$methods.filterLast12Months(activeCustomers)
        let labels = activeCustomersLast12Months.map((e) => e.month)
        let data = activeCustomersLast12Months.map((e) => e.sum)

        this.chartData = {
          labels: labels,
          datasets: [
            {
              label: 'Clientes',
              backgroundColor: 'blue',
              borderColor: 'rgba(110, 93, 207, 0.8)',
              pointRadius: 4,
              data: data
            }
          ]
        }
      }
    }
  },

  mounted() {
    this.drawChart()
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
    margin: 0 0 0 10px;
  }
}
</style>