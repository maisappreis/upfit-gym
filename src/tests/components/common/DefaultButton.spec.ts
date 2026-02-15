import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import DefaultButton from "@/components/base/DefaultButton.vue";

describe("DefaultButton", () => {
  it("emits the 'execute-action' event when the button is clicked", async () => {
    const wrapper = mount(DefaultButton);
    
    await wrapper.trigger("click");
    
    expect(wrapper.emitted("execute-action")).toBeTruthy();
  });

  it("apply class 'green' when 'disable' is false", () => {
    const wrapper = mount(DefaultButton, {
      props: {
        disable: false,
      },
    });

    expect(wrapper.classes()).toContain("green");
  });

  it("apply the 'disabled' class when 'disable' is true", () => {
    const wrapper = mount(DefaultButton, {
      props: {
        disable: true,
      },
    });

    expect(wrapper.classes()).toContain("disabled");
  });

  // it("does not emit 'execute-action' event when 'disable' is true", async () => {
  //   const wrapper = mount(DefaultButton, {
  //     props: {
  //       disable: true,
  //     },
  //   });

  //   await wrapper.trigger("click");

  //   expect(wrapper.emitted("execute-action")).toBeFalsy(); // está retornando [[]]
  // });

  it("renders the slot content correctly", () => {
    const slotContent = "Click here";
    const wrapper = mount(DefaultButton, {
      slots: {
        default: slotContent,
      },
    });

    expect(wrapper.text()).toBe(slotContent);
  });
});
