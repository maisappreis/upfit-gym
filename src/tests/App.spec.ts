import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from "@testing-library/vue";

import App from "@/App.vue";
import { useAuthStore } from "@/stores/auth";
import { useApiStore } from "@/stores/api";
import { useLoadingStore } from "@/stores/loading";
import { useAlertStore } from "@/stores/alert";

vi.mock("@/stores/auth");
vi.mock("@/stores/api");
vi.mock("@/stores/loading");
vi.mock("@/stores/alert");

describe("App.vue", () => {
  let checkAuthMock: any;
  let fetchDataMock: any;
  let startMock: any;
  let stopMock: any;

  beforeEach(() => {
    checkAuthMock = vi.fn();
    fetchDataMock = vi.fn();
    startMock = vi.fn();
    stopMock = vi.fn();

    (useAuthStore as any).mockReturnValue({
      checkAuthentication: checkAuthMock,
    });
    (useApiStore as any).mockReturnValue({
      fetchData: fetchDataMock,
    });
    (useLoadingStore as any).mockReturnValue({
      start: startMock,
      stop: stopMock,
      isLoading: false,
    });
    (useAlertStore as any).mockReturnValue({
      visible: false,
    });
  });

  it("renders RouterView", async () => {
    render(App, {
      global: {
        stubs: {
          RouterView: {
            template: '<div data-testid="router-view"></div>'
          },
          AlertMessage: true,
          LoadingScreen: true
        },
      },
    });

    expect(screen.getByTestId("router-view")).toBeTruthy();
  });

  it('renders RouterView', () => {
    const { container } = render(App, {
      global: {
        stubs: {
          RouterView: true
        }
      }
    })

    expect(container.querySelector('router-view-stub')).toBeTruthy()
  })
});
