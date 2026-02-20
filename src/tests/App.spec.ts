// import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
// import App from "@/App.vue";
// import HomeView from "@/components/views/HomeView.vue";
// import LoginView from "@/components/views/LoginView.vue";
// import LoadingScreen from "@/components/base/LoadingScreen.vue";
// // import { useAuthStore } from "@/stores/auth";
// import { useApiStore } from "@/stores/api";
// import { useLoadingStore } from "@/stores/loading";
// import { useRoute } from "vue-router";

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
  // let apiStore: ReturnType<typeof useApiStore>;
  // let loadingStore: ReturnType<typeof useLoadingStore>;
  // const route = useRoute();

  beforeEach(() => {
    setActivePinia(createPinia());
    // authStore = useAuthStore();
    // apiStore = useApiStore();
    // loadingStore = useLoadingStore();
  });

  it("aaa", async () => {
    expect(true).toBe(true);
  });
});
