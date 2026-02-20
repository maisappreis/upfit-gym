import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseRadioGroup from '@/components/base/form/BaseRadioGroup.vue'
import BaseRadio from '@/components/base/form/BaseRadio.vue'

describe('BaseRadioGroup', () => {
  const options = [
    { label: 'Mensal', value: 'Mensal' },
    { label: 'Anual', value: 'Anual' }
  ]

  it('renders group label', () => {
    const wrapper = mount(BaseRadioGroup, {
      props: {
        name: 'Plano',
        modelValue: 'Mensal',
        options
      }
    })

    expect(wrapper.text()).toContain('Plano:')
  })

  it('renders correct number of BaseRadio components', () => {
    const wrapper = mount(BaseRadioGroup, {
      props: {
        name: 'Plano',
        modelValue: 'Mensal',
        options
      }
    })

    const radios = wrapper.findAllComponents(BaseRadio)
    expect(radios.length).toBe(2)
  })

  it('passes correct props to BaseRadio', () => {
    const wrapper = mount(BaseRadioGroup, {
      props: {
        name: 'Plano',
        modelValue: 'Mensal',
        options
      }
    })

    const radios = wrapper.findAllComponents(BaseRadio)

    expect(radios[0].props('label')).toBe('Mensal')
    expect(radios[0].props('value')).toBe('Mensal')
    expect(radios[0].props('modelValue')).toBe('Mensal')
  })

  it('emits update:modelValue when a radio emits', async () => {
    const wrapper = mount(BaseRadioGroup, {
      props: {
        name: 'Plano',
        modelValue: 'Mensal',
        options
      }
    })

    const radios = wrapper.findAllComponents(BaseRadio)

    await radios[1].vm.$emit('update:modelValue', 'Anual')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Anual'])
  })

  it('renders vertically when vertical is true', () => {
    const wrapper = mount(BaseRadioGroup, {
      props: {
        name: 'Plano',
        modelValue: 'Mensal',
        options,
        vertical: true
      }
    })

    const containers = wrapper.findAll('div > div')
    expect(containers.length).toBeGreaterThan(0)
  })
})
