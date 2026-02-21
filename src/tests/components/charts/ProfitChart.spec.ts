import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProfitChart from '@/components/charts/ProfitChart.vue'

vi.mock('@/composables/useChart', () => ({
  useChart: () => ({
    monthlyProfit: {
      value: [
        { month: 'Janeiro', sum: 1200 },
        { month: 'Fevereiro', sum: 800 }
      ]
    }
  })
}))

vi.mock('vue-chartjs', () => ({
  Bar: {
    name: 'Bar',
    template: '<div class="bar-chart"></div>'
  }
}))

vi.mock('@/utils/dataUtils', () => ({
  getCssVar: vi.fn(() => '#000')
}))

describe('ProfitChart.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(ProfitChart)
  })

  it('renderiza o gráfico quando há dados', () => {
    expect(wrapper.find('.bar-chart').exists()).toBe(true)
  })

  it('não renderiza mensagem de vazio quando há dados', () => {
    expect(wrapper.text()).not.toContain('Sem dados para exibição do gráfico')
  })

  it('gera dados corretos para o gráfico', () => {
    const chartData = wrapper.vm.chartData
    expect(chartData.labels).toEqual(['Janeiro', 'Fevereiro'])
    expect(chartData.datasets[0].data).toEqual([1200, 800])
  })
})
