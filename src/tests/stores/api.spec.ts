import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useApiStore } from '@/stores/api'
import { customerService } from '@/services/customer.service'
import { revenueService } from '@/services/revenue.service'
import { expenseService } from '@/services/expense.service'
import { type Revenue } from '@/types/revenue'
import { type Expense} from '@/types/expense'
import { type Customer } from '@/types/customer'

vi.mock('@/services/customer.service', () => {
  return {
    customerService: {
      fetchAll: vi.fn()
    }
  }
})

vi.mock('@/services/revenue.service', () => {
  return {
    revenueService: {
      fetchAll: vi.fn()
    }
  }
})

vi.mock('@/services/expense.service', () => {
  return {
    expenseService: {
      fetchAll: vi.fn()
    }
  }
})

describe('useApiStore', () => {
  beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

  it('fetchCustomers sets and sorts customers', async () => {
    const customers = [
      {
        id: 1,
        name: 'João',
        frequency: '1x',
        start: '2024-01-01',
        plan: 'Mensal',
        value: 100,
        status: 'Ativo',
        notes: 'Teste'
      },
      {
        id: 2,
        name: 'Maria',
        frequency: '1x',
        start: '2024-01-01',
        plan: 'Mensal',
        value: 100,
        status: 'Ativo',
        notes: 'Teste'
      }
    ] as Customer[];

    vi.mocked(customerService.fetchAll).mockResolvedValue(customers)

    const store = useApiStore()
    await store.fetchCustomers()

    expect(store.customers).toEqual(customers)
  })

  it('fetchRevenue sets revenue', async () => {
    const revenue = {
      id: 1,
      customer: 1,
      value: 1000,
      payment_day: 10,
      month: 'Janeiro',
      year: 2024,
      notes: 'Teste',
      paid: 'Pago',
      name: 'Revenue',
      plan: 'Mensal',
      start: '2026-02-20',
      status: 'Ativo'
    } as Revenue;

    vi.mocked(revenueService.fetchAll).mockResolvedValue([revenue])

    const store = useApiStore()
    await store.fetchRevenue()

    expect(store.revenue).toEqual([revenue])
  })

  it('fetchExpenses sets expenses', async () => {
    const expense = {
      id: 10,
      name: 'Conta Luz',
      date: '2024-01-10',
      installments: '2',
      value: 200,
      notes: 'Teste',
      month: 'Janeiro',
      paid: "Pago",
      year: 2026
    } as Expense

    vi.mocked(expenseService.fetchAll).mockResolvedValue([expense])

    const store = useApiStore()
    await store.fetchExpenses()

    expect(store.expenses).toEqual([expense])
  })

  it('fetchData calls all fetch methods', async () => {
    vi.mocked(customerService.fetchAll).mockResolvedValue([])
    vi.mocked(revenueService.fetchAll).mockResolvedValue([])
    vi.mocked(expenseService.fetchAll).mockResolvedValue([])

    const store = useApiStore()
    await store.fetchData()

    expect(vi.mocked(customerService.fetchAll)).toHaveBeenCalled()
    expect(vi.mocked(revenueService.fetchAll)).toHaveBeenCalled()
    expect(vi.mocked(expenseService.fetchAll)).toHaveBeenCalled()
  })

  it('canDeleteCustomer returns false if revenue exists', () => {
    const store = useApiStore()

    store.revenue = [{ id: 1, customer: 99 }] as any

    expect(store.canDeleteCustomer(99)).toBe(false)
  })

  it('canDeleteCustomer returns true if no revenue linked', () => {
    const store = useApiStore()

    store.revenue = [{ id: 1, customer: 2 }] as any

    expect(store.canDeleteCustomer(99)).toBe(true)
  })

  it('logs error if fetchCustomers fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(customerService.fetchAll).mockRejectedValue(new Error('fail'))

    const store = useApiStore()
    await store.fetchCustomers()

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
