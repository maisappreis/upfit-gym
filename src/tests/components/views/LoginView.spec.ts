import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import LoginView from '@/components/views/LoginView.vue'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  })
}))

const loginMock = vi.fn()
const checkAuthMock = vi.fn()

let isAuthenticatedMock = false

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    login: loginMock,
    checkAuthentication: checkAuthMock,
    get isAuthenticated() {
      return isAuthenticatedMock
    }
  })
}))

const successMock = vi.fn()
const errorMock = vi.fn()

vi.mock('@/stores/alert', () => ({
  useAlertStore: () => ({
    success: successMock,
    error: errorMock
  })
}))

const startMock = vi.fn()
const stopMock = vi.fn()

vi.mock('@/stores/loading', () => ({
  useLoadingStore: () => ({
    start: startMock,
    stop: stopMock
  })
}))

describe('LoginView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const factory = () =>
    mount(LoginView, {
      global: {
        stubs: {
          BaseButton: {
            template: '<button><slot /></button>'
          }
        }
      }
    })

  it('renders login form', () => {
    const wrapper = factory()

    expect(wrapper.find('input#username').exists()).toBe(true)
    expect(wrapper.find('input#password').exists()).toBe(true)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('button is disabled when fields are empty', () => {
    const wrapper = factory()
    const vm = wrapper.vm as any

    expect(vm.disable).toBe(true)
  })

  it('enables button when fields are filled', async () => {
    const wrapper = factory()

    await wrapper.find('#username').setValue('admin')
    await wrapper.find('#password').setValue('123')

    const vm = wrapper.vm as any
    expect(vm.disable).toBe(false)
  })

  it('calls login and redirects on success', async () => {
    loginMock.mockResolvedValueOnce(true)

    const wrapper = factory()

    await wrapper.find('#username').setValue('admin')
    await wrapper.find('#password').setValue('123')

    await wrapper.find('form').trigger('submit.prevent')
    await nextTick()

    expect(startMock).toHaveBeenCalled()
    expect(loginMock).toHaveBeenCalledWith({
      username: 'admin',
      password: '123'
    })
    expect(successMock).toHaveBeenCalledWith('Login realizado com sucesso!')
    expect(pushMock).toHaveBeenCalledWith('/metricas')
    expect(stopMock).toHaveBeenCalled()
  })

  it('shows error when login fails', async () => {
    loginMock.mockRejectedValueOnce(new Error('fail'))

    const wrapper = factory()

    await wrapper.find('#username').setValue('admin')
    await wrapper.find('#password').setValue('123')

    await wrapper.find('form').trigger('submit.prevent')
    await nextTick()

    expect(errorMock).toHaveBeenCalledWith('Erro ao fazer login.', expect.any(Error))
    expect(stopMock).toHaveBeenCalled()
  })

  it('calls checkAuthentication on mount', () => {
    factory()
    expect(checkAuthMock).toHaveBeenCalled()
  })

  it('redirects if already authenticated', async () => {
    isAuthenticatedMock = true

    factory()
    await nextTick()

    expect(successMock).toHaveBeenCalledWith('Você já está logado! Redirecionando...')
    expect(pushMock).toHaveBeenCalledWith('/')
  })
})
