import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingScreen from '@/components/base/LoadingScreen.vue'

describe('LoadingScreen', () => {
  beforeEach(() => {
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('does not render when visible is false', () => {
    expect(document.body.querySelector('.overlay')).toBeNull()
  })

  it('renders overlay when visible is true', async () => {
    mount(LoadingScreen, {
      props: { visible: true }
    })

    const overlay = document.body.querySelector('.overlay')
    expect(overlay).not.toBeNull()
  })

  it('renders default message', async () => {
    mount(LoadingScreen, {
      props: { visible: true }
    })

    const message = document.body.querySelector('.message')
    expect(message?.textContent).toBe('Carregando...')
  })

  it('renders custom message', async () => {
    mount(LoadingScreen, {
      props: {
        visible: true,
        message: 'Processando dados'
      }
    })

    const message = document.body.querySelector('.message')
    expect(message?.textContent).toBe('Processando dados')
  })

  it('locks body scroll when visible is true', async () => {
    const wrapper = mount(LoadingScreen, {
      props: { visible: false }
    })

    await wrapper.setProps({ visible: true })

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('unlocks body scroll when visible becomes false', async () => {
    const wrapper = mount(LoadingScreen, {
      props: { visible: true }
    })

    await wrapper.setProps({ visible: false })

    expect(document.body.style.overflow).toBe('')
  })

  it('does not lock scroll when lockScroll is false', async () => {
    const wrapper = mount(LoadingScreen, {
      props: {
        visible: false,
        lockScroll: false
      }
    })

    await wrapper.setProps({ visible: true })

    expect(document.body.style.overflow).toBe('')
  })

  it('unlocks scroll on unmount', async () => {
    const wrapper = mount(LoadingScreen, {
      props: { visible: true }
    })

    wrapper.unmount()

    expect(document.body.style.overflow).toBe('')
  })
})
