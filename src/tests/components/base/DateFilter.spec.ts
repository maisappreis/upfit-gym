import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DateFilter from '@/components/base/DateFilter.vue'

vi.mock('@/utils/constants', () => ({
  months: ['Jan', 'Fev', 'Mar'],
  years: [2023, 2024]
}))

describe('DateFilter', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  it('renders month and year options including "Todos"', () => {
    const wrapper = mount(DateFilter)

    const selects = wrapper.findAll('select')
    const monthOptions = selects[0].findAll('option')
    const yearOptions = selects[1].findAll('option')

    expect(monthOptions.map((o) => o.text())).toEqual(['Jan', 'Fev', 'Mar', 'Todos'])
    expect(yearOptions.map((o) => o.text())).toEqual(['2023', '2024', 'Todos'])
  })

  it('uses provided model values', () => {
    const wrapper = mount(DateFilter, {
      props: {
        modelValueMonth: 'Fev',
        modelValueYear: 2024
      }
    })

    const selects = wrapper.findAll('select')

    expect((selects[0].element as HTMLSelectElement).value).toBe('Fev')
    expect((selects[1].element as HTMLSelectElement).value).toBe('2024')
  })

  it('emits update when month changes', async () => {
    const wrapper = mount(DateFilter)

    const monthSelect = wrapper.findAll('select')[0]
    await monthSelect.setValue('Mar')

    const emits = wrapper.emitted('update:modelValueMonth')
    expect(emits?.[emits.length - 1]).toEqual(['Mar'])
  })

  it('emits update when year changes', async () => {
    const wrapper = mount(DateFilter)

    const yearSelect = wrapper.findAll('select')[1]
    await yearSelect.setValue(2024)

    const emits = wrapper.emitted('update:modelValueYear')
    expect(emits?.[emits.length - 1]).toEqual([2024])
  })

  it('emits current month and year on mount if not provided', async () => {
    const mockDate = new Date(2024, 1, 10) // Fev 2024
    vi.setSystemTime(mockDate)

    const wrapper = mount(DateFilter)

    expect(wrapper.emitted('update:modelValueMonth')).toBeTruthy()
    expect(wrapper.emitted('update:modelValueYear')).toBeTruthy()
  })
})
