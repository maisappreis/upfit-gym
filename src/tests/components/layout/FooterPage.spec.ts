import { describe, it, expect, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import FooterPage from "@/components/layout/FooterPage.vue";

const mockFontAwesomeIcon = {
  props: ['icon'],
  template: '<span class="font-awesome-icon">{{ icon }}</span>'
};

describe("FooterPage", () => {
  let wrapper: VueWrapper<any, any>;

  beforeEach(() => {
    wrapper = mount(FooterPage, {
        global: {
          components: {
            "font-awesome-icon": mockFontAwesomeIcon
          }
        }
      }
    );
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays the correct footer text", () => {
    expect(wrapper.find(".footer-text").text()).toContain("Desenvolvido com");
    expect(wrapper.find(".footer-text").text()).toContain("por Maisa.");
  });

  it("renders the Font Awesome icon", () => {
    const icon = wrapper.find(".font-awesome-icon");
    expect(icon.exists()).toBe(true);
    expect(icon.text()).toContain("fa-solid fa-heart");
  });
});
