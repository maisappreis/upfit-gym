import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ActiveInactiveChart from '@/components/charts/ActiveInactiveChart.vue'

vi.mock('@/composables/useChart', () => ({
  useChart: () => ({
    activeCustomers: { value: 5 },
    inactiveCustomers: { value: 3 }
  })
}))

vi.mock('vue-chartjs', () => ({
  Pie: {
    name: 'PieChart',
    template: '<div class="pie-chart"></div>'
  }
}))

vi.mock('@/utils/dataUtils', () => ({
  getCssVar: vi.fn(() => '#000')
}))

describe('ActiveInactiveChart.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(ActiveInactiveChart)
  })

  it('renderiza o gráfico quando há dados', () => {
    expect(wrapper.find('.pie-chart').exists()).toBe(true)
  })

  it('não renderiza mensagem de vazio quando há dados', () => {
    expect(wrapper.text()).not.toContain('Sem dados para exibição do gráfico')
  })

  it('gera dados corretos para o gráfico', () => {
    const chartData = wrapper.vm.chartData
    expect(chartData.labels).toEqual(['Ativos', 'Inativos'])
    expect(chartData.datasets[0].data).toEqual([5, 3])
  })
})
