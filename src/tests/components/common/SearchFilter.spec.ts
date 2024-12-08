import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import SearchFilter from "@/components/common/SearchFilter.vue";

describe("SearchFilter.vue", () => {
  it("emits apply-search event with correct values on input", async () => {
    const wrapper = mount(SearchFilter);

    const input = wrapper.find("input");
    await input.setValue("Alice, Bob, Charlie");
    
    expect(wrapper.emitted()).toHaveProperty("apply-search");
    expect(wrapper.emitted("apply-search")?.[0]).toEqual([["Alice", "Bob", "Charlie"]]);
  });

  it("resets the filtered values and emits an empty array when input is cleared", async () => {
    const wrapper = mount(SearchFilter);

    const input = wrapper.find("input");
    await input.setValue("Alice, Bob");
    await input.setValue("");

    expect(wrapper.emitted()).toHaveProperty("apply-search");
    expect(wrapper.emitted("apply-search")?.[1]).toEqual([[]]);
  });

  it("displays the correct placeholder in the input field", () => {
    const wrapper = mount(SearchFilter);
    const input = wrapper.find("input");
    expect(input.attributes("placeholder")).toBe(
      "Pesquisar nomes separados por vírgula..."
    );
  });
  
  it("input starts empty", () => {
    const wrapper = mount(SearchFilter);
    const input = wrapper.find("input");
    expect(input.element.value).toBe("");
  });

  // it("cleans up extra spaces and commas from input values", async () => {
  //   const wrapper = mount(SearchFilter);
  //   const input = wrapper.find("input");
  //   await input.setValue("  Alice  ,  Bob , Charlie  , ");
  //   expect(wrapper.emitted("applySearch")?.[0]).toEqual([
  //     ["Alice", "Bob", "Charlie"],
  //   ]);
  // });
  
  // it("emits empty array when input value is deleted", async () => {
  //   const wrapper = mount(SearchFilter);
  //   const input = wrapper.find("input");
  //   await input.setValue("Alice");
  //   await input.setValue("");
  //   expect(wrapper.emitted("applySearch")?.[1]).toEqual([[]]);
  // });

  it("applies responsive styles correctly", () => {
    const wrapper = mount(SearchFilter);
    const input = wrapper.find("input");
    expect(input.classes()).toContain("search-area");
  });  

  // it("only emits event when input value changes", async () => {
  //   const wrapper = mount(SearchFilter);
  //   const input = wrapper.find("input");
  //   await input.setValue("Alice");
  //   await input.setValue("Alice"); // Não muda
  //   expect(wrapper.emitted("applySearch")?.length).toBe(1); // Emitido apenas uma vez
  // });  
});