import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RevenuePage from '@/features/revenue/components/RevenuePage.vue'

vi.mock('@/features/customer/stores/useCustomerStore', () => ({
  useCustomerStore: () => ({
    customers: [{ id: 1, name: 'João', value: 100, status: 'Ativo', start: '', plan: 'Mensal' }],
  })
}))

vi.mock('@/features/revenue/stores/useRevenueStore', () => ({
  useRevenueStore: () => ({
    revenue: [
      {
        id: 10,
        customer: 1,
        month: 'Janeiro',
        year: 2025,
        paid: 'À pagar',
        value: 100,
        payment_day: 5,
        notes: ''
      }
    ],
    fetchRevenue: vi.fn()
  })
}))

vi.mock('@/shared/composables/useAppData', () => ({
  useAppData: () => ({
    fetchData: vi.fn()
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
    update: vi.fn(() => Promise.resolve())
  }
}))

vi.mock('@/features/revenue/services/revenue.service', () => ({
  revenueService: {
    create: vi.fn(() => Promise.resolve()),
    update: vi.fn(() => Promise.resolve()),
    delete: vi.fn(() => Promise.resolve())
  }
}))

vi.mock('@/shared/composables/useCrudModal', () => ({
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

describe('RevenuePage.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(RevenuePage, {
      global: {
        stubs: {
          BaseButton: {
            template: `<button><slot /></button>`
          },
          FontAwesomeIcon: true,
          RevenuesTable: true,
          ModalCard: true,
          DateFilter: true,
          SearchFilter: true,
          StatusFilter: true,
          RevenueForm: true
        }
      }
    })
  })

  it('renderiza o botão de nova receita', () => {
    expect(wrapper.text()).toContain('Nova Receita')
  })

  it('abre modal de criação ao clicar no botão', async () => {
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')
    expect(wrapper.vm.modalCrud.openCreate).toHaveBeenCalled()
  })

  it('abre modal de update ao emitir update-item', async () => {
    const revenue = wrapper.vm.revenueStore.revenue[0]
    await wrapper.findComponent({ name: 'RevenuesTable' }).vm.$emit('update-item', revenue)

    expect(wrapper.vm.modalCrud.openUpdate).toHaveBeenCalledWith(revenue)
  })

  it('abre modal de delete ao emitir delete-item', async () => {
    const revenue = wrapper.vm.revenueStore.revenue[0]
    await wrapper.findComponent({ name: 'RevenuesTable' }).vm.$emit('delete-item', revenue)

    expect(wrapper.vm.modalCrud.openDelete).toHaveBeenCalledWith(revenue)
  })

  it('exclui receita ao confirmar delete', async () => {
    wrapper.vm.modalCrud.isDelete.value = true
    wrapper.vm.modalCrud.entity.value = wrapper.vm.revenueStore.revenue[0]

    await wrapper.vm.deleteRevenue()
    await flushPromises()

    expect(wrapper.vm.loadingStore.start).toHaveBeenCalled()
    expect(wrapper.vm.loadingStore.stop).toHaveBeenCalled()
  })
})
