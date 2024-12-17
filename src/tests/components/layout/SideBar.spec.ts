import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import SideBar from "@/components/layout/SideBar.vue";
import { usePageStore } from "@/stores/page";

const mockFontAwesomeIcon = {
  template: `<span><slot /></span>`
};

describe("SideBar.vue", () => {
  let pageStore: ReturnType<typeof usePageStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    pageStore = usePageStore();
  });

  it("renderiza o componente corretamente", () => {
    const wrapper = mount(SideBar, {
      global: {
        components: {
          "font-awesome-icon": mockFontAwesomeIcon
        }
      }
    });

    expect(wrapper.find(".sidebar-area").exists()).toBe(true);
    expect(wrapper.findAll("li.option")).toHaveLength(4);
  });

  it("marca a opção 'Métricas' como selecionada ao alterar o estado do store", async () => {
    const wrapper = mount(SideBar, {
      global: {
        components: {
          "font-awesome-icon": mockFontAwesomeIcon
        }
      }
    });

    pageStore.currentPage = "metrics";
    await wrapper.vm.$nextTick();

    const metricsOption = wrapper.find("li.option.selectedOption");
    expect(metricsOption.exists()).toBe(true);
    expect(metricsOption.find(".option-text").text()).toBe("Métricas");
  });

  // it("aciona a ação do Pinia ao clicar em uma opção", async () => {
  //   const wrapper = mount(SideBar, {
  //     global: {
  //       components: {
  //         "font-awesome-icon": mockFontAwesomeIcon
  //       }
  //     }
  //   });

  //   const customersOption = wrapper.findAll("li.option");
  //   await customersOption[1].trigger("click");
  //   // const customersOption = wrapper.findAll("li.option").at(1);
  //   // await customersOption?.trigger("click");

  //   expect(pageStore.openPage).toHaveBeenCalledWith("customers");
  // });

  // it("alterna corretamente o ícone selecionado ao alterar o estado do store", async () => {
  //   const wrapper = mount(SideBar, {
  //     global: {
  //       components: {
  //         "font-awesome-icon": mockFontAwesomeIcon
  //       }
  //     }
  //   });

  //   pageStore.currentPage = "expenses";
  //   await wrapper.vm.$nextTick();

  //   const selectedIcon = wrapper.find(".icon.selectedIcon");
  //   expect(selectedIcon.exists()).toBe(true);
  //   expect(selectedIcon.classes()).toContain("fa-money-bill-transfer");
  // });

  // it("renderiza corretamente o modo responsivo para telas menores", async () => {
  //   const wrapper = mount(SideBar, {
  //     global: {
  //       plugins: [createTestingPinia()],
  //     },
  //   });

  //   global.innerWidth = 900; // Simula o tamanho da tela
  //   window.dispatchEvent(new Event("resize"));
  //   await wrapper.vm.$nextTick();

  //   const sidebar = wrapper.find(".sidebar-area");
  //   expect(sidebar.element.style.minWidth).toBe("20px");
  //   expect(sidebar.element.style.maxWidth).toBe("70px");
  // });
});
