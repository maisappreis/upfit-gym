import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchFilter from '@/components/base/SearchFilter.vue'

describe('SearchFilter', () => {
  const factory = (props = {}) =>
    mount(SearchFilter, {
      props: {
        ...props
      }
    })

  it('renders default placeholder', () => {
    const wrapper = factory()
    const input = wrapper.find('input')

    expect(input.attributes('placeholder')).toBe('Pesquisar...')
  })

  it('renders custom placeholder', () => {
    const wrapper = factory({ placeholder: 'Buscar itens' })
    const input = wrapper.find('input')

    expect(input.attributes('placeholder')).toBe('Buscar itens')
  })

  it('displays joined modelValue as comma separated string', () => {
    const wrapper = factory({ modelValue: ['apple', 'banana'] })
    const input = wrapper.find('input')

    expect((input.element as HTMLInputElement).value).toBe('apple, banana')
  })

  it('emits parsed array when input changes', async () => {
    const wrapper = factory()
    const input = wrapper.find('input')

    await input.setValue('apple, banana, orange')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['apple', 'banana', 'orange']])
  })

  it('trims values and removes empty entries', async () => {
    const wrapper = factory()
    const input = wrapper.find('input')

    await input.setValue(' apple , , banana ,  , orange  ')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['apple', 'banana', 'orange']])
  })

  it('emits empty array when input is cleared', async () => {
    const wrapper = factory({ modelValue: ['apple'] })
    const input = wrapper.find('input')

    await input.setValue('')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
  })
})
