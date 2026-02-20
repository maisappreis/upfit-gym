import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import LayoutView from '@/components/views/LayoutView.vue'

describe('LayoutView', () => {
  const factory = () =>
    shallowMount(LayoutView, {
      global: {
        stubs: {
          HeaderPage: true,
          SideBar: true
        }
      }
    })

  it('renders HeaderPage component', () => {
    const wrapper = factory()
    expect(wrapper.findComponent({ name: 'HeaderPage' }).exists()).toBe(true)
  })

  it('renders SideBar component', () => {
    const wrapper = factory()
    expect(wrapper.findComponent({ name: 'SideBar' }).exists()).toBe(true)
  })
})
