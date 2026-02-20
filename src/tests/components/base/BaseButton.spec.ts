import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/base/BaseButton.vue'

describe('BaseButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Salvar'
      }
    })

    expect(wrapper.text()).toContain('Salvar')
  })

  it('applies default classes', () => {
    const wrapper = mount(BaseButton)

    expect(wrapper.classes()).toContain('btn')
    expect(wrapper.classes()).toContain('btn--primary')
    expect(wrapper.classes()).toContain('btn--md')
  })

  it('applies variant and size classes', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'danger',
        size: 'lg'
      }
    })

    expect(wrapper.classes()).toContain('btn--danger')
    expect(wrapper.classes()).toContain('btn--lg')
  })

  it('sets button type correctly', () => {
    const wrapper = mount(BaseButton, {
      props: {
        type: 'submit'
      }
    })

    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('disables button when disabled is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true
      }
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('disables button when loading is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true
      }
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('shows spinner when loading', () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true
      }
    })

    expect(wrapper.find('.spinner').exists()).toBe(true)
    expect(wrapper.classes()).toContain('is-loading')
  })

  it('hides content when loading', () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true
      },
      slots: {
        default: 'Salvar'
      }
    })

    const contentSpan = wrapper.find('span:last-child')
    expect(contentSpan.classes()).toContain('content-hidden')
  })
})
