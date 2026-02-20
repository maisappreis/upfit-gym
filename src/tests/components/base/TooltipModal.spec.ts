import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TooltipModal from '@/components/base/TooltipModal.vue'

describe('TooltipModal', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  const createAnchor = (rect = { bottom: 100, left: 50 }) => {
    const el = document.createElement('div')
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      bottom: rect.bottom,
      left: rect.left,
      top: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {}
    } as DOMRect)
    document.body.appendChild(el)
    return el
  }

  it('does not render when visible is false', () => {
    const anchor = createAnchor()

    mount(TooltipModal, {
      props: { visible: false, anchor }
    })

    expect(document.body.querySelector('.tooltip')).toBeNull()
  })

  it('does not render when anchor is null', () => {
    mount(TooltipModal, {
      props: { visible: true, anchor: null }
    })

    expect(document.body.querySelector('.tooltip')).toBeNull()
  })

  it('renders when visible and anchor are provided', () => {
    const anchor = createAnchor()

    mount(TooltipModal, {
      props: { visible: true, anchor }
    })

    expect(document.body.querySelector('.tooltip')).not.toBeNull()
  })

  it('renders slot content', () => {
    const anchor = createAnchor()

    mount(TooltipModal, {
      props: { visible: true, anchor },
      slots: {
        default: '<span class="content">Tooltip Text</span>'
      }
    })

    const content = document.body.querySelector('.content')
    expect(content?.textContent).toBe('Tooltip Text')
  })

  it('positions tooltip based on anchor rect and default offset', () => {
    const anchor = createAnchor({ bottom: 200, left: 80 })

    mount(TooltipModal, {
      props: { visible: true, anchor }
    })

    const tooltip = document.body.querySelector('.tooltip') as HTMLElement

    expect(tooltip.style.top).toBe('208px') // 200 + default offset 8
    expect(tooltip.style.left).toBe('80px')
  })

  it('uses custom offset', () => {
    const anchor = createAnchor({ bottom: 150, left: 40 })

    mount(TooltipModal, {
      props: { visible: true, anchor, offset: 20 }
    })

    const tooltip = document.body.querySelector('.tooltip') as HTMLElement

    expect(tooltip.style.top).toBe('170px') // 150 + 20
    expect(tooltip.style.left).toBe('40px')
  })

  it('uses first element when anchor is array', () => {
    const anchor1 = createAnchor({ bottom: 120, left: 30 })
    const anchor2 = createAnchor({ bottom: 300, left: 300 })

    mount(TooltipModal, {
      props: { visible: true, anchor: [anchor1, anchor2] }
    })

    const tooltip = document.body.querySelector('.tooltip') as HTMLElement

    expect(tooltip.style.top).toBe('128px') // 120 + 8
    expect(tooltip.style.left).toBe('30px')
  })
})
