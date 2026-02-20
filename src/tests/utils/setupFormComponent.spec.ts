import { describe, it, expect, vi } from 'vitest'
import setupFormComponent from '@/utils/setupFormComponent'

describe('setupFormComponent', () => {
  const createEvent = (options: Partial<HTMLInputElement>) => {
    return {
      target: {
        value: '',
        type: 'text',
        checked: false,
        ...options
      }
    } as unknown as Event
  }

  it('emits text input value', () => {
    const emit = vi.fn()

    const { updateValue } = setupFormComponent({}, { emit })

    const event = createEvent({
      type: 'text',
      value: 'hello'
    })

    updateValue(event)

    expect(emit).toHaveBeenCalledWith('update:modelValue', 'hello')
  })

  it('emits number input value as string (DOM behavior)', () => {
    const emit = vi.fn()

    const { updateValue } = setupFormComponent({}, { emit })

    const event = createEvent({
      type: 'number',
      value: '123'
    })

    updateValue(event)

    expect(emit).toHaveBeenCalledWith('update:modelValue', '123')
  })

  it('emits checkbox checked value', () => {
    const emit = vi.fn()

    const { updateValue } = setupFormComponent({}, { emit })

    const event = createEvent({
      type: 'checkbox',
      checked: true
    })

    updateValue(event)

    expect(emit).toHaveBeenCalledWith('update:modelValue', true)
  })

  it('emits radio value', () => {
    const emit = vi.fn()

    const { updateValue } = setupFormComponent({}, { emit })

    const event = createEvent({
      type: 'radio',
      value: 'option1'
    })

    updateValue(event)

    expect(emit).toHaveBeenCalledWith('update:modelValue', 'option1')
  })
})
