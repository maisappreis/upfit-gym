import { mount } from "@vue/test-utils"
import { describe, it, expect, vi } from "vitest"
import ActiveInactiveChart from "@/features/metrics/components/charts/ActiveInactiveChart.vue"

vi.mock("vue-chartjs", () => ({
  Pie: {
    name: "PieChart",
    props: ["data"],
    template: '<div class="pie-chart"></div>'
  }
}))

vi.mock("@/shared/utils/dataUtils", () => ({
  getCssVar: vi.fn(() => "#000")
}))

const mockChartData = {
  labels: ["Ativos", "Inativos"],
  data: [5, 3]
}

describe("ActiveInactiveChart", () => {

  const factory = (props?: any) =>
    mount(ActiveInactiveChart, {
      props: {
        data: mockChartData,
        ...props
      }
    })

  it("renders chart when data exists", () => {
    const wrapper = factory()

    expect(wrapper.find(".pie-chart").exists()).toBe(true)
  })

  it("does not render empty message when data exists", () => {
    const wrapper = factory()

    expect(wrapper.text()).not.toContain(
      "Sem dados para exibição do gráfico de clientes Ativos x Inativos"
    )
  })

  it("generates correct chart data", () => {
    const wrapper = factory()

    const chartData = wrapper.vm.chartData

    expect(chartData.labels).toEqual(["Ativos", "Inativos"])
    expect(chartData.datasets).toHaveLength(1)

    expect(chartData.datasets[0].label).toBe("Clientes")
    expect(chartData.datasets[0].data).toEqual([5, 3])
  })
})