import { mount } from '@vue/test-utils'
import { describe, it, vi, expect, beforeEach } from 'vitest'
import MetricsPage from '@/features/metrics/components/MetricsPage.vue'

vi.mock("@/shared/services/apiClient", () => ({
  apiClient: {
    get: vi.fn(() =>
      Promise.resolve({
        data: {
          active_inactive_customers: {},
          number_of_active_customer_per_month: {},
          monthly_profit: {},
          revenue_versus_expense: {},
        },
      })
    ),
  },
}));

describe('MetricsPage.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(MetricsPage, {
      global: {
        stubs: {
          RevenueExpensesChart: true,
          ActiveInactiveChart: true,
          ActiveCustomersChart: true,
          ProfitChart: true
        }
      }
    })
  })

  it('renderiza o container principal', () => {
    expect(wrapper.find('.chart-area').exists()).toBe(true)
  })

  it('renderiza todos os gráficos', () => {
    const charts = wrapper.findAll('.chart-item')
    expect(charts).toHaveLength(4)
  })

  it('contém os componentes de gráfico corretos', () => {
    expect(wrapper.findComponent({ name: 'RevenueExpensesChart' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ActiveInactiveChart' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ActiveCustomersChart' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ProfitChart' }).exists()).toBe(true)
  })
})
