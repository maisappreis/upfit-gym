import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { useTablePagination } from '@/composables/useTablePagination'

const searchMock = vi.fn()

vi.mock('@/utils/dataUtils', () => ({
  searchData: (...args: any[]) => searchMock(...args)
}))

interface Item {
  name: string
}

describe('useTablePagination', () => {
  const dataRef = ref<Item[]>([])
  const searchedFieldRef = ref<string[]>([])

  beforeEach(() => {
    dataRef.value = []
    searchedFieldRef.value = []
    searchMock.mockReset()
  })

  it('returns paginated data correctly', () => {
    dataRef.value = Array.from({ length: 100 }, (_, i) => ({
      name: `Item ${i + 1}`
    }))

    searchMock.mockImplementation((data) => data)

    const { paginatedData } = useTablePagination(
      () => dataRef.value,
      () => searchedFieldRef.value
    )

    expect(paginatedData.value.length).toBe(30)
    expect(paginatedData.value[0].name).toBe('Item 1')
    expect(paginatedData.value[29].name).toBe('Item 30')
  })

  it('changes page correctly', async () => {
    dataRef.value = Array.from({ length: 50 }, (_, i) => ({
      name: `Item ${i + 1}`
    }))

    searchMock.mockImplementation((data) => data)

    const { currentPage, paginatedData } = useTablePagination(
      () => dataRef.value,
      () => searchedFieldRef.value
    )

    currentPage.value = 2
    await nextTick()

    expect(paginatedData.value[0].name).toBe('Item 31')
  })

  it('resets page when data changes', async () => {
    dataRef.value = Array.from({ length: 50 }, (_, i) => ({
      name: `Item ${i + 1}`
    }))

    searchMock.mockImplementation((data) => data)

    const { currentPage } = useTablePagination(
      () => dataRef.value,
      () => searchedFieldRef.value
    )

    currentPage.value = 2
    await nextTick()

    dataRef.value = [{ name: 'New Item' }]
    await nextTick()

    expect(currentPage.value).toBe(1)
  })

  it('resets page when searchedField changes', async () => {
    dataRef.value = [{ name: 'A' }, { name: 'B' }]

    searchMock.mockImplementation((data) => data)

    const { currentPage } = useTablePagination(
      () => dataRef.value,
      () => searchedFieldRef.value
    )

    currentPage.value = 3
    await nextTick()

    searchedFieldRef.value = ['A']
    await nextTick()

    expect(currentPage.value).toBe(1)
  })

  it('resets page when itemsPerPage changes', async () => {
    dataRef.value = Array.from({ length: 50 }, (_, i) => ({
      name: `Item ${i + 1}`
    }))

    searchMock.mockImplementation((data) => data)

    const { currentPage, itemsPerPage } = useTablePagination(
      () => dataRef.value,
      () => searchedFieldRef.value
    )

    currentPage.value = 2
    await nextTick()

    itemsPerPage.value = 10
    await nextTick()

    expect(currentPage.value).toBe(1)
  })

  it('uses searchData correctly', () => {
    dataRef.value = [{ name: 'A' }]
    searchedFieldRef.value = ['A']

    searchMock.mockReturnValue([{ name: 'Filtered' }])

    const { paginatedData } = useTablePagination(
      () => dataRef.value,
      () => searchedFieldRef.value
    )

    // 👇 força execução do computed
    const result = paginatedData.value

    expect(searchMock).toHaveBeenCalledWith(
      dataRef.value,
      searchedFieldRef.value
    )

    expect(result).toEqual([{ name: 'Filtered' }])
  })
})
