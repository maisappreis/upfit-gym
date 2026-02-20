import { describe, it, expect } from 'vitest'
import { useTooltipAnchors } from '@/composables/useTooltipAnchors'

describe('useTooltipAnchors', () => {
  it('initial state is correct', () => {
    const { hoveredId, refsMap } = useTooltipAnchors()

    expect(hoveredId.value).toBeNull()
    expect(refsMap.value).toEqual({})
  })

  it('sets HTMLElement directly', () => {
    const { refsMap, setRef } = useTooltipAnchors()

    const el = document.createElement('div')

    setRef(1, el)

    expect(refsMap.value[1]).toBe(el)
  })

  it('sets null correctly', () => {
    const { refsMap, setRef } = useTooltipAnchors()

    setRef(2, null)

    expect(refsMap.value[2]).toBeNull()
  })

  it('extracts $el when ComponentPublicInstance is passed', () => {
    const { refsMap, setRef } = useTooltipAnchors()

    const realEl = document.createElement('span')

    // mock mínimo de ComponentPublicInstance
    const componentMock = {
      $el: realEl
    }

    setRef(3, componentMock as any)

    expect(refsMap.value[3]).toBe(realEl)
  })
})
