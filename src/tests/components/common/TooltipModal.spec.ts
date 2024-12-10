import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import TooltipModal from "@/components/common/TooltipModal.vue";

describe("TooltipModal.vue", () => {
  it("should render the component correctly", () => {
    const wrapper = mount(TooltipModal, {
      props: {
        mouseX: 100,
        mouseY: 200,
      },
      slots: {
        default: "Tooltip text",
      },
    });

    expect(wrapper.text()).toBe("Tooltip text");

    const tooltipArea = wrapper.find(".tooltip-area");
    expect(tooltipArea.exists()).toBe(true);
    expect(tooltipArea.attributes("style")).toContain("top: 200px;");
    expect(tooltipArea.attributes("style")).toContain("left: 100px;");
  });

  it("should update the position based on the props", async () => {
    const wrapper = mount(TooltipModal, {
      props: {
        mouseX: 50,
        mouseY: 150,
      },
      slots: {
        default: "Another tooltip",
      },
    });

    const tooltipArea = wrapper.find(".tooltip-area");
    expect(tooltipArea.attributes("style")).toContain("top: 150px;");
    expect(tooltipArea.attributes("style")).toContain("left: 50px;");

    await wrapper.setProps({ mouseX: 75, mouseY: 175 });
    expect(tooltipArea.attributes("style")).toContain("top: 175px;");
    expect(tooltipArea.attributes("style")).toContain("left: 75px;");
  });
});
