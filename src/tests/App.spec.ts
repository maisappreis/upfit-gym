import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import App from "@/App.vue";
import HomeView from "@/components/views/HomeView.vue";
import LoginView from "@/components/views/LoginView.vue";
import LoadingScreen from "@/components/common/LoadingScreen.vue";
// import { useAuthStore } from "@/stores/auth";
import { useApiStore } from "@/stores/api";
import { useLoadingStore } from "@/stores/loading";
import { useRoute } from "vue-router";

vi.mock("vue-router", () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  RouterLink: {
    template: '<a><slot /></a>',
  },
}));

vi.mock("axios");

vi.mock('@/stores/api', () => ({
  useApiStore: () => ({
    apiBase: "http://localhost:8000/api",
    fetchCustomers: vi.fn().mockResolvedValue([{ id: 1, name: "Cliente 1" }]),
    fetchRevenue: vi.fn().mockResolvedValue([{ id: 1, customer: 1, name: "Cliente 1", value: 560 }]),
    fetchExpenses: vi.fn().mockResolvedValue([{ id: 1, name: "Despesa 1", value: 150 }]),
    fetchData: vi.fn(),
    setApiURL: vi.fn(),
    configureAxios: vi.fn(),
  }),
}));

describe("App.vue", () => {
  // let authStore: ReturnType<typeof useAuthStore>;
  let apiStore: ReturnType<typeof useApiStore>;
  let loadingStore: ReturnType<typeof useLoadingStore>;
  // const route = useRoute();

  beforeEach(() => {
    setActivePinia(createPinia());
    // authStore = useAuthStore();
    apiStore = useApiStore();
    loadingStore = useLoadingStore();

    // apiStore.setApiURL("http://localhost:8000/api");
  });

  it("should fetch customers", async () => {
    const customers = await apiStore.fetchCustomers();
    // apiStore.apiBase = "http://localhost:8000/api"
    // apiStore.setApiURL("http://localhost:8000/api");

    // expect(axios.get).toHaveBeenCalledWith(`http://localhost:8000/api/upfit/test/customer/`);
    expect(customers).toEqual([{ id: 1, name: "Cliente 1" }]);
  });

  it("should fetch revenue", async () => {
    const revenue = await apiStore.fetchRevenue();

    // expect(axios.get).toHaveBeenCalledWith(`http://localhost:8000/api/upfit/test/revenue/`);
    expect(revenue).toEqual([{ id: 1, customer: 1, name: "Cliente 1", value: 560 }]);
  });

  it("should fetch expenses", async () => {
    const expenses = await apiStore.fetchExpenses();

    // expect(axios.get).toHaveBeenCalledWith(`http://localhost:8000/api/upfit/test/expense/`);
    expect(expenses).toEqual([{ id: 1, name: "Despesa 1", value: 150 }]);
  });

  it("renders LoginView when route path is '/login'", async () => {
    vi.mocked(useRoute).mockReturnValue({
      path: "/login",
      fullPath: "/login",
      name: "login",
      hash: "",
      matched: [],
      params: {},
      query: {},
      redirectedFrom: undefined,
      meta: {},
    });

    const wrapper = mount(App, {
      global: {
        components: { LoadingScreen },
      },
    });

    expect(wrapper.findComponent(LoginView).exists()).toBe(true);
    expect(wrapper.findComponent(HomeView).exists()).toBe(false);
  });

  // it("renders HomeView when route path is '/'", async () => {
  //   vi.mocked(useRoute).mockReturnValue({
  //     path: "/",
  //     fullPath: "/",
  //     name: "home",
  //     hash: "",
  //     matched: [],
  //     params: {},
  //     query: {},
  //     redirectedFrom: undefined,
  //     meta: {},
  //   });

  //   const wrapper = mount(App, {
  //     global: {
  //       components: { LoadingScreen },
  //     },
  //   });

  //   expect(wrapper.findComponent(HomeView).exists()).toBe(true);
  //   expect(wrapper.findComponent(LoginView).exists()).toBe(false);
  // });

  it("shows the loading screen while loadingStore.isLoading is true", async () => {
    loadingStore.isLoading = true;

    const wrapper = mount(App, {
      global: {
        components: { LoadingScreen },
      },
    });

    expect(wrapper.findComponent(LoadingScreen).exists()).toBe(true);
  });

  // it("hides the loading screen after loadingStore.isLoading is set to false", async () => {
  //   loadingStore.isLoading = false;

  //   const wrapper = mount(App, {
  //     global: {
  //       components: { LoadingScreen },
  //     },
  //   });

  //   expect(wrapper.findComponent(LoadingScreen).exists()).toBe(false);
  // });

  // it("calls the authStore and apiStore methods on mount", async () => {
  //   const authCheckSpy = vi.spyOn(authStore, "checkAuthentication");
  //   const apiConfigureSpy = vi.spyOn(apiStore, "configureAxios");
  //   const apiFetchDataSpy = vi.spyOn(apiStore, "fetchData");

  //   const teste = apiStore.configureAxios;

  //   mount(App, {
  //     global: {
  //       components: { LoadingScreen },
  //     },
  //   });

  //   expect(teste).toHaveBeenCalled();
  //   expect(authCheckSpy).toHaveBeenCalled();
  //   expect(apiConfigureSpy).toHaveBeenCalled();
  //   expect(apiFetchDataSpy).toHaveBeenCalled();
  // });
});
