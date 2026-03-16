import { mount } from "@vue/test-utils"
import { describe, it, expect, vi } from "vitest"
import ProfitChart from "@/app/metrics/charts/ProfitChart.vue"

vi.mock("vue-chartjs", () => ({
  Bar: {
    name: "Bar",
    props: ["data"],
    template: '<div class="bar-chart"></div>'
  }
}))

vi.mock("@/utils/dataUtils", () => ({
  getCssVar: vi.fn(() => "#000")
}))

const mockChartData = {
  labels: ["Janeiro", "Fevereiro"],
  data: [1200, 800]
}

describe("ProfitChart", () => {

  const factory = (props?: any) =>
    mount(ProfitChart, {
      props: {
        data: mockChartData,
        ...props
      }
    })

  it("renders chart when data exists", () => {
    const wrapper = factory()

    expect(wrapper.find(".bar-chart").exists()).toBe(true)
  })

  it("does not render empty message when data exists", () => {
    const wrapper = factory()

    expect(wrapper.text()).not.toContain(
      "Sem dados para exibição do gráfico de Lucros"
    )
  })

  it("generates correct chart data", () => {
    const wrapper = factory()

    const chartData = wrapper.vm.chartData

    expect(chartData.labels).toEqual(["Janeiro", "Fevereiro"])
    expect(chartData.datasets).toHaveLength(1)

    expect(chartData.datasets[0].label).toBe("Lucro")
    expect(chartData.datasets[0].data).toEqual([1200, 800])
  })
})