import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import LoadingScreen from "@/components/common/LoadingScreen.vue";

describe("LoadingScreen.vue", () => {
  it("should render the spinner and overlay", () => {
    const wrapper = mount(LoadingScreen);

    const overlay = wrapper.find(".overlay");
    expect(overlay.exists()).toBe(true);

    const spinner = wrapper.find(".spinner");
    expect(spinner.exists()).toBe(true);

    const message = wrapper.find(".message");
    expect(message.exists()).toBe(true);
  });

  it("should display the slot content as the message", () => {
    const wrapper = mount(LoadingScreen, {
      slots: {
        default: "Loading, please wait...",
      },
    });

    const message = wrapper.find(".message");
    expect(message.text()).toBe("Loading, please wait...");
  });
});
