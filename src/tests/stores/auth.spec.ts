import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/services/login.service', () => ({
  loginService: {
    create: vi.fn(),
    refresh: vi.fn()
  }
}))

vi.mock('@/stores/api', () => ({
  useApiStore: () => ({
    fetchData: vi.fn().mockResolvedValue(undefined)
  })
}))

vi.mock('@/services/apiClient', () => ({
  setApiBaseURL: vi.fn()
}))

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn()
}))

import { loginService } from '@/services/login.service'
import { setApiBaseURL } from '@/services/apiClient'
import { jwtDecode } from 'jwt-decode'
import { useAuthStore } from '@/stores/auth'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('login sets tokens and authenticates', async () => {
    vi.mocked(loginService.create).mockResolvedValue({
      access: 'access123',
      refresh: 'refresh123'
    })

    vi.mocked(jwtDecode).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 3600
    })

    const store = useAuthStore()

    const result = await store.login({
      username: 'user',
      password: 'pass'
    })

    expect(result).toBe(true)
    expect(localStorage.getItem('accessToken')).toBe('access123')
    expect(localStorage.getItem('refreshToken')).toBe('refresh123')
    expect(store.isAuthenticated).toBe(true)
  })

  it('throws if login response invalid', async () => {
    vi.mocked(loginService.create).mockResolvedValue({
      access: '',
      refresh: ''
    })

    const store = useAuthStore()

    await expect(store.login({ username: 'a', password: 'b' })).rejects.toThrow(
      'Invalid login response'
    )
  })

  it('checkAuthentication sets authenticated true if token exists', async () => {
    localStorage.setItem('accessToken', 'abc')

    const store = useAuthStore()
    await store.checkAuthentication()

    expect(store.isAuthenticated).toBe(true)
    expect(setApiBaseURL).toHaveBeenCalled()
  })

  it('checkAuthentication sets authenticated false if no token', async () => {
    const store = useAuthStore()
    await store.checkAuthentication()

    expect(store.isAuthenticated).toBe(false)
    expect(setApiBaseURL).toHaveBeenCalled()
  })

  it('logout clears tokens and reloads page', () => {
    const originalLocation = window.location

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        reload: vi.fn()
      }
    })

    const store = useAuthStore()

    localStorage.setItem('accessToken', 'abc')
    localStorage.setItem('refreshToken', 'def')

    store.logout()

    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(localStorage.getItem('refreshToken')).toBeNull()
    expect(window.location.reload).toHaveBeenCalled()

    // restaura original
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation
    })
  })

  it('refreshTokenFunc refreshes token successfully', async () => {
    vi.mocked(loginService.refresh).mockResolvedValue({
      access: 'newAccess',
      refresh: 'newRefresh'
    })

    vi.mocked(jwtDecode).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 3600
    })

    const store = useAuthStore()

    localStorage.setItem('refreshToken', 'refresh123')
    await store.setTokens('oldAccess', 'refresh123')

    await loginService.refresh('refresh123')

    expect(loginService.refresh).toHaveBeenCalled()
  })
})
