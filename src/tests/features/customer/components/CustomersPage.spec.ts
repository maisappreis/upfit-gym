import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CustomersPage from '@/features/customer/components/CustomersPage.vue'

vi.mock('@/features/customer/stores/useCustomerStore', () => ({
  useCustomerStore: () => ({
    customers: [
      {
        id: 1,
        name: 'João',
        status: 'Ativo',
        frequency: '',
        start: '',
        plan: 'Mensal',
        value: 100,
        notes: ''
      },
      {
        id: 2,
        name: 'Maria',
        status: 'Inativo',
        frequency: '',
        start: '',
        plan: 'Mensal',
        value: 200,
        notes: ''
      }
    ],
    fetchCustomers: vi.fn(),
  })
}))

vi.mock('@/features/customer/domain/canDeleteCustomer', () => ({
  canDeleteCustomer: () => ({
    canDeleteCustomer: vi.fn(() => true)
  })
}))

vi.mock('@/features/revenue/stores/useRevenueStore', () => ({
  useRevenueStore: () => ({
    fetchRevenue: vi.fn()
  })
}))

vi.mock('@/shared/stores/alert', () => ({
  useAlertStore: () => ({
    success: vi.fn(),
    error: vi.fn()
  })
}))

vi.mock('@/shared/stores/loading', () => ({
  useLoadingStore: () => ({
    isLoading: false,
    start: vi.fn(),
    stop: vi.fn()
  })
}))

vi.mock('@/features/customer/services/customer.service', () => ({
  customerService: {
    create: vi.fn(() => Promise.resolve({ id: 3 })),
    update: vi.fn(() => Promise.resolve()),
    delete: vi.fn(() => Promise.resolve())
  }
}))

vi.mock('@/features/revenue/services/revenue.service', () => ({
  revenueService: {
    create: vi.fn(() => Promise.resolve())
  }
}))

vi.mock('@/shared/composables/useCrudModal', () => ({
  useCrudModal: () => ({
    isOpen: { value: false },
    isDelete: { value: false },
    deleteIsBlocked: { value: false },
    mode: { value: 'create' },
    entity: { value: null },
    openCreate: vi.fn(),
    openUpdate: vi.fn(),
    openDelete: vi.fn(),
    close: vi.fn()
  })
}))

describe('CustomersPage.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(CustomersPage, {
      global: {
        stubs: {
          BaseButton: {
            template: `<button><slot /></button>`
          },
          CustomerModal: {
            template: '<div></div>'
          },
          CustomersTable: true,
          SearchFilter: true,
          StatusFilter: true,
          ModalCard: true,
          CustomersForm: true,
          FontAwesomeIcon: true
        }
      }
    })
  })

  it('renderiza o botão de novo cliente', () => {
    expect(wrapper.text()).toContain('Novo Cliente')
  })

  it('filtra clientes ativos por padrão', () => {
    const table = wrapper.findComponent({ name: 'CustomersTable' })
    expect(table.props('data')).toHaveLength(1)
    expect(table.props('data')[0].name).toBe('João')
  })

  it('abre modal de criação ao clicar no botão', async () => {
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    await button.trigger('click')
    expect(wrapper.vm.modalCrud.openCreate).toHaveBeenCalled()
  })

  it('abre modal de update ao emitir update-item', async () => {
    const customer = { id: 1, name: 'João', status: 'Ativo' }
    await wrapper.findComponent({ name: 'CustomersTable' }).vm.$emit('update-item', customer)
    expect(wrapper.vm.modalCrud.openUpdate).toHaveBeenCalledWith(customer)
  })

  it('abre modal de delete ao emitir delete-item', async () => {
    const customer = { id: 1, name: 'João', status: 'Ativo' }
    await wrapper.findComponent({ name: 'CustomersTable' }).vm.$emit('delete-item', customer)
    expect(wrapper.vm.modalCrud.openDelete).toHaveBeenCalled()
  })
})
