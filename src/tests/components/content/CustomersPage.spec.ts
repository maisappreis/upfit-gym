import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CustomersPage from '@/components/content/CustomersPage.vue'

vi.mock('@/stores/api', () => ({
  useApiStore: () => ({
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
    fetchRevenue: vi.fn(),
    canDeleteCustomer: vi.fn(() => true)
  })
}))

vi.mock('@/stores/alert', () => ({
  useAlertStore: () => ({
    success: vi.fn(),
    error: vi.fn()
  })
}))

vi.mock('@/stores/loading', () => ({
  useLoadingStore: () => ({
    isLoading: false,
    start: vi.fn(),
    stop: vi.fn()
  })
}))

vi.mock('@/services/customer.service', () => ({
  customerService: {
    create: vi.fn(() => Promise.resolve({ id: 3 })),
    update: vi.fn(() => Promise.resolve()),
    delete: vi.fn(() => Promise.resolve())
  }
}))

vi.mock('@/services/revenue.service', () => ({
  revenueService: {
    create: vi.fn(() => Promise.resolve())
  }
}))

vi.mock('@/composables/useCrudModal', () => ({
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

  it('cria cliente quando submitForm é chamado em modo create', async () => {
    wrapper.vm.formRef = { isValid: true }
    wrapper.vm.modalCrud.mode.value = 'create'

    await wrapper.vm.submitForm()
    await flushPromises()

    expect(wrapper.vm.loadingStore.start).toHaveBeenCalled()
    expect(wrapper.vm.loadingStore.stop).toHaveBeenCalled()
  })

  it('atualiza cliente quando submitForm é chamado em modo update', async () => {
    wrapper.vm.formRef = { isValid: true }
    wrapper.vm.modalCrud.mode.value = 'update'
    wrapper.vm.modalCrud.entity.value = { id: 1 }

    await wrapper.vm.submitForm()
    await flushPromises()

    expect(wrapper.vm.loadingStore.start).toHaveBeenCalled()
    expect(wrapper.vm.loadingStore.stop).toHaveBeenCalled()
  })

  it('exclui cliente ao confirmar delete', async () => {
    wrapper.vm.modalCrud.isDelete.value = true
    wrapper.vm.modalCrud.entity.value = { id: 1 }

    await wrapper.vm.confirmDelete()
    await flushPromises()

    expect(wrapper.vm.loadingStore.start).toHaveBeenCalled()
    expect(wrapper.vm.loadingStore.stop).toHaveBeenCalled()
  })
})
