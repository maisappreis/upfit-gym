import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CustomersTable from '@/components/tables/CustomersTable.vue'

vi.mock('@/utils/dateUtils', () => ({
  formatDate: (value: string) => `formatted-${value}`
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

describe('CustomersTable', () => {
  const mockData = [
    {
      id: 1,
      name: 'Cliente A',
      frequency: 'Mensal',
      start: '2024-01-01',
      plan: 'Premium',
      value: 100,
      status: 'Ativo',
      notes: 'Observação A'
    },
    {
      id: 2,
      name: 'Cliente B',
      frequency: 'Anual',
      start: '2024-02-01',
      plan: 'Basic',
      value: 200,
      status: 'Inativo',
      notes: null
    }
  ] as any

  const factory = (data = mockData) =>
    mount(CustomersTable, {
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
              <div class="base-table">
                <slot 
                  name="cell-start" 
                  v-for="row in data" 
                  :row="row" 
                />
                <slot 
                  name="cell-value" 
                  v-for="row in data" 
                  :row="row" 
                />
                <slot 
                  name="cell-status" 
                  v-for="row in data" 
                  :row="row" 
                />
                <slot 
                  name="cell-actions" 
                  v-for="row in data" 
                  :row="row" 
                />
                <slot name="footer" />
              </div>
            `
          },
          PaginationTable: true,
          TooltipModal: true,
          'font-awesome-icon': true
        }
      }
    })

  it('renders table when data exists', () => {
    const wrapper = factory()
    expect(wrapper.findComponent({ name: 'BaseTable' }).exists()).toBe(true)
  })

  it('renders formatted date', () => {
    const wrapper = factory()
    expect(wrapper.text()).toContain('formatted-2024-01-01')
  })

  it('renders formatted value with currency', () => {
    const wrapper = factory()
    expect(wrapper.text()).toContain('R$ 100,00')
  })

  it('renders status correctly', () => {
    const wrapper = factory()
    expect(wrapper.text()).toContain('Ativo')
    expect(wrapper.text()).toContain('Inativo')
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

  it('shows not found message when data is empty', () => {
    const wrapper = factory([])
    expect(wrapper.text()).toContain('Nenhum resultado foi encontrado.')
  })
})
