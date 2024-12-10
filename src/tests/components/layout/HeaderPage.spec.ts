import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import HeaderPage from "@/components/layout/HeaderPage.vue";
import { useAuthStore } from "@/stores/auth";
import { usePageStore } from "@/stores/page";

const mockFontAwesomeIcon = {
  template: `<span><slot /></span>`
};

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/components/views/HomeView.vue")
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/components/views/LoginView.vue")
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/"
  }
];

describe("HeaderPage", () => {
  let wrapper: VueWrapper<any, any>;
  let pageStore: ReturnType<typeof usePageStore>; 
  let authStore: ReturnType<typeof useAuthStore>; 

  beforeEach(() => {
    setActivePinia(createPinia());
    pageStore = usePageStore();
    authStore = useAuthStore();

    authStore.isAuthenticated = false;
    pageStore.currentPage = "metrics";

    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    wrapper = mount(HeaderPage, {
      global: {
        components: {
          "font-awesome-icon": mockFontAwesomeIcon
        },
        plugins: [router]
      }
    });
  });

  it("renders the header title and subtitle correctly", () => {
    expect(wrapper.find(".title").text()).toBe("Métricas");
    expect(wrapper.find(".subtitle").text()).toBe("Visualização gráfica de receita, despesas, lucro e clientes");
  });

  it("shows login icon when not authenticated", () => {
    expect(wrapper.find("#login-icon").exists()).toBe(true);
  });

  it("shows user greeting when authenticated", async () => {
    const authStore = useAuthStore();
    authStore.isAuthenticated = true;

    await wrapper.vm.$nextTick();

    expect(wrapper.find("#login").exists()).toBe(true);
    expect(wrapper.find("#login").text()).toContain("Olá, Renan");
  });

  // it("toggles dropdown on click", async () => {
  //   expect(wrapper.find(".dropdown").exists()).toBe(false);

  //   await wrapper.find("#login").trigger("click");
    
  //   expect(wrapper.find(".dropdown").exists()).toBe(true);
    
  //   await wrapper.find("#login").trigger("click");
    
  //   expect(wrapper.find(".dropdown").exists()).toBe(false);
  // });

  it("calls logout function when dropdown is clicked", async () => {
    const authStore = useAuthStore();
    authStore.isAuthenticated = true;
    const logoutSpy = vi.spyOn(authStore, "logout");

    await wrapper.vm.$nextTick();
    await wrapper.find("#login").trigger("click"); // Open dropdown
    await wrapper.find(".dropdown").trigger("click"); // Click logout

    expect(logoutSpy).toHaveBeenCalled();
  });

  it("updates the title and subtitle when the current page changes", async () => {
    const pageStore = usePageStore();
    pageStore.currentPage = "customers";

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".title").text()).toBe("Clientes");
    expect(wrapper.find(".subtitle").text()).toBe("Cadastramento dos clientes");
  });
});
