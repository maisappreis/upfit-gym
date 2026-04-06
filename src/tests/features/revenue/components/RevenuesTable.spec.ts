import { describe, it, expect, vi, beforeEach } from "vitest"
import { shallowMount } from "@vue/test-utils"
import { ref } from "vue"

import RevenuesTable from "@/features/revenue/components/RevenuesTable.vue"
import { revenueService } from "@/features/revenue/services/revenue.service"
import { useRevenueStore } from "@/features/revenue/stores/useRevenueStore"
import { useLoadingStore } from "@/shared/stores/loading"

const fetchRevenueMock = vi.fn()
const loadingStartMock = vi.fn()
const loadingStopMock = vi.fn()
const openUpdateMock = vi.fn()
const closeMock = vi.fn()

vi.mock("@/features/revenue/stores/useRevenueStore", () => ({
  useRevenueStore: () => ({
    fetchRevenue: fetchRevenueMock
  })
}))

vi.mock("@/shared/stores/loading", () => ({
  useLoadingStore: () => ({
    isLoading: false,
    start: loadingStartMock,
    stop: loadingStopMock
  })
}))

const alertSuccessMock = vi.fn()
const alertErrorMock = vi.fn()

vi.mock("@/shared/stores/alert", () => ({
  useAlertStore: () => ({
    success: alertSuccessMock,
    error: alertErrorMock
  })
}))

vi.mock("@/features/revenue/services/revenue.service", () => ({
  revenueService: {
    update: vi.fn(),
    create: vi.fn()
  }
}))

vi.mock("@/shared/composables/useCrudModal", () => ({
  useCrudModal: () => ({
    isOpen: { value: false },
    openUpdate: openUpdateMock,
    close: closeMock
  })
}))

vi.mock("@/shared/composables/useTooltipAnchors", () => ({
  useTooltipAnchors: () => ({
    hoveredId: ref(null),
    refsMap: {},
    setRef: vi.fn()
  })
}))

vi.mock("@/shared/composables/useTablePagination", () => ({
  useTablePagination: (dataFn: any) => ({
    itemsPerPage: ref(10),
    currentPage: ref(1),
    paginatedData: ref(dataFn())
  })
}))

vi.mock("@/shared/utils/dateUtils", () => ({
  formatDate: vi.fn((v: string) => v),
  getNextMonth: vi.fn(() => ({ month: "Fevereiro", year: 2024 }))
}))

const mockRevenue = {
  id: 1,
  customer: 1,
  year: 2024,
  month: "Janeiro",
  name: "Cliente Teste",
  start: "2024-01-01",
  plan: "Mensal",
  payment_day: 10,
  value: 100,
  paid: "Pago",
  status: "Ativo",
  notes: "Observação"
}

const factory = (props?: any) =>
  shallowMount(RevenuesTable, {
    props: {
      data: [],
      searchedField: [],
      ...props
    },
    global: {
      stubs: {
        BaseTable: {
          name: "BaseTable",
          props: ["data"],
          template: `
            <div>
              <div v-for="row in data" :key="row.id">

                <slot name="cell-paid" :row="row" />
                <slot name="cell-actions" :row="row" />

              </div>

              <slot name="footer" />
            </div>
          `
        },
        // BaseTable: {
        //   name: "BaseTable",
        //   props: ["data"],
        //   template: `
        //     <div>
        //       <div v-for="row in data" :key="row.id">

        //         <span class="status" @click="$emit('status-click', row)">
        //           {{ row.paid }}
        //         </span>

        //         <button class="edit-icon" @click="$emit('update-item', row)">
        //           edit
        //         </button>

        //         <button class="delete-icon" @click="$emit('delete-item', row)">
        //           delete
        //         </button>

        //         <slot name="cell-paid" :row="row" />
        //         <slot name="cell-actions" :row="row" />
        //       </div>

        //       <slot name="footer" />
        //     </div>
        //   `
        // },
        PaginationTable: true,
        TooltipModal: true,
        BaseButton: true,
        ModalCard: true,
        "font-awesome-icon": {
          template: `<button class="fa-icon" @click="$emit('click')" />`
        }
      }
    }
  })

describe("RevenuesTable", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders table when data exists", () => {
    const wrapper = factory({ data: [mockRevenue] })

    expect(wrapper.findComponent({ name: "BaseTable" }).exists()).toBe(true)
  })

  it("renders not found message when no data", () => {
    const wrapper = factory({ data: [] })

    expect(wrapper.find(".not-found").exists()).toBe(true)
    expect(wrapper.text()).toContain("Nenhum resultado foi encontrado.")
  })

  it("emits update-item when edit icon is clicked", async () => {
    const wrapper = factory({ data: [mockRevenue] })

    const icons = wrapper.findAll(".fa-icon")
    await icons[1].trigger("click")

    expect(wrapper.emitted("update-item")).toBeTruthy()
  })

  it("emits delete-item when delete icon is clicked", async () => {
    const wrapper = factory({ data: [mockRevenue] })

    const icons = wrapper.findAll(".fa-icon")
    await icons[2].trigger("click")

    expect(wrapper.emitted("delete-item")).toBeTruthy()
  })

  it("calls openUpdate when paid status is clicked", async () => {
    const wrapper = factory({
      data: [{ ...mockRevenue, paid: "À pagar" }]
    })

    await wrapper.find(".status").trigger("click")

    expect(openUpdateMock).toHaveBeenCalledTimes(1)
  })

  it("changes paid status and calls services", async () => {
    const wrapper = factory({
      data: [{ ...mockRevenue, paid: "À pagar" }]
    })

    await wrapper.find(".status").trigger("click")

    await wrapper.vm.changePaidStatus()

    const revenueStore = useRevenueStore()
    const loadingStore = useLoadingStore()

    expect(revenueService.update).toHaveBeenCalled()
    expect(revenueStore.fetchRevenue).toHaveBeenCalled()
    expect(loadingStore.start).toHaveBeenCalled()
    expect(loadingStore.stop).toHaveBeenCalled()
  })
})