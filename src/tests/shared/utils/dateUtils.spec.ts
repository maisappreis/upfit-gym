import { describe, it, expect } from 'vitest'
import {
  getMonthIndex,
  getCurrentYearMonthDay,
  getNextMonth,
  formatDate,
  getYearAndMonth
} from '@/shared/utils/dateUtils'

import { months } from '@/shared/utils/constants'

describe('dateUtils', () => {
  /* ---------- getMonthIndex ---------- */

  it('returns correct index of month', () => {
    const index = getMonthIndex(months[0])
    expect(index).toBe(0)
  })

  it('returns index for "Todos os meses"', () => {
    const index = getMonthIndex('Todos os meses')
    expect(index).toBe(months.length)
  })

  /* ---------- getCurrentYearMonthDay ---------- */

  it('parses YYYY-MM-DD correctly', () => {
    const result = getCurrentYearMonthDay('2024-03-05')

    expect(result.year).toBe(2024)
    expect(result.month).toBe(months[2]) // March = index 2
    expect(result.day).toBe('05')
  })

  /* ---------- getNextMonth ---------- */

  it('returns next month same year', () => {
    const result = getNextMonth(months[0], 2024)

    expect(result.month).toBe(months[1])
    expect(result.year).toBe(2024)
    expect(result.monthNumber).toBe(2)
  })

  it('wraps to next year after December', () => {
    const december = months[11]

    const result = getNextMonth(december, 2024)

    expect(result.month).toBe(months[0])
    expect(result.year).toBe(2025)
    expect(result.monthNumber).toBe(1)
  })

  /* ---------- formatDate ---------- */

  it('formats date to DD/MM/YYYY', () => {
    expect(formatDate('2024-03-05')).toBe('05/03/2024')
  })

  /* ---------- getYearAndMonth ---------- */

  it('extracts year and month from date', () => {
    const result = getYearAndMonth('2024-07-10')

    expect(result.year).toBe(2024)
    expect(result.month).toBe(months[6]) // July
  })
})
