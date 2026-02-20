import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTextarea from '@/components/base/form/BaseTextarea.vue'

vi.mock('@/features/setupFormComponent', () => ({
  default: (_props: any, { emit }: any) => ({
    updateValue: (event: Event) => {
      const target = event.target as HTMLTextAreaElement
      emit('update:modelValue', target.value)
    }
  })
}))

describe('BaseTextarea', () => {
  it('renders label when provided', () => {
    const wrapper = mount(BaseTextarea, {
      props: { label: 'Descrição' }
    })

    expect(wrapper.find('label').exists()).toBe(true)
    expect(wrapper.text()).toContain('Descrição:')
  })

  it('does not render label when not provided', () => {
    const wrapper = mount(BaseTextarea)
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('reflects modelValue in textarea value', () => {
    const wrapper = mount(BaseTextarea, {
      props: { modelValue: 'Texto inicial' }
    })

    const textarea = wrapper.get('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('Texto inicial')
  })

  it('sets aria attributes when error exists', () => {
    const wrapper = mount(BaseTextarea, {
      props: { error: 'Campo obrigatório' }
    })

    const textarea = wrapper.get('textarea')

    expect(textarea.attributes('aria-invalid')).toBe('true')
    expect(textarea.attributes('aria-describedby')).toContain('-error')
  })

  it('applies error class when error exists', () => {
    const wrapper = mount(BaseTextarea, {
      props: { error: 'Erro' }
    })

    const textarea = wrapper.get('textarea')
    expect(textarea.classes()).toContain('error')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(BaseTextarea, {
      props: { modelValue: '' }
    })

    const textarea = wrapper.get('textarea')

    await textarea.setValue('Novo texto')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Novo texto'])
  })
})
