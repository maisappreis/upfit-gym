import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { type CreateRevenueDTO } from '@/types/revenue'
import { type Customer } from '@/types/customer'
import RevenueForm from '@/components/forms/RevenueForm.vue'

const FocusableStub = defineComponent({
  name: 'FocusableStub',
  setup(_, { expose }) {
    expose({
      focus: vi.fn()
    })

    return () => h('input')
  }
})

const SelectStub = defineComponent({
  name: 'SelectStub',
  setup(_, { expose, slots }) {
    expose({
      focus: vi.fn()
    })

    return () => h('select', {}, slots.default?.())
  }
})

const TextareaStub = defineComponent({
  name: 'TextareaStub',
  setup() {
    return () => h('textarea')
  }
})

describe('RevenueForm', () => {
  const customersList: Customer[] = [
    {
      id: 1,
      name: 'Cliente A',
      frequency: '1x',
      start: '2024-01-01',
      plan: 'Mensal',
      value: 100,
      status: 'Ativo',
      notes: 'Teste'
    },
    {
      id: 2,
      name: 'Cliente B',
      frequency: '1x',
      start: '2024-01-01',
      plan: 'Mensal',
      value: 100,
      status: 'Ativo',
      notes: 'Teste'
    }
  ]

  const months = ['Janeiro', 'Fevereiro']
  const years = [2024, 2025]

  const validModel = {
    customer: 1,
    value: 1000,
    payment_day: 10,
    month: 'Janeiro',
    year: 2024,
    notes: 'Teste',
    paid: 'Pago'
  } as CreateRevenueDTO

  const factory = (model = validModel) =>
    mount(RevenueForm, {
      props: {
        modelValue: { ...model },
        customersList,
        months,
        years
      },
      global: {
        stubs: {
          BaseInput: FocusableStub,
          BaseSelect: SelectStub,
          BaseTextarea: TextareaStub,
          BaseErrorMessage: true
        }
      }
    })

  it('renders form', () => {
    const wrapper = factory()
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('computes isValid true when all required fields are valid', () => {
    const wrapper = factory()
    expect((wrapper.vm as any).isValid).toBe(true)
  })

  it('isValid false when customer is null', () => {
    const wrapper = factory({
      ...validModel,
      customer: null
    })
    expect((wrapper.vm as any).isValid).toBe(false)
  })

  it('isValid false when year is 0', () => {
    const wrapper = factory({
      ...validModel,
      year: 0
    })
    expect((wrapper.vm as any).isValid).toBe(false)
  })

  it('isValid false when month is empty', () => {
    const wrapper = factory({
      ...validModel,
      month: ''
    })
    expect((wrapper.vm as any).isValid).toBe(false)
  })

  it('isValid false when value is 0', () => {
    const wrapper = factory({
      ...validModel,
      value: 0
    })
    expect((wrapper.vm as any).isValid).toBe(false)
  })

  it('isValid false when payment_day is 0', () => {
    const wrapper = factory({
      ...validModel,
      payment_day: 0
    })
    expect((wrapper.vm as any).isValid).toBe(false)
  })
})
