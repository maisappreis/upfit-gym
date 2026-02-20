import { describe, it, expect, beforeEach, vi } from 'vitest'

const requestUse = vi.fn()
const responseUse = vi.fn()

const postMock = vi.fn()
const apiCallMock = vi.fn()

vi.mock('axios', () => {
  const mockInstance: any = vi.fn()

  mockInstance.defaults = { baseURL: '' }

  mockInstance.interceptors = {
    request: { use: requestUse },
    response: { use: responseUse }
  }

  mockInstance.post = postMock

  return {
    default: {
      create: vi.fn(() => mockInstance)
    }
  }
})

describe('apiClient', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('sets Authorization header if token exists', async () => {
    localStorage.setItem('accessToken', 'abc123')

    await import('@/services/apiClient')

    const interceptor = requestUse.mock.calls[0][0]

    const config: any = { headers: {} }

    const result = interceptor(config)

    expect(result.headers.Authorization).toBe('Bearer abc123')
  })

  it('does not set Authorization if no token', async () => {
    await import('@/services/apiClient')

    const interceptor = requestUse.mock.calls[0][0]

    const config: any = { headers: {} }

    const result = interceptor(config)

    expect(result.headers.Authorization).toBeUndefined()
  })

  it('refreshes token on 401 and retries request', async () => {
    await import('@/services/apiClient')

    const responseInterceptor = responseUse.mock.calls[0][1]

    localStorage.setItem('refreshToken', 'refresh123')

    postMock.mockResolvedValue({
      data: { access: 'newAccessToken' }
    })

    const originalRequest: any = {
      headers: {},
      _retry: false
    }

    const error = {
      config: originalRequest,
      response: { status: 401 }
    }

    apiCallMock.mockResolvedValue({ success: true })

    const resultPromise = responseInterceptor(error)

    await resultPromise

    expect(postMock).toHaveBeenCalledWith('/token/refresh/', {
      refresh: 'refresh123'
    })

    expect(localStorage.getItem('accessToken')).toBe('newAccessToken')
    expect(originalRequest.headers.Authorization).toBe('Bearer newAccessToken')
  })

  it('rejects if no refresh token', async () => {
    await import('@/services/apiClient')

    const responseInterceptor = responseUse.mock.calls[0][1]

    const error = {
      config: { _retry: false },
      response: { status: 401 }
    }

    await expect(responseInterceptor(error)).rejects.toBe(error)
  })

  it('sets baseURL correctly', async () => {
    const { apiClient, setApiBaseURL } = await import('@/services/apiClient')

    setApiBaseURL('http://new-url.com')

    expect(apiClient.defaults.baseURL).toBe('http://new-url.com')
  })
})
