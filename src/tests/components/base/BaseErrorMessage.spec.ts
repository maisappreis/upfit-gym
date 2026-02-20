import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseErrorMessage from '@/components/base/BaseErrorMessage.vue'

describe('BaseErrorMessage', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseErrorMessage, {
      props: { id: 'error-1' },
      slots: {
        default: 'Campo obrigatório'
      }
    })

    expect(wrapper.text()).toContain('Campo obrigatório')
  })

  it('sets the correct id attribute', () => {
    const wrapper = mount(BaseErrorMessage, {
      props: { id: 'custom-id' }
    })

    expect(wrapper.attributes('id')).toBe('custom-id')
  })

  it('has aria-live assertive', () => {
    const wrapper = mount(BaseErrorMessage, {
      props: { id: 'error-2' }
    })

    expect(wrapper.attributes('aria-live')).toBe('assertive')
  })

  it('has correct CSS class', () => {
    const wrapper = mount(BaseErrorMessage, {
      props: { id: 'error-3' }
    })

    expect(wrapper.classes()).toContain('errorMessage')
  })
})
