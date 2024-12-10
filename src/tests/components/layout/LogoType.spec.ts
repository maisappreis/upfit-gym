import { describe, it, expect, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import LogoType from "@/components/layout/LogoType.vue";

describe("LogoType", () => {
  let wrapper: VueWrapper<any, any>;

  beforeEach(() => {
    wrapper = mount(LogoType);
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays the logo image", () => {
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("/upfit-gym/src/assets/logo.png");
    expect(img.attributes("alt")).toBe("Logo");
  });
});
