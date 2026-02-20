import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { type CreateExpenseDTO } from '@/types/expense'
import ExpensesForm from '@/components/forms/ExpensesForm.vue'

vi.mock('@/components/base/form/BaseInput.vue', () => ({
  default: {
    name: 'BaseInput',
    template: '<input />',
    methods: {
      focus: vi.fn()
    }
  }
}))

vi.mock('@/components/base/form/BaseCheckbox.vue', () => ({
  default: {
    name: 'BaseCheckbox',
    template: '<input type="checkbox" />'
  }
}))

vi.mock('@/components/base/form/BaseTextarea.vue', () => ({
  default: {
    name: 'BaseTextarea',
    template: '<textarea />'
  }
}))

describe('ExpensesForm', () => {
  const validModel = {
    name: 'Conta Luz',
    date: '2024-01-10',
    installments: '2',
    value: 200,
    notes: 'Teste',
    month: 'Janeiro',
    paid: "Pago",
    year: 2026
  } as CreateExpenseDTO

  const factory = (model = validModel) =>
    mount(ExpensesForm, {
      props: {
        modelValue: { ...model }
      }
    })

  it('renders form', () => {
    const wrapper = factory()
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('isValid true when required fields are filled', () => {
    const wrapper = factory()
    expect((wrapper.vm as any).isValid).toBe(true)
  })

  it('isValid false when name is empty', () => {
    const wrapper = factory({
      ...validModel,
      name: ''
    })
    expect((wrapper.vm as any).isValid).toBe(false)
  })

  it('isValid false when date is empty', () => {
    const wrapper = factory({
      ...validModel,
      date: ''
    })
    expect((wrapper.vm as any).isValid).toBe(false)
  })

  it('isValid false when value is null', () => {
    const wrapper = factory({
      ...validModel,
      value: null
    })
    expect((wrapper.vm as any).isValid).toBe(false)
  })

  it('invalidInstallments true when hasInstallments and installments not integer', async () => {
    const wrapper = factory({
      ...validModel,
      installments: 'abc'
    })

    ;(wrapper.vm as any).hasInstallments = true
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.invalid').exists()).toBe(true)
  })

  it('invalidInstallments false when installments valid integer', async () => {
    const wrapper = factory({
      ...validModel,
      installments: '3'
    })

    ;(wrapper.vm as any).hasInstallments = true
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.invalid').exists()).toBe(false)
  })
})
