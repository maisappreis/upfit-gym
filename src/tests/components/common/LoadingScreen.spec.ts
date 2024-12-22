import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import LoadingScreen from "@/components/common/LoadingScreen.vue";
import { useLoadingStore } from "@/stores/loading";

describe("LoadingScreen.vue", () => {
  let loadingStore: ReturnType<typeof useLoadingStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    loadingStore = useLoadingStore();

    loadingStore.isLoading = true;
  });

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
    });

    const message = wrapper.find(".message");
    expect(message.text()).toBe("Carregando...");
  });
});
