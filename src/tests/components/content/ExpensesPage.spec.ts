import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ExpensesPage from '@/components/content/ExpensesPage.vue'

vi.mock('@/stores/api', () => ({
  useApiStore: () => ({
    expenses: [
      {
        id: 1,
        name: 'Aluguel',
        month: 'Janeiro',
        year: 2025,
        paid: 'À pagar',
        date: '2025-01-05',
        value: 1000,
        installments: '',
        notes: ''
      }
    ],
    fetchExpenses: vi.fn()
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

vi.mock('@/services/expense.service', () => ({
  expenseService: {
    create: vi.fn(() => Promise.resolve()),
    update: vi.fn(() => Promise.resolve()),
    delete: vi.fn(() => Promise.resolve())
  }
}))

vi.mock('@/composables/useCrudModal', () => ({
  useCrudModal: () => ({
    isOpen: { value: false },
    isDelete: { value: false },
    mode: { value: 'create' },
    entity: { value: null },
    openCreate: vi.fn(),
    openUpdate: vi.fn(),
    openDelete: vi.fn(),
    close: vi.fn()
  })
}))

describe('ExpensesPage.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(ExpensesPage, {
      global: {
        stubs: {
          BaseButton: {
            template: `<button><slot /></button>`
          },
          FontAwesomeIcon: true,
          ExpensesTable: true,
          ModalCard: true,
          DateFilter: true,
          SearchFilter: true,
          StatusFilter: true,
          ExpensesForm: true
        }
      }
    })
  })

  it('renderiza o botão de nova despesa', () => {
    expect(wrapper.text()).toContain('Nova Despesa')
  })

  it('abre modal de criação ao clicar no botão', async () => {
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')
    expect(wrapper.vm.modalCrud.openCreate).toHaveBeenCalled()
  })

  it('abre modal de update ao emitir update-item', async () => {
    const expense = wrapper.vm.$apiStore?.expenses?.[0] ?? { id: 1 }
    await wrapper.findComponent({ name: 'ExpensesTable' }).vm.$emit('update-item', expense)

    expect(wrapper.vm.modalCrud.openUpdate).toHaveBeenCalledWith(expense)
  })

  it('abre modal de delete ao emitir delete-item', async () => {
    const expense = { id: 1 }
    await wrapper.findComponent({ name: 'ExpensesTable' }).vm.$emit('delete-item', expense)

    expect(wrapper.vm.modalCrud.openDelete).toHaveBeenCalledWith(expense)
  })

  it('cria despesa no submit em modo create', async () => {
    wrapper.vm.formRef = { isValid: true }
    wrapper.vm.modalCrud.mode.value = 'create'

    await wrapper.vm.submitForm()
    await flushPromises()

    expect(wrapper.vm.loadingStore.start).toHaveBeenCalled()
    expect(wrapper.vm.loadingStore.stop).toHaveBeenCalled()
  })

  it('atualiza despesa no submit em modo update', async () => {
    wrapper.vm.formRef = { isValid: true }
    wrapper.vm.modalCrud.mode.value = 'update'
    wrapper.vm.modalCrud.entity.value = { id: 1 }

    await wrapper.vm.submitForm()
    await flushPromises()

    expect(wrapper.vm.loadingStore.start).toHaveBeenCalled()
    expect(wrapper.vm.loadingStore.stop).toHaveBeenCalled()
  })

  it('exclui despesa ao confirmar delete', async () => {
    wrapper.vm.modalCrud.isDelete.value = true
    wrapper.vm.modalCrud.entity.value = { id: 1 }

    await wrapper.vm.deleteExpense()
    await flushPromises()

    expect(wrapper.vm.loadingStore.start).toHaveBeenCalled()
    expect(wrapper.vm.loadingStore.stop).toHaveBeenCalled()
  })
})
