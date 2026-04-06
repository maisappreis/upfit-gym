import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import SideBar from '@/shared/components/layout/SideBar.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/metricas', component: { template: '<div />' } },
    { path: '/clientes', component: { template: '<div />' } },
    { path: '/receitas', component: { template: '<div />' } },
    { path: '/despesas', component: { template: '<div />' } }
  ]
})

describe('SideBar', () => {
  const factory = async () => {
    router.push("/") // 👈 define rota inicial (importante)

    await router.isReady()

    return mount(SideBar, {
      global: {
        plugins: [router],
        stubs: {
          LogoType: true,
          'font-awesome-icon': true
        }
      }
    })
  }

  // it('renders sidebar container', () => {
  //   const wrapper = factory()
  //   expect(wrapper.find('.sidebar-area').exists()).toBe(true)
  // })
  it('renders sidebar container', async () => {
    const wrapper = await factory()
    expect(wrapper.find('.sidebar-area').exists()).toBe(true)
  })

  it('renders all menu items', async () => {
    // const wrapper = factory()
    const wrapper = await factory()

    const items = wrapper.findAll('li.option')
    expect(items).toHaveLength(4)

    expect(wrapper.text()).toContain('Métricas')
    expect(wrapper.text()).toContain('Clientes')
    expect(wrapper.text()).toContain('Receitas')
    expect(wrapper.text()).toContain('Despesas')
  })

  it('renders correct router links', async () => {
    const wrapper = await factory()

    const links = wrapper.findAllComponents({ name: 'RouterLink' })
    const paths = links.map((link) => link.props('to'))

    expect(paths).toEqual(['/metricas', '/clientes', '/receitas', '/despesas'])
  })

  it('renders footer text', async () => {
    const wrapper = await factory()
    expect(wrapper.text()).toContain('Desenvolvido com')
    expect(wrapper.text()).toContain('Maisa')
  })
})
