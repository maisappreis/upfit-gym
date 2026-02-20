import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseSelect from '@/components/base/form/BaseSelect.vue'

vi.mock('@/features/setupFormComponent', () => ({
  default: (props: any, { emit }: any) => ({
    updateValue: (event: Event) => {
      const target = event.target as HTMLSelectElement
      emit('update:modelValue', target.value)
    }
  })
}))

describe('BaseSelect', () => {
  const slotOptions = `
    <option value="">Selecione</option>
    <option value="Mensal">Mensal</option>
    <option value="Anual">Anual</option>
  `

  it('renders label when provided', () => {
    const wrapper = mount(BaseSelect, {
      props: { label: 'Plano' }
    })

    expect(wrapper.find('label').exists()).toBe(true)
    expect(wrapper.text()).toContain('Plano:')
  })

  it('does not render label when not provided', () => {
    const wrapper = mount(BaseSelect)
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('renders slot options', () => {
    const wrapper = mount(BaseSelect, {
      slots: { default: slotOptions }
    })

    expect(wrapper.findAll('option').length).toBe(3)
  })

  it('reflects modelValue in select value', () => {
    const wrapper = mount(BaseSelect, {
      props: { modelValue: 'Anual' },
      slots: { default: slotOptions }
    })

    const select = wrapper.get('select')
    expect((select.element as HTMLSelectElement).value).toBe('Anual')
  })

  it('sets aria attributes when error exists', () => {
    const wrapper = mount(BaseSelect, {
      props: { error: 'Campo obrigatório' },
      slots: { default: slotOptions }
    })

    const select = wrapper.get('select')

    expect(select.attributes('aria-invalid')).toBe('true')
    expect(select.attributes('aria-describedby')).toContain('-error')
  })

  it('emits update:modelValue on change', async () => {
    const wrapper = mount(BaseSelect, {
      props: { modelValue: '' },
      slots: { default: slotOptions }
    })

    const select = wrapper.get('select')

    await select.setValue('Mensal')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Mensal'])
  })

  it('exposes focus method', () => {
    const wrapper = mount(BaseSelect, {
      slots: { default: slotOptions }
    })

    const focusSpy = vi.spyOn(wrapper.get('select').element as HTMLSelectElement, 'focus')

    ;(wrapper.vm as any).focus()

    expect(focusSpy).toHaveBeenCalled()
  })
})
