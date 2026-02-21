import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RevenuePage from '@/components/content/RevenuePage.vue'

vi.mock('@/stores/api', () => ({
  useApiStore: () => ({
    customers: [{ id: 1, name: 'João', value: 100, status: 'Ativo', start: '', plan: 'Mensal' }],
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
    fetchRevenue: vi.fn(),
    fetchData: vi.fn()
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
    update: vi.fn(() => Promise.resolve())
  }
}))

vi.mock('@/services/revenue.service', () => ({
  revenueService: {
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
    const revenue = wrapper.vm.apiStore.revenue[0]
    await wrapper.findComponent({ name: 'RevenuesTable' }).vm.$emit('update-item', revenue)

    expect(wrapper.vm.modalCrud.openUpdate).toHaveBeenCalledWith(revenue)
  })

  it('abre modal de delete ao emitir delete-item', async () => {
    const revenue = wrapper.vm.apiStore.revenue[0]
    await wrapper.findComponent({ name: 'RevenuesTable' }).vm.$emit('delete-item', revenue)

    expect(wrapper.vm.modalCrud.openDelete).toHaveBeenCalledWith(revenue)
  })

  it('cria receita no submit em modo create', async () => {
    wrapper.vm.formRef = { isValid: true }
    wrapper.vm.modalCrud.mode.value = 'create'

    await wrapper.vm.submitForm()
    await flushPromises()

    expect(wrapper.vm.loadingStore.start).toHaveBeenCalled()
    expect(wrapper.vm.loadingStore.stop).toHaveBeenCalled()
  })

  it('atualiza receita no submit em modo update', async () => {
    wrapper.vm.formRef = { isValid: true }
    wrapper.vm.modalCrud.mode.value = 'update'
    wrapper.vm.modalCrud.entity.value = wrapper.vm.apiStore.revenue[0]

    await wrapper.vm.submitForm()
    await flushPromises()

    expect(wrapper.vm.loadingStore.start).toHaveBeenCalled()
    expect(wrapper.vm.loadingStore.stop).toHaveBeenCalled()
  })

  it('exclui receita ao confirmar delete', async () => {
    wrapper.vm.modalCrud.isDelete.value = true
    wrapper.vm.modalCrud.entity.value = wrapper.vm.apiStore.revenue[0]

    await wrapper.vm.deleteRevenue()
    await flushPromises()

    expect(wrapper.vm.loadingStore.start).toHaveBeenCalled()
    expect(wrapper.vm.loadingStore.stop).toHaveBeenCalled()
  })

  it('mostra confirmação ao alterar valor da receita', async () => {
    wrapper.vm.modalCrud.mode.value = 'update'
    wrapper.vm.modalCrud.entity.value = wrapper.vm.apiStore.revenue[0]
    wrapper.vm.revenueForm.value = 200

    await wrapper.vm.updateRevenue(10, { value: 200 } as any)
    await flushPromises()

    expect(wrapper.vm.showConfirmationOfValueChange).toBe(true)
  })
})
