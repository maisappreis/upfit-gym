import { describe, it, expect, vi } from 'vitest'
import { normalize, getCssVar, orderData, searchData, capitalize, filteredData } from '@/utils/dataUtils'

describe('dataUtils', () => {
  /* ---------- normalize ---------- */

  it('normalize trims and lowercases string', () => {
    expect(normalize('  TeStE  ')).toBe('teste')
  })

  /* ---------- getCssVar ---------- */

  it('getCssVar returns css variable value', () => {
    const getComputedSpy = vi.spyOn(window, 'getComputedStyle')

    getComputedSpy.mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('  red  ')
    } as any)

    const result = getCssVar('--color')

    expect(result).toBe('red')
    expect(getComputedSpy).toHaveBeenCalled()

    getComputedSpy.mockRestore()
  })

  /* ---------- orderData ---------- */

  it('orderData sorts by name pt-BR insensitive', () => {
    const data = [{ name: 'Zeca' }, { name: 'ana' }, { name: 'Álvaro' }]

    const result = orderData(data)

    expect(result.map((i) => i.name)).toEqual(['Álvaro', 'ana', 'Zeca'])
  })

  it('orderData returns empty array if no data', () => {
    expect(orderData([])).toEqual([])
  })

  /* ---------- searchData ---------- */

  it('searchData filters by search terms', () => {
    const data = [{ name: 'Maria' }, { name: 'João' }, { name: 'Marcos' }]

    const result = searchData(data, ['mar'])

    expect(result.map((i) => i.name)).toEqual(['Marcos', 'Maria'])
  })

  it('searchData returns ordered data if no search', () => {
    const data = [{ name: 'Zeca' }, { name: 'Ana' }]

    const result = searchData(data, [])

    expect(result.map((i) => i.name)).toEqual(['Ana', 'Zeca'])
  })

  /* ---------- capitalize ---------- */

  it('capitalize formats string correctly', () => {
    expect(capitalize('joÃO siLVA')).toBe('João Silva')
  })

  /* ---------- filteredData ---------- */

  it('filteredData filters by month, year and status', () => {
    const data = [
      { month: 'Janeiro', year: 2024, paid: 'Pago' },
      { month: 'Fevereiro', year: 2024, paid: 'Aberto' },
      { month: 'Janeiro', year: 2023, paid: 'Pago' }
    ] as any

    const result = filteredData(data, {
      currentMonth: 'Janeiro',
      currentYear: 2024,
      currentStatus: 'Pago'
    })

    expect(result).toHaveLength(1)
  })

  it('filteredData returns all if filters are "Todos"', () => {
    const data = [{ month: 'Janeiro', year: 2024, paid: 'Pago' }] as any

    const result = filteredData(data, {
      currentMonth: 'Todos',
      currentYear: 'Todos',
      currentStatus: 'Todos'
    })

    expect(result).toHaveLength(1)
  })

  it('filteredData returns empty array if no data', () => {
    const result = filteredData([], {
      currentMonth: 'Janeiro',
      currentYear: 2024,
      currentStatus: 'Pago'
    })

    expect(result).toEqual([])
  })
})
