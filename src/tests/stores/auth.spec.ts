import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { loginService } from '@/features/auth/services/login.service'
import { jwtDecode } from 'jwt-decode'
import { useAuthStore } from '@/features/auth/stores/auth'
import router from "@/router";

vi.mock('@/router', () => ({
  default: {
    replace: vi.fn(),
    push: vi.fn()
  }
}))

vi.mock('@/features/auth/services/login.service', () => ({
  loginService: {
    create: vi.fn(),
    refresh: vi.fn(),
    profile: vi.fn()
  }
}))

vi.mock('@/shared/composables/useAppData', () => ({
  useAppData: () => ({
    fetchData: vi.fn().mockResolvedValue(undefined)
  })
}))

vi.mock('@/services/apiClient', () => ({
  setApiBaseURL: vi.fn()
}))

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn()
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('login sets tokens and authenticates', async () => {
    vi.mocked(loginService.create).mockResolvedValue({
      access: 'access123',
      refresh: 'refresh123',
      user: {
        id: 1,
        username: 'user',
        first_name: 'test',
        last_name: 'test',
        email: 'email@email.com'
      }
    })

    vi.mocked(jwtDecode).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 3600
    })

    const store = useAuthStore()

    await store.login({
      username: 'user',
      password: 'pass'
    })

    expect(localStorage.getItem('accessToken')).toBe('access123')
    expect(localStorage.getItem('refreshToken')).toBe('refresh123')
    expect(store.isAuthenticated).toBe(true)
    expect(store.user).toEqual({
      id: 1,
      username: 'user',
      first_name: 'test',
      last_name: 'test',
      email: 'email@email.com'
    })
    expect(router.push).toHaveBeenCalledWith('/')
  })

  it('checkAuthentication sets authenticated true if token exists', async () => {
    localStorage.setItem('accessToken', 'abc')
    localStorage.setItem('refreshToken', 'def')

    vi.mocked(loginService.profile).mockResolvedValue({
      access: 'access123',
      refresh: 'refresh123',
      user: {
        id: 1,
        username: 'user',
        first_name: 'test',
        last_name: 'test',
        email: 'email@email.com'
      }
    })

    const store = useAuthStore()

    await store.checkAuthentication()

    expect(store.isAuthenticated).toBe(true)
    expect(store.user).toEqual({
      id: 1,
      username: 'user',
      first_name: 'test',
      last_name: 'test',
      email: 'email@email.com'
    })
  })

  it('checkAuthentication sets authenticated false if no token', async () => {
    const store = useAuthStore()
    await store.checkAuthentication()

    expect(store.isAuthenticated).toBe(false)
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
  })
})
