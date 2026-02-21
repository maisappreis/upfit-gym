import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ActiveCustomersChart from '@/components/charts/ActiveCustomersChart.vue'

vi.mock('@/stores/api', () => ({
  useApiStore: () => ({
    customers: [
      { id: 1, name: 'João', status: 'Ativo' },
      { id: 2, name: 'Maria', status: 'Inativo' }
    ],
    revenue: [
      { id: 1, customer: 1, month: 'Janeiro', year: 2025, paid: 'Pago' },
      { id: 2, customer: 1, month: 'Fevereiro', year: 2025, paid: 'Pago' },
      { id: 3, customer: 2, month: 'Janeiro', year: 2025, paid: 'Pago' },
      { id: 4, customer: 1, month: 'Janeiro', year: 2025, paid: 'À pagar' }
    ]
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

describe('ActiveCustomersChart.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(ActiveCustomersChart)
  })

  it('renderiza o gráfico quando há dados', () => {
    expect(wrapper.find('.line-chart').exists()).toBe(true)
  })

  it('não renderiza mensagem de vazio quando há dados', () => {
    expect(wrapper.text()).not.toContain('Sem dados para exibição do gráfico')
  })

  it('gera datasets corretamente', () => {
    const chartData = wrapper.vm.chartData
    expect(chartData.datasets).toHaveLength(1)
    expect(chartData.datasets[0].data).toEqual([1, 1])
  })
})
