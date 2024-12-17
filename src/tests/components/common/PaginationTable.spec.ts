import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import PaginationTable from "@/components/common/PaginationTable.vue";

describe("PaginationTable Component", () => {
  const defaultProps = {
    currentPage: 1,
    itemsPerPage: 5,
    searchedField: [],
    data: Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Customer ${i + 1}`,
      frequency: "3x",
      plan: "Mensal",
      value: 350,
      start: "2024-12-17",
      status: "Pago",
      notes: "Notes to teste."
    })),
  };

  it("renders correctly", () => {
    const wrapper = mount(PaginationTable, { props: defaultProps });
    expect(wrapper.find(".pagination-area").exists()).toBe(true);
  });

  it("calculates total pages correctly", () => {
    const wrapper = mount(PaginationTable, { props: defaultProps });
    expect(wrapper.text()).toContain("Página 1 de 5");
  });

  it("emits 'current-page' event when navigating to a specific page", async () => {
    const wrapper = mount(PaginationTable, { props: defaultProps });
    const pageButtons = wrapper.findAll(".pagination-button");
    
    await pageButtons[3].trigger("click");
    expect(wrapper.emitted("current-page")).toBeTruthy();
    expect(wrapper.emitted("current-page")![0]).toEqual([2]);
  });

  // it("emits 'current-page' event when clicking next and previous buttons", async () => {
  //   const wrapper = mount(PaginationTable, { props: defaultProps });

  //   const nextButton = wrapper.find(".pagination-button:nth-child(4)");
  //   await nextButton.trigger("click");
  //   expect(wrapper.emitted("current-page")![0]).toEqual([2]);

  //   const prevButton = wrapper.find(".pagination-button:nth-child(3)");
  //   await prevButton.trigger("click");
  //   expect(wrapper.emitted("current-page")![1]).toEqual([1]);
  // });

  it("emits 'items-per-page' event when changing items per page", async () => {
    const wrapper = mount(PaginationTable, { props: defaultProps });

    const select = wrapper.find("select");
    await select.setValue("15");
    expect(wrapper.emitted("items-per-page")![0]).toEqual([15]);
  });

  it("disables 'previous' and 'first' buttons on the first page", () => {
    const wrapper = mount(PaginationTable, { props: defaultProps });
    
    const firstButton = wrapper.find(".pagination-button:nth-child(2)").element as HTMLButtonElement;
    const prevButton = wrapper.find(".pagination-button:nth-child(3)").element as HTMLButtonElement;
    
    expect(firstButton.disabled).toBe(true);
    expect(prevButton.disabled).toBe(true);
  });

  // it("disables 'next' and 'last' buttons on the last page", () => {
  //   const wrapper = mount(PaginationTable, {
  //     props: { ...defaultProps, currentPage: 5 },
  //   });

  //   const nextButton = wrapper.find(".pagination-button:nth-last-child(1)").element as HTMLButtonElement;
  //   const lastButton = wrapper.find(".pagination-button:nth-last-child(2)").element as HTMLButtonElement;

  //   expect(nextButton.disabled).toBe(true);
  //   expect(lastButton.disabled).toBe(true);
  // });

  it("shows the correct page numbers within range", () => {
    const wrapper = mount(PaginationTable, {
      props: { ...defaultProps, currentPage: 3 },
    });

    const pageButtons = wrapper.findAll(".pagination-button");
    const displayedPages = pageButtons
      .filter((button) => !isNaN(Number(button.text())))
      .map((button) => Number(button.text()));

    expect(displayedPages).toEqual([1, 2, 3, 4, 5]);
  });
});
