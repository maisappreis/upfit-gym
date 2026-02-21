import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RevenueExpensesChart from '@/components/charts/RevenueExpensesChart.vue'

vi.mock('@/composables/useChart', () => ({
  useChart: () => ({
    monthlyRevenueOrdered: {
      value: [
        { month: 'Janeiro', sum: 2000 },
        { month: 'Fevereiro', sum: 1800 }
      ]
    },
    monthlyExpensesOrdered: {
      value: [
        { month: 'Janeiro', sum: 1200 },
        { month: 'Fevereiro', sum: 1000 }
      ]
    }
  })
}))

vi.mock('vue-chartjs', () => ({
  Line: {
    name: 'LineChart',
    template: '<div class="line-chart"></div>'
  }
}))

vi.mock('@/utils/dataUtils', () => ({
  getCssVar: vi.fn(() => '#000')
}))

describe('RevenueExpensesChart.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(RevenueExpensesChart)
  })

  it('renderiza o gráfico quando há dados', () => {
    expect(wrapper.find('.line-chart').exists()).toBe(true)
  })

  it('não renderiza mensagem de vazio quando há dados', () => {
    expect(wrapper.text()).not.toContain('Sem dados para exibição do gráfico')
  })

  it('gera datasets corretos para receita e despesa', () => {
    const chartData = wrapper.vm.chartData

    expect(chartData.labels).toEqual(['Janeiro', 'Fevereiro'])
    expect(chartData.datasets).toHaveLength(2)

    expect(chartData.datasets[0].label).toBe('Receita')
    expect(chartData.datasets[0].data).toEqual([2000, 1800])

    expect(chartData.datasets[1].label).toBe('Despesas')
    expect(chartData.datasets[1].data).toEqual([1200, 1000])
  })
})
