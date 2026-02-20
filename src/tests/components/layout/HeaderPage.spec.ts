import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import HeaderPage from '@/components/layout/HeaderPage.vue'

const logoutMock = vi.fn()

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
    logout: logoutMock
  })
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      component: { template: '<div />' },
      meta: {
        icon: 'fa-solid fa-house',
        title: 'Dashboard',
        subtitle: 'Resumo geral'
      }
    },
    {
      path: '/login',
      component: { template: '<div />' }
    }
  ]
})

describe('HeaderPage', () => {
  beforeEach(async () => {
    logoutMock.mockClear()
    router.push('/')
    await router.isReady()
  })

  const factory = () =>
    mount(HeaderPage, {
      global: {
        plugins: [router],
        stubs: {
          'font-awesome-icon': true,
          RouterView: true
        }
      }
    })

  it('renders title and subtitle from route meta', () => {
    const wrapper = factory()

    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('Resumo geral')
  })

  it('shows authenticated area when user is authenticated', () => {
    const wrapper = factory()

    expect(wrapper.text()).toContain('Olá,')
    expect(wrapper.find('.login').exists()).toBe(true)
  })

  it('toggles dropdown when clicking login area', async () => {
    const wrapper = factory()

    expect(wrapper.find('.dropdown').exists()).toBe(false)

    await wrapper.find('.login').trigger('click')
    expect(wrapper.find('.dropdown').exists()).toBe(true)

    await wrapper.find('.login').trigger('click')
    expect(wrapper.find('.dropdown').exists()).toBe(false)
  })

  it('calls logout when clicking dropdown', async () => {
    const wrapper = factory()

    await wrapper.find('.login').trigger('click')
    await wrapper.find('.dropdown').trigger('click')

    expect(logoutMock).toHaveBeenCalled()
  })
})
