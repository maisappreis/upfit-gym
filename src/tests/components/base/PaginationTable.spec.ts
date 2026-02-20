import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PaginationTable from '@/components/base/PaginationTable.vue'

describe('PaginationTable', () => {
  const factory = (props = {}) =>
    mount(PaginationTable, {
      props: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 100,
        ...props
      }
    })

  it('renders correct page and total pages', () => {
    const wrapper = factory()
    expect(wrapper.text()).toContain('Página 1 de 10')
    expect(wrapper.text()).toContain('Total de 100 itens')
  })

  it('disables first/previous buttons on first page', () => {
    const wrapper = factory({ currentPage: 1 })
    const buttons = wrapper.findAll('button')

    expect(buttons[0].attributes('disabled')).toBeDefined()
    expect(buttons[1].attributes('disabled')).toBeDefined()
  })

  it('disables next/last buttons on last page', () => {
    const wrapper = factory({ currentPage: 10 })
    const buttons = wrapper.findAll('button')

    const lastIndex = buttons.length - 1
    expect(buttons[lastIndex].attributes('disabled')).toBeDefined()
    expect(buttons[lastIndex - 1].attributes('disabled')).toBeDefined()
  })

  it('emits update:currentPage when clicking a page number', async () => {
    const wrapper = factory({ currentPage: 5 })
    const pageButton = wrapper.findAll('button').find((btn) => btn.text() === '6')

    await pageButton?.trigger('click')

    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([6])
  })

  it('emits previous page', async () => {
    const wrapper = factory({ currentPage: 5 })
    const previousButton = wrapper.findAll('button')[1]

    await previousButton.trigger('click')

    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([4])
  })

  it('emits next page', async () => {
    const wrapper = factory({ currentPage: 5 })
    const nextButton = wrapper
      .findAll('button')
      .find((btn) => btn.attributes('aria-label') === 'Próxima página')

    await nextButton?.trigger('click')

    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([6])
  })

  it('emits first page', async () => {
    const wrapper = factory({ currentPage: 5 })
    const firstButton = wrapper.findAll('button')[0]

    await firstButton.trigger('click')

    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([1])
  })

  it('emits last page', async () => {
    const wrapper = factory({ currentPage: 5 })
    const lastButton = wrapper
      .findAll('button')
      .find((btn) => btn.attributes('aria-label') === 'Última página')

    await lastButton?.trigger('click')

    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([10])
  })

  it('emits update:itemsPerPage when changing select', async () => {
    const wrapper = factory()
    const select = wrapper.find('select')

    await select.setValue('20')

    expect(wrapper.emitted('update:itemsPerPage')?.[0]).toEqual([20])
  })

  it('calculates totalPages correctly when totalItems is 0', () => {
    const wrapper = factory({ totalItems: 0 })
    expect(wrapper.text()).toContain('Página 1 de 1')
  })
})
