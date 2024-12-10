import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { usePageStore } from "@/stores/page";

describe("Page Store", () => {
  let pageStore: ReturnType<typeof usePageStore>; 

  beforeEach(() => {
    setActivePinia(createPinia());
    pageStore = usePageStore();
  });

  it("should initialize with default currentPage as 'metrics'", () => {
    expect(pageStore.currentPage).toBe("metrics");
  });

  it("should change currentPage when openPage is called", () => {
    pageStore.openPage("customers");
    expect(pageStore.currentPage).toBe("customers");

    pageStore.openPage("revenue");
    expect(pageStore.currentPage).toBe("revenue");

    pageStore.openPage("expenses");
    expect(pageStore.currentPage).toBe("expenses");
  });

  it("should update currentPage correctly", () => {
    pageStore.openPage("metrics");
    expect(pageStore.currentPage).toBe("metrics");
  });
});
