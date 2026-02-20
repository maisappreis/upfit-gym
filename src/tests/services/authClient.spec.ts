import { describe, it, expect, beforeEach, vi } from 'vitest'

const createMock = vi.fn()

vi.mock('axios', () => ({
  default: {
    create: createMock
  }
}))

describe('authClient', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('creates axios instance with correct config', async () => {
    await import('@/services/authClient')

    expect(createMock).toHaveBeenCalledTimes(1)

    expect(createMock).toHaveBeenCalledWith({
      baseURL: import.meta.env.VITE_API_BASE,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })
})
