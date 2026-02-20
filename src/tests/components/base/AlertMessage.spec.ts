import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import AlertMessage from '@/components/base/AlertMessage.vue'
import { useAlertStore } from '@/stores/alert'

describe('AlertMessage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  async function mountWithStore(type: any, message: string) {
    const wrapper = mount(AlertMessage, {
      global: {
        stubs: {
          'font-awesome-icon': true
        }
      }
    })

    const store = useAlertStore()
    store.type = type
    store.message = message

    await nextTick()

    return { wrapper, store }
  }

  it('renders message from store', async () => {
    const { wrapper } = await mountWithStore('success', 'Operação realizada')

    expect(wrapper.text()).toContain('Operação realizada')
  })

  it('applies success class', async () => {
    const { wrapper } = await mountWithStore('success', 'OK')

    expect(wrapper.classes()).toContain('success')
  })

  it('applies error class', async () => {
    const { wrapper } = await mountWithStore('error', 'Erro')

    expect(wrapper.classes()).toContain('error')
  })

  it('clears alert after 2 seconds', async () => {
    const { store } = await mountWithStore('success', 'OK')

    const clearSpy = vi.spyOn(store, 'clear')

    vi.advanceTimersByTime(2000)

    expect(clearSpy).toHaveBeenCalled()
  })
})
