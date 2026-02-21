import { vi, describe, it, expect } from 'vitest'
import * as vue from 'vue'
import * as main from "@/main";

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    createApp: vi.fn(() => ({
      component: vi.fn(),
      use: vi.fn(),
      mount: vi.fn()
    }))
  }
})

vi.mock("@/router/index", async (importOriginal) => {
  const actual = (await importOriginal()) as { default: unknown; [key: string]: unknown };
  return {
    ...actual,
    default: actual.default,
  };
});

vi.mock('@/icons', () => ({ library: {} }))

vi.mock("pinia", async (importOriginal) => {
  const actual = (await importOriginal()) as { default: unknown; [key: string]: unknown };
  return {
    ...actual,
    createPinia: vi.fn(() => ({})),
  };
});

describe('main.ts', () => {
  it('configures app correctly', () => {
    const createAppSpy = vue.createApp as unknown as ReturnType<typeof vi.fn>
    expect(createAppSpy).toHaveBeenCalledWith(expect.any(Object))

    const appInstance = createAppSpy.mock.results[0].value
    expect(appInstance.component).toHaveBeenCalledWith('font-awesome-icon', expect.any(Object))
    expect(appInstance.use).toHaveBeenCalledTimes(3) // library, router, pinia
    expect(appInstance.mount).toHaveBeenCalledWith('#app')
  })
})
