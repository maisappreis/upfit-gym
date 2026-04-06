import { mount } from "@vue/test-utils"
import { describe, it, expect, vi } from "vitest"
import ActiveCustomersChart from "@/features/metrics/components/charts/ActiveCustomersChart.vue"

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
  data: [1, 1]
}

describe("ActiveCustomersChart", () => {

  const factory = (props?: any) =>
    mount(ActiveCustomersChart, {
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
      "Sem dados para exibição do gráfico de Clientes Ativos"
    )
  })

  it("generates correct datasets", () => {
    const wrapper = factory()

    const chartData = wrapper.vm.chartData

    expect(chartData.labels).toEqual(["Janeiro", "Fevereiro"])
    expect(chartData.datasets).toHaveLength(1)

    expect(chartData.datasets[0].label).toBe("Clientes")
    expect(chartData.datasets[0].data).toEqual([1, 1])
  })
})