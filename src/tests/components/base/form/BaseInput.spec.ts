import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '@/components/base/form/BaseInput.vue'

vi.mock('@/features/setupFormComponent', () => ({
  default: (props: any, { emit }: any) => ({
    updateValue: (event: Event) => {
      const target = event.target as HTMLInputElement
      emit('update:modelValue', target.value)
    }
  })
}))

describe('BaseInput', () => {
  it('renders label when provided', () => {
    const wrapper = mount(BaseInput, {
      props: { label: 'Nome' }
    })

    expect(wrapper.find('label').exists()).toBe(true)
    expect(wrapper.text()).toContain('Nome:')
  })

  it('does not render label when not provided', () => {
    const wrapper = mount(BaseInput)
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('renders error message when error prop is passed', () => {
    const wrapper = mount(BaseInput, {
      props: { error: 'Campo obrigatório' }
    })

    expect(wrapper.text()).toContain('Campo obrigatório')
  })

  it('sets aria attributes when error exists', () => {
    const wrapper = mount(BaseInput, {
      props: { error: 'Erro' }
    })

    const input = wrapper.get('input')

    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toContain('-error')
  })

  it('reflects modelValue in input value', () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: 'Teste' }
    })

    const input = wrapper.get('input')
    expect((input.element as HTMLInputElement).value).toBe('Teste')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: '' }
    })

    const input = wrapper.get('input')

    await input.setValue('Novo valor')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Novo valor'])
  })

  it('exposes focus method', async () => {
    const wrapper = mount(BaseInput)

    const focusSpy = vi.spyOn(wrapper.get('input').element as HTMLInputElement, 'focus')

    ;(wrapper.vm as any).focus()

    expect(focusSpy).toHaveBeenCalled()
  })
})
