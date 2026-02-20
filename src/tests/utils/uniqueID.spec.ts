import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('uniqueID', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('returns incremented id starting from 2', async () => {
    const { default: uniqueID } = await import('@/utils/uniqueID')

    const { getID } = uniqueID()

    expect(getID()).toBe(2)
    expect(getID()).toBe(3)
    expect(getID()).toBe(4)
  })

  it('maintains increment within same instance', async () => {
    const { default: uniqueID } = await import('@/utils/uniqueID')

    const { getID } = uniqueID()

    const first = getID()
    const second = getID()

    expect(second).toBe(first + 1)
  })
})