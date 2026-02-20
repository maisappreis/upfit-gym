import { describe, it, expect } from 'vitest'
import {
  getMonthIndex,
  sortDataByDate,
  getCurrentYearMonthDay,
  getNextMonth,
  formatDate,
  getYearAndMonth
} from '@/utils/dateUtils'

import { months } from '@/utils/constants'

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

  /* ---------- sortDataByDate ---------- */

  it('sorts by year then month order', () => {
    const data = [
      { year: 2024, month: months[5], total: 10 },
      { year: 2023, month: months[10], total: 20 },
      { year: 2024, month: months[1], total: 30 }
    ] as any

    const result = sortDataByDate(data)

    expect(result.map((d) => `${d.year}-${d.month}`)).toEqual([
      `2023-${months[10]}`,
      `2024-${months[1]}`,
      `2024-${months[5]}`
    ])
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
