import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAlertStore } from '@/stores/alert'

describe('useAlertStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('has correct initial state', () => {
    const store = useAlertStore()

    expect(store.message).toBeNull()
    expect(store.type).toBe('success')
    expect(store.visible).toBe(false)
  })

  it('sets success alert correctly', () => {
    const store = useAlertStore()

    store.success('Tudo certo')

    expect(store.message).toBe('Tudo certo')
    expect(store.type).toBe('success')
    expect(store.visible).toBe(true)
  })

  it('sets error alert correctly and logs error', () => {
    const store = useAlertStore()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const errorObj = new Error('Falha')

    store.error('Erro aconteceu', errorObj)

    expect(store.message).toBe('Erro aconteceu')
    expect(store.type).toBe('error')
    expect(store.visible).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith(errorObj)

    consoleSpy.mockRestore()
  })

  it('sets error alert without logging if no error object', () => {
    const store = useAlertStore()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    store.error('Erro simples')

    expect(store.message).toBe('Erro simples')
    expect(store.type).toBe('error')
    expect(store.visible).toBe(true)
    expect(consoleSpy).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('clears alert correctly', () => {
    const store = useAlertStore()

    store.success('Mensagem')
    store.clear()

    expect(store.message).toBeNull()
    expect(store.visible).toBe(false)
  })
})
