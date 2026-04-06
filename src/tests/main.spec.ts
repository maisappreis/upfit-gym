import { vi, describe, it, expect } from "vitest"

const componentMock = vi.fn()
const useMock = vi.fn()
const mountMock = vi.fn()

const createAppMock = vi.fn(() => ({
  component: componentMock,
  use: useMock,
  mount: mountMock
}))

const createPiniaMock = vi.fn(() => ({}))
const checkAuthenticationMock = vi.fn()

vi.mock("vue", () => ({
  createApp: createAppMock
}))

vi.mock("pinia", () => ({
  createPinia: createPiniaMock
}))

vi.mock("@/features/auth/stores/auth", () => ({
  useAuthStore: () => ({
    checkAuthentication: checkAuthenticationMock
  })
}))

vi.mock("@/router/index", () => ({
  default: {}
}))

vi.mock("@/icons", () => ({
  library: {}
}))

vi.mock("@fortawesome/vue-fontawesome", () => ({
  FontAwesomeIcon: {}
}))

vi.mock("@/App.vue", () => ({
  default: {}
}))

vi.mock("@/assets/css/global.css", () => ({}))

describe("main.ts", () => {

  it("configures and mounts the Vue app correctly", async () => {

    await import("@/main")

    expect(createAppMock).toHaveBeenCalled()

    expect(componentMock).toHaveBeenCalledWith(
      "font-awesome-icon",
      expect.anything()
    )

    expect(useMock).toHaveBeenCalledTimes(3)

    expect(checkAuthenticationMock).toHaveBeenCalled()

    expect(mountMock).toHaveBeenCalledWith("#app")
  })
})