import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTable from '@/components/base/BaseTable.vue'

interface TestRow {
  id: number
  name: string
  age: number
}

describe('BaseTable', () => {
  const columns = [
    { key: 'name', label: 'Nome', thClass: 'th-name', tdClass: 'td-name' },
    { key: 'age', label: 'Idade' }
  ]

  const data: TestRow[] = [
    { id: 1, name: 'João', age: 30 },
    { id: 2, name: 'Maria', age: 25 }
  ]

  it('renders table headers', () => {
    const wrapper = mount(BaseTable, {
      props: { columns, data }
    })

    const headers = wrapper.findAll('th')
    expect(headers.length).toBe(2)
    expect(headers[0].text()).toBe('Nome')
    expect(headers[1].text()).toBe('Idade')
  })

  it('renders table rows and cells', () => {
    const wrapper = mount(BaseTable, {
      props: { columns, data }
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)

    const firstRowCells = rows[0].findAll('td')
    expect(firstRowCells[0].text()).toBe('João')
    expect(firstRowCells[1].text()).toBe('30')
  })

  it('applies thClass and tdClass', () => {
    const wrapper = mount(BaseTable, {
      props: { columns, data }
    })

    expect(wrapper.find('th').classes()).toContain('th-name')
    expect(wrapper.find('td').classes()).toContain('td-name')
  })

  it('uses rowKey when provided', () => {
    const wrapper = mount(BaseTable, {
      props: {
        columns,
        data,
        rowKey: 'id'
      }
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows[0].attributes('key')).toBeUndefined()
    expect(rows.length).toBe(2)
  })

  it('renders scoped slot content when provided', () => {
    const wrapper = mount(BaseTable, {
      props: { columns, data },
      slots: {
        'cell-name': ({ value }: any) => `👤 ${value}`
      }
    })

    const firstCell = wrapper.find('tbody tr td')
    expect(firstCell.text()).toContain('👤 João')
  })

  it('renders footer slot', () => {
    const wrapper = mount(BaseTable, {
      props: { columns, data },
      slots: {
        footer: '<div class="custom-footer">Footer content</div>'
      }
    })

    expect(wrapper.find('.custom-footer').exists()).toBe(true)
    expect(wrapper.text()).toContain('Footer content')
  })
})
