import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseCheckbox from '@/components/base/form/BaseCheckbox.vue'

describe('BaseCheckbox', () => {
  it('renders label when provided', () => {
    const wrapper = mount(BaseCheckbox, {
      props: {
        label: 'Ativo'
      }
    })

    expect(wrapper.find('label').exists()).toBe(true)
    expect(wrapper.text()).toContain('Ativo')
  })

  it('does not render label when not provided', () => {
    const wrapper = mount(BaseCheckbox)

    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('renders error message when error prop is passed', () => {
    const wrapper = mount(BaseCheckbox, {
      props: {
        error: 'Campo obrigatório'
      }
    })

    expect(wrapper.text()).toContain('Campo obrigatório')
  })

  it('checkbox reflects modelValue', async () => {
    const wrapper = mount(BaseCheckbox, {
      props: {
        modelValue: true
      }
    })

    const checkbox = wrapper.get('input[type="checkbox"]')
    expect((checkbox.element as HTMLInputElement).checked).toBe(true)
  })

  it('emits update:modelValue when changed', async () => {
    const wrapper = mount(BaseCheckbox, {
      props: {
        modelValue: false
      }
    })

    const checkbox = wrapper.get('input[type="checkbox"]')

    await checkbox.setValue(true)

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
  })
})
