import { describe, vi, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ModalCard from '@/components/base/ModalCard.vue'

describe('ModalCard', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('does not render when modelValue is false', () => {
    mount(ModalCard, {
      props: { modelValue: false }
    })

    expect(document.body.querySelector('.overlay')).toBeNull()
  })

  it('renders modal when modelValue is true', () => {
    mount(ModalCard, {
      props: { modelValue: true }
    })

    expect(document.body.querySelector('.overlay')).not.toBeNull()
    expect(document.body.querySelector('.modal')).not.toBeNull()
  })

  it('renders default slot content', () => {
    mount(ModalCard, {
      props: { modelValue: true },
      slots: {
        default: '<p class="content">Modal Content</p>'
      }
    })

    const content = document.body.querySelector('.content')
    expect(content?.textContent).toBe('Modal Content')
  })

  it('renders header slot when provided', () => {
    mount(ModalCard, {
      props: { modelValue: true },
      slots: {
        header: '<div class="header-slot">Header</div>'
      }
    })

    const header = document.body.querySelector('.header-slot')
    expect(header).not.toBeNull()
  })

  it('renders footer slot when provided', () => {
    mount(ModalCard, {
      props: { modelValue: true },
      slots: {
        footer: '<div class="footer-slot">Footer</div>'
      }
    })

    const footer = document.body.querySelector('.footer-slot')
    expect(footer).not.toBeNull()
  })

  it('emits update:modelValue false when clicking overlay', async () => {
    const wrapper = mount(ModalCard, {
      props: { modelValue: true }
    })

    const overlay = document.body.querySelector('.overlay') as HTMLElement
    await overlay.click()

    const emits = wrapper.emitted('update:modelValue')
    expect(emits?.[0]).toEqual([false])
  })

  it('does not emit when clicking inside modal', async () => {
    const wrapper = mount(ModalCard, {
      props: { modelValue: true }
    })

    const modal = document.body.querySelector('.modal') as HTMLElement
    await modal.click()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('emits update:modelValue false when pressing Escape', async () => {
    const wrapper = mount(ModalCard, {
      props: { modelValue: true }
    })

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    const emits = wrapper.emitted('update:modelValue')
    expect(emits?.[0]).toEqual([false])
  })

  it('removes keydown listener on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const wrapper = mount(ModalCard, {
      props: { modelValue: true }
    })

    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function))

    wrapper.unmount()

    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })
})
