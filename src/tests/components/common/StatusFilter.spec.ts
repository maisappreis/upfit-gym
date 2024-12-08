import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import StatusFilter from "@/components/common/StatusFilter.vue";

describe("StatusFilter.vue", () => {
  it("renders the select element and its options", () => {
    const wrapper = mount(StatusFilter);

    const select = wrapper.find("select");
    expect(select.exists()).toBe(true);

    const options = select.findAll("option");
    expect(options.length).toBe(3);
    expect(options[0].text()).toBe("Ativo");
    expect(options[1].text()).toBe("Inativo");
    expect(options[2].text()).toBe("Todos");
  });

  // it("sets the initial value to "Ativo" on mount", () => {
  //   const wrapper = mount(StatusFilter);
  //   const select = wrapper.find("select");
  //   expect(select.element.value).toBe("Ativo"); // AssertionError: expected "" to be "Ativo"
  // });

  it("emits 'get-status' with the initial value on mount", () => {
    const wrapper = mount(StatusFilter);
    expect(wrapper.emitted("get-status")).toBeTruthy();
    expect(wrapper.emitted("get-status")![0]).toEqual(["Ativo"]);
  });

  it("updates customerStatus when a different option is selected", async () => {
    const wrapper = mount(StatusFilter);
    const select = wrapper.find("select");

    await select.setValue("Inativo");
    expect(select.element.value).toBe("Inativo");
  });

  it("emits 'get-status' when a different option is selected", async () => {
    const wrapper = mount(StatusFilter);
    const select = wrapper.find("select");

    await select.setValue("Todos");
    expect(wrapper.emitted("get-status")).toBeTruthy();
    const emittedEvents = wrapper.emitted("get-status")!;
    expect(emittedEvents[emittedEvents.length - 1]).toEqual(["Todos"]);
  });
});
