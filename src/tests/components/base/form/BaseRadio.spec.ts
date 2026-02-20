import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseRadio from '@/components/base/form/BaseRadio.vue'

vi.mock('@/features/setupFormComponent', () => ({
  default: (props: any, { emit }: any) => ({
    updateValue: () => {
      emit('update:modelValue', props.value)
    }
  })
}))

describe('BaseRadio', () => {
  it('renders label when provided', () => {
    const wrapper = mount(BaseRadio, {
      props: {
        label: 'Mensal',
        value: 'Mensal'
      }
    })

    expect(wrapper.find('label').exists()).toBe(true)
    expect(wrapper.text()).toContain('Mensal')
  })

  it('does not render label when not provided', () => {
    const wrapper = mount(BaseRadio, {
      props: { value: 'A' }
    })

    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('renders error message when error prop is passed', () => {
    const wrapper = mount(BaseRadio, {
      props: {
        value: 'A',
        error: 'Campo obrigatório'
      }
    })

    expect(wrapper.text()).toContain('Campo obrigatório')
  })

  it('is checked when modelValue equals value', () => {
    const wrapper = mount(BaseRadio, {
      props: {
        modelValue: 'Mensal',
        value: 'Mensal'
      }
    })

    const radio = wrapper.get('input[type="radio"]')
    expect((radio.element as HTMLInputElement).checked).toBe(true)
  })

  it('is not checked when modelValue differs from value', () => {
    const wrapper = mount(BaseRadio, {
      props: {
        modelValue: 'Anual',
        value: 'Mensal'
      }
    })

    const radio = wrapper.get('input[type="radio"]')
    expect((radio.element as HTMLInputElement).checked).toBe(false)
  })

  it('emits update:modelValue when changed', async () => {
    const wrapper = mount(BaseRadio, {
      props: {
        modelValue: null,
        value: 'Mensal'
      }
    })

    const radio = wrapper.get('input[type="radio"]')

    await radio.trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Mensal'])
  })
})
