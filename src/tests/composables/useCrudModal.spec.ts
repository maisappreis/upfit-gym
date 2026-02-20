import { describe, it, expect } from 'vitest'
import { useCrudModal } from '@/composables/useCrudModal'

interface TestEntity {
  id: number
  name: string
}

describe('useCrudModal', () => {
  it('initial state is correct', () => {
    const modal = useCrudModal<TestEntity>()

    expect(modal.mode.value).toBeNull()
    expect(modal.entity.value).toBeNull()
    expect(modal.deleteIsBlocked.value).toBe(false)

    expect(modal.isOpen.value).toBe(false)
    expect(modal.isForm.value).toBe(false)
    expect(modal.isDelete.value).toBe(false)
  })

  it('openCreate sets correct state', () => {
    const modal = useCrudModal<TestEntity>()

    modal.openCreate()

    expect(modal.mode.value).toBe('create')
    expect(modal.entity.value).toBeNull()

    expect(modal.isOpen.value).toBe(true)
    expect(modal.isForm.value).toBe(true)
    expect(modal.isDelete.value).toBe(false)
  })

  it('openUpdate sets correct state and entity', () => {
    const modal = useCrudModal<TestEntity>()
    const data = { id: 1, name: 'Test' }

    modal.openUpdate(data)

    expect(modal.mode.value).toBe('update')
    expect(modal.entity.value).toEqual(data)

    expect(modal.isOpen.value).toBe(true)
    expect(modal.isForm.value).toBe(true)
    expect(modal.isDelete.value).toBe(false)
  })

  it('openDelete sets correct state and blocked false by default', () => {
    const modal = useCrudModal<TestEntity>()
    const data = { id: 2, name: 'Delete' }

    modal.openDelete(data)

    expect(modal.mode.value).toBe('delete')
    expect(modal.entity.value).toEqual(data)
    expect(modal.deleteIsBlocked.value).toBe(false)

    expect(modal.isOpen.value).toBe(true)
    expect(modal.isForm.value).toBe(false)
    expect(modal.isDelete.value).toBe(true)
  })

  it('openDelete sets deleteIsBlocked when true', () => {
    const modal = useCrudModal<TestEntity>()
    const data = { id: 3, name: 'Blocked' }

    modal.openDelete(data, true)

    expect(modal.mode.value).toBe('delete')
    expect(modal.deleteIsBlocked.value).toBe(true)
  })

  it('close resets state', () => {
    const modal = useCrudModal<TestEntity>()
    const data = { id: 4, name: 'Any' }

    modal.openDelete(data, true)
    modal.close()

    expect(modal.mode.value).toBeNull()
    expect(modal.entity.value).toBeNull()
    expect(modal.deleteIsBlocked.value).toBe(false)

    expect(modal.isOpen.value).toBe(false)
    expect(modal.isForm.value).toBe(false)
    expect(modal.isDelete.value).toBe(false)
  })
})
