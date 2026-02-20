import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useChart } from '@/composables/useChart'

const revenueMock: any[] = []
const expensesMock: any[] = []
const customersMock: any[] = []

vi.mock('@/stores/api', () => ({
  useApiStore: () => ({
    revenue: revenueMock,
    expenses: expensesMock,
    customers: customersMock
  })
}))

vi.mock('@/utils/dateUtils', () => ({
  sortDataByDate: (data: any[]) => data
}))

describe('useChart', () => {
  beforeEach(() => {
    revenueMock.length = 0
    expensesMock.length = 0
    customersMock.length = 0
  })

  it('calculates monthlyRevenueOrdered correctly', () => {
    revenueMock.push(
      { year: 2024, month: 'Janeiro', value: 100, paid: 'Pago' },
      { year: 2024, month: 'Janeiro', value: 200, paid: 'Pago' },
      { year: 2024, month: 'Fevereiro', value: 300, paid: 'Pendente' }
    )

    const { monthlyRevenueOrdered } = useChart()

    expect(monthlyRevenueOrdered.value).toEqual([{ year: 2024, month: 'Janeiro', sum: 300 }])
  })

  it('calculates monthlyExpensesOrdered correctly', () => {
    expensesMock.push(
      { year: 2024, month: 'Janeiro', value: 50, paid: 'Pago' },
      { year: 2024, month: 'Janeiro', value: 25, paid: 'Pago' }
    )

    const { monthlyExpensesOrdered } = useChart()

    expect(monthlyExpensesOrdered.value).toEqual([{ year: 2024, month: 'Janeiro', sum: 75 }])
  })

  it('calculates monthlyProfit correctly', () => {
    revenueMock.push({ year: 2024, month: 'Janeiro', value: 300, paid: 'Pago' })

    expensesMock.push({ year: 2024, month: 'Janeiro', value: 100, paid: 'Pago' })

    const { monthlyProfit } = useChart()

    expect(monthlyProfit.value).toEqual([{ year: 2024, month: 'Janeiro', sum: 200 }])
  })

  it('returns zero expense if month has no expense', () => {
    revenueMock.push({ year: 2024, month: 'Janeiro', value: 500, paid: 'Pago' })

    const { monthlyProfit } = useChart()

    expect(monthlyProfit.value).toEqual([{ year: 2024, month: 'Janeiro', sum: 500 }])
  })

  it('counts active and inactive customers', () => {
    customersMock.push({ status: 'Ativo' }, { status: 'Ativo' }, { status: 'Inativo' })

    const { activeCustomers, inactiveCustomers } = useChart()

    expect(activeCustomers.value).toBe(2)
    expect(inactiveCustomers.value).toBe(1)
  })
})
