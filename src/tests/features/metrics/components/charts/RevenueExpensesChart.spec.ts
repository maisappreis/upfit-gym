import { mount } from "@vue/test-utils"
import { describe, it, expect, vi } from "vitest"
import RevenueExpensesChart from "@/features/metrics/components/charts/RevenueExpensesChart.vue"

vi.mock("vue-chartjs", () => ({
  Line: {
    name: "LineChart",
    props: ["data"],
    template: '<div class="line-chart"></div>'
  }
}))

vi.mock("@/shared/utils/dataUtils", () => ({
  getCssVar: vi.fn(() => "#000")
}))

const mockChartData = {
  labels: ["Janeiro", "Fevereiro"],
  data: {
    revenue: [2000, 1800],
    expense: [1200, 1000]
  }
}

describe("RevenueExpensesChart", () => {

  const factory = (props?: any) =>
    mount(RevenueExpensesChart, {
      props: {
        data: mockChartData,
        ...props
      }
    })

  it("renders chart when data exists", () => {
    const wrapper = factory()

    expect(wrapper.find(".line-chart").exists()).toBe(true)
  })

  it("does not render empty message when data exists", () => {
    const wrapper = factory()

    expect(wrapper.text()).not.toContain(
      "Sem dados para exibição do gráfico de Receitas x Despesas"
    )
  })

  it("generates correct datasets for revenue and expenses", () => {
    const wrapper = factory()

    const chartData = wrapper.vm.chartData

    expect(chartData.labels).toEqual(["Janeiro", "Fevereiro"])
    expect(chartData.datasets).toHaveLength(2)

    expect(chartData.datasets[0].label).toBe("Receita")
    expect(chartData.datasets[0].data).toEqual([2000, 1800])

    expect(chartData.datasets[1].label).toBe("Despesas")
    expect(chartData.datasets[1].data).toEqual([1200, 1000])
  })
})