import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { type CreateCustomerDTO } from '@/types/customer'
import CustomersForm from '@/components/forms/CustomersForm.vue'

vi.mock('@/components/base/form/BaseInput.vue', () => ({
  default: {
    name: 'BaseInput',
    template: '<input />',
    methods: {
      focus: vi.fn()
    }
  }
}))

vi.mock('@/components/base/form/BaseSelect.vue', () => ({
  default: {
    name: 'BaseSelect',
    template: '<select><slot /></select>'
  }
}))

vi.mock('@/components/base/form/BaseTextarea.vue', () => ({
  default: {
    name: 'BaseTextarea',
    template: '<textarea />'
  }
}))

vi.mock('@/components/base/form/BaseRadioGroup.vue', () => ({
  default: {
    name: 'BaseRadioGroup',
    template: '<div />'
  }
}))

describe('CustomersForm', () => {
  const validModel = {
    name: 'João',
    frequency: '1x',
    start: '2024-01-01',
    plan: 'Mensal',
    value: 100,
    status: 'Ativo',
    notes: 'Teste'
  } as CreateCustomerDTO;

  const factory = (model = validModel) =>
    mount(CustomersForm, {
      props: {
        modelValue: { ...model }
      }
    })

  it('renders form fields', () => {
    const wrapper = factory()
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('computes isValid correctly when valid', () => {
    const wrapper = factory()
    expect((wrapper.vm as any).isValid).toBe(true)
  })

  it('computes isValid as false when name is empty', () => {
    const wrapper = factory({
      ...validModel,
      name: ''
    })

    expect((wrapper.vm as any).isValid).toBe(false)
  })

  it('computes isValid as false when frequency is empty', () => {
    const wrapper = factory({
      ...validModel,
      frequency: ''
    })

    expect((wrapper.vm as any).isValid).toBe(false)
  })

  it('computes isValid as false when start is empty', () => {
    const wrapper = factory({
      ...validModel,
      start: ''
    })

    expect((wrapper.vm as any).isValid).toBe(false)
  })

  it('computes isValid as false when value is null', () => {
    const wrapper = factory({
      ...validModel,
      value: null
    })

    expect((wrapper.vm as any).isValid).toBe(false)
  })

  it('emits update:modelValue when form changes', async () => {
    const wrapper = factory()

    await wrapper.setProps({
      modelValue: {
        ...validModel,
        name: 'Maria'
      }
    })

    expect(wrapper.props('modelValue').name).toBe('Maria')
  })
})
