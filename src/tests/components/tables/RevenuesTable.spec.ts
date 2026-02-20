import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import RevenuesTable from '@/components/tables/RevenuesTable.vue'
import { revenueService } from '@/services/revenue.service'
import { useApiStore } from '@/stores/api'
import { useLoadingStore } from '@/stores/loading'

const fetchRevenueMock = vi.fn()
const loadingStartMock = vi.fn()
const loadingStopMock = vi.fn()
const openUpdateMock = vi.fn()
const closeMock = vi.fn()

vi.mock('@/stores/api', () => ({
  useApiStore: () => ({
    fetchRevenue: fetchRevenueMock
  })
}))

vi.mock('@/stores/loading', () => ({
  useLoadingStore: () => ({
    isLoading: false,
    start: loadingStartMock,
    stop: loadingStopMock
  })
}))

vi.mock('@/services/revenue.service', () => ({
  revenueService: {
    update: vi.fn(),
    create: vi.fn()
  }
}))

vi.mock('@/composables/useCrudModal', () => ({
  useCrudModal: () => ({
    isOpen: { value: false },
    openUpdate: openUpdateMock,
    close: closeMock
  })
}))

vi.mock('@/composables/useTooltipAnchors', () => ({
  useTooltipAnchors: () => ({
    hoveredId: { value: null },
    refsMap: {},
    setRef: vi.fn()
  })
}))

vi.mock('@/composables/useTablePagination', () => ({
  useTablePagination: (dataFn: any) => ({
    itemsPerPage: 10,
    currentPage: 1,
    paginatedData: dataFn()
  })
}))

vi.mock('@/utils/dateUtils', () => ({
  formatDate: vi.fn((v: string) => v),
  getNextMonth: vi.fn(() => ({ month: 'Fevereiro', year: 2024 }))
}))


const factory = (props?: any) =>
  shallowMount(RevenuesTable, {
    props: {
      data: [],
      searchedField: [],
      ...props
    },
    global: {
      stubs: {
        BaseTable: false,
        PaginationTable: true,
        TooltipModal: true,
        BaseButton: true,
        ModalCard: true,
        'font-awesome-icon': {
          template: '<button class="fa-icon" @click="$emit(\'click\')" />'
        }
      }
    }
  })

const mockRevenue = {
  id: 1,
  customer: 1,
  year: 2024,
  month: 'Janeiro',
  name: 'Cliente Teste',
  start: '2024-01-01',
  plan: 'Mensal',
  payment_day: 10,
  value: 100,
  paid: 'Pago',
  status: 'Ativo',
  notes: 'Observação'
}

describe('RevenuesTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders table when data exists', () => {
    const wrapper = factory({ data: [mockRevenue] })
    expect(wrapper.findComponent({ name: 'BaseTable' }).exists()).toBe(true)
  })

  it('renders not found message when no data', () => {
    const wrapper = factory({ data: [] })
    expect(wrapper.find('.not-found').exists()).toBe(true)
    expect(wrapper.text()).toContain('Nenhum resultado foi encontrado.')
  })

  it('emits update-item when edit icon is clicked', async () => {
    const wrapper = factory({ data: [mockRevenue] })
    const icons = wrapper.findAll('.fa-icon')
    await icons[1].trigger('click')
    expect(wrapper.emitted('update-item')).toBeTruthy()
  })

  it('emits delete-item when delete icon is clicked', async () => {
    const wrapper = factory({ data: [mockRevenue] })
    const icons = wrapper.findAll('.fa-icon')
    await icons[2].trigger('click')
    expect(wrapper.emitted('delete-item')).toBeTruthy()
  })

  it('calls openUpdate when paid status is clicked', async () => {
    const wrapper = factory({
      data: [{ ...mockRevenue, paid: 'À pagar' }]
    })

    await wrapper.find('.status').trigger('click')

    expect(openUpdateMock).toHaveBeenCalledTimes(1)
  })

  it('changes paid status and calls services', async () => {
    const wrapper = factory({
      data: [{ ...mockRevenue, paid: 'À pagar' }]
    })

    await wrapper.find('.status').trigger('click')
    await wrapper.vm.changePaidStatus()

    const apiStore = useApiStore()
    const loadingStore = useLoadingStore()

    expect(revenueService.update).toHaveBeenCalled()
    expect(apiStore.fetchRevenue).toHaveBeenCalled()
    expect(loadingStore.start).toHaveBeenCalled()
    expect(loadingStore.stop).toHaveBeenCalled()
  })
})