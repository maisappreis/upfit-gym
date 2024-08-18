<template>
  <div class="content-area">
    <RevenueExpensesChart
      :monthlyRevenue="monthlyRevenueOrdered"
      :monthlyExpenses="monthlyExpensesOrdered"
    />
    <div style="display: flex; justify-content: space-between">
      <ActiveCustomersChart />
      <ProfitChart :monthlyProfit="monthlyProfit" />
    </div>
  </div>
</template>

<script>
import RevenueExpensesChart from '../charts/RevenueExpensesChart.vue'
import ActiveCustomersChart from '../charts/ActiveCustomersChart.vue'
import ProfitChart from '../charts/ProfitChart.vue'
import { mapState } from 'pinia'
import { useApiStore } from '@/stores/api'

export default {
  name: 'MetricsPage',

  components: {
    RevenueExpensesChart,
    ActiveCustomersChart,
    ProfitChart
  },

  data() {
    return {
      monthlyRevenueOrdered: [],
      monthlyExpensesOrdered: [],
      monthlyProfit: []
    }
  },

  computed: {
    ...mapState(useApiStore, ['revenue', 'expenses'])
  },

  methods: {
    sumMonthlyAmounts(data) {
      const summedValuesMap = new Map()

      data.forEach((item) => {
        const key = `${item.year}-${item.month}`

        if (!summedValuesMap.has(key)) {
          summedValuesMap.set(key, {
            year: item.year,
            month: item.month,
            sum: 0
          })
        }
        summedValuesMap.get(key).sum += item.value
      })
      return Array.from(summedValuesMap.values())
    },

    calculateProfit() {
      const resultArray = []

      this.monthlyRevenueOrdered.forEach((revenueItem) => {
        const expenseItem = this.monthlyExpensesOrdered.find(
          (expense) => expense.year === revenueItem.year && expense.month === revenueItem.month
        )

        const profit = {
          year: revenueItem.year,
          month: revenueItem.month,
          sum: revenueItem.sum - (expenseItem ? expenseItem.sum : 0)
        }

        resultArray.push(profit)
      })

      this.monthlyProfit = resultArray
    }
  },

  mounted() {
    if (this.revenue && this.revenue.length > 0) {
      let paidRevenue = this.revenue.filter((e) => e.paid === 'Pago')
      let paidExpenses = this.expenses.filter((e) => e.paid === 'Pago')

      let monthlyRevenue = this.sumMonthlyAmounts(paidRevenue)
      let monthlyExpenses = this.sumMonthlyAmounts(paidExpenses)

      this.monthlyRevenueOrdered = this.$methods.sortData(monthlyRevenue)
      this.monthlyExpensesOrdered = this.$methods.sortData(monthlyExpenses)

      this.calculateProfit()
    }
  }
}
</script>

<style scoped>
</style>