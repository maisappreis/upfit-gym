import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ExpensesTable from '@/components/tables/ExpensesTable.vue'

vi.mock('@/services/expense.service', () => {
  return {
    expenseService: {
      update: vi.fn().mockResolvedValue(undefined),
      create: vi.fn().mockResolvedValue(undefined)
    }
  }
})

vi.mock('@/stores/api', () => {
  return {
    useApiStore: () => ({
      fetchExpenses: vi.fn().mockResolvedValue(undefined)
    })
  }
})

vi.mock('@/stores/alert', () => {
  return {
    useAlertStore: () => ({
      success: vi.fn(),
      error: vi.fn()
    })
  }
})

vi.mock('@/stores/loading', () => {
  return {
    useLoadingStore: () => ({
      isLoading: false,
      start: vi.fn(),
      stop: vi.fn()
    })
  }
})

vi.mock('@/utils/dateUtils', () => ({
  formatDate: (v: string) => `formatted-${v}`,
  getNextMonth: () => ({
    year: 2024,
    month: 'Fevereiro',
    monthNumber: '02'
  })
}))

vi.mock('@/composables/useTooltipAnchors', () => ({
  useTooltipAnchors: () => ({
    hoveredId: null,
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

vi.mock('@/composables/useCrudModal', () => ({
  useCrudModal: () => ({
    isOpen: { value: false },
    openUpdate: vi.fn(),
    close: vi.fn()
  })
}))

describe('ExpensesTable', () => {
  const mockData = [
    {
      id: 1,
      year: 2024,
      month: 'Janeiro',
      name: 'Internet',
      date: '2024-01-10',
      installments: '',
      value: 150,
      paid: 'À pagar',
      notes: 'Teste'
    }
  ] as any

  const factory = (data = mockData) =>
    mount(ExpensesTable, {
      props: {
        data,
        searchedField: []
      },
      global: {
        stubs: {
          BaseTable: {
            name: 'BaseTable',
            props: ['data', 'columns'],
            template: `
              <div>
                <slot name="cell-date" v-for="row in data" :row="row" />
                <slot name="cell-value" v-for="row in data" :row="row" />
                <slot name="cell-paid" v-for="row in data" :row="row" />
                <slot name="cell-actions" v-for="row in data" :row="row" />
                <slot name="footer" />
              </div>
            `
          },
          PaginationTable: true,
          TooltipModal: true,
          BaseButton: {
            template: '<button @click="$emit(\'click\')"><slot /></button>'
          },
          ModalCard: {
            props: ['modelValue'],
            template: '<div><slot name="header" /><slot /><slot name="footer" /></div>'
          },
          'font-awesome-icon': true
        }
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders table when data exists', () => {
    const wrapper = factory()
    expect(wrapper.findComponent({ name: 'BaseTable' }).exists()).toBe(true)
  })

  it('renders formatted date and value', () => {
    const wrapper = factory()
    expect(wrapper.text()).toContain('formatted-2024-01-10')
    expect(wrapper.text()).toContain('R$ 150,00')
  })

  it('emits update-item event', async () => {
    const wrapper = factory()
    const icons = wrapper.findAll('.table-icon')
    await icons[1].trigger('click')
    expect(wrapper.emitted('update-item')).toBeTruthy()
  })

  it('emits delete-item event', async () => {
    const wrapper = factory()
    const icons = wrapper.findAll('.table-icon')
    await icons[2].trigger('click')
    expect(wrapper.emitted('delete-item')).toBeTruthy()
  })

  it('shows not found when empty', () => {
    const wrapper = factory([])
    expect(wrapper.text()).toContain('Nenhum resultado foi encontrado.')
  })
})
