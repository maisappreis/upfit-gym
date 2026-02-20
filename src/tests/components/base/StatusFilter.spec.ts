import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusFilter from '@/components/base/StatusFilter.vue'

describe('StatusFilter', () => {
  const options = ['Ativo', 'Inativo', 'Pendente']

  const factory = (props = {}) =>
    mount(StatusFilter, {
      props: {
        options,
        defaultValue: 'Ativo',
        ...props
      }
    })

  it('renders all options', () => {
    const wrapper = factory()
    const renderedOptions = wrapper.findAll('option')

    expect(renderedOptions.map((o) => o.text())).toEqual(options)
  })

  it('uses modelValue when provided', () => {
    const wrapper = factory({ modelValue: 'Inativo' })
    const select = wrapper.find('select')

    expect((select.element as HTMLSelectElement).value).toBe('Inativo')
  })

  it('uses defaultValue when modelValue is not provided', () => {
    const wrapper = factory()
    const select = wrapper.find('select')

    expect((select.element as HTMLSelectElement).value).toBe('Ativo')
  })

  it('emits defaultValue on mount when modelValue is not provided', () => {
    const wrapper = factory()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Ativo'])
  })

  it('does not emit on mount when modelValue is provided', () => {
    const wrapper = factory({ modelValue: 'Pendente' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('emits update:modelValue when selection changes', async () => {
    const wrapper = factory({ modelValue: 'Ativo' })
    const select = wrapper.find('select')

    await select.setValue('Pendente')

    const emits = wrapper.emitted('update:modelValue')
    expect(emits?.[emits.length - 1]).toEqual(['Pendente'])
  })
})
