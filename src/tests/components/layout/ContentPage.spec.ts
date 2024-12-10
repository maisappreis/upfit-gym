import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import ContentPage from "@/components/layout/ContentPage.vue";
import MetricsPage from "@/components/content/MetricsPage.vue";
import CustomersPage from "@/components/content/CustomersPage.vue";
import RevenuePage from "@/components/content/RevenuePage.vue";
import ExpensesPage from "@/components/content/ExpensesPage.vue";
import { usePageStore } from "@/stores/page";

const mockFontAwesomeIcon = {
  template: `<span><slot /></span>`
};

describe("ContentPage.vue", () => {
  let pageStore: ReturnType<typeof usePageStore>; 

  beforeEach(() => {
    setActivePinia(createPinia());
    pageStore = usePageStore();
  });

  it("renders MetricsPage when currentPage is 'metrics'", () => {
    pageStore.currentPage = "metrics";

    const wrapper = mount(ContentPage, {
      global: {
        components: {
          "font-awesome-icon": mockFontAwesomeIcon
        }
      }
    });

    expect(wrapper.findComponent(MetricsPage).exists()).toBe(true);
    expect(wrapper.findComponent(CustomersPage).exists()).toBe(false);
    expect(wrapper.findComponent(RevenuePage).exists()).toBe(false);
    expect(wrapper.findComponent(ExpensesPage).exists()).toBe(false);
  });

  it("renders CustomersPage when currentPage is 'customers'", () => {
    pageStore.currentPage = "customers";

    const wrapper = mount(ContentPage, {
      global: {
        components: {
          "font-awesome-icon": mockFontAwesomeIcon
        }
      }
    });

    expect(wrapper.findComponent(CustomersPage).exists()).toBe(true);
    expect(wrapper.findComponent(MetricsPage).exists()).toBe(false);
    expect(wrapper.findComponent(RevenuePage).exists()).toBe(false);
    expect(wrapper.findComponent(ExpensesPage).exists()).toBe(false);
  });

  // it("renders RevenuePage when currentPage is 'revenue'", () => {
  //   pageStore.currentPage = "revenue";

  //   const wrapper = mount(ContentPage, {
  //     global: {
  //       components: {
  //         "font-awesome-icon": mockFontAwesomeIcon
  //       }
  //     }
  //   });

  //   expect(wrapper.findComponent(RevenuePage).exists()).toBe(true);
  //   expect(wrapper.findComponent(MetricsPage).exists()).toBe(false);
  //   expect(wrapper.findComponent(CustomersPage).exists()).toBe(false);
  //   expect(wrapper.findComponent(ExpensesPage).exists()).toBe(false);
  // });

  // it("renders ExpensesPage when currentPage is 'expenses'", () => {
  //   pageStore.currentPage = "expenses";

  //   const wrapper = mount(ContentPage, {
  //     global: {
  //       components: {
  //         "font-awesome-icon": mockFontAwesomeIcon
  //       }
  //     }
  //   });

  //   expect(wrapper.findComponent(ExpensesPage).exists()).toBe(true);
  //   expect(wrapper.findComponent(MetricsPage).exists()).toBe(false);
  //   expect(wrapper.findComponent(CustomersPage).exists()).toBe(false);
  //   expect(wrapper.findComponent(RevenuePage).exists()).toBe(false);
  // });
});
