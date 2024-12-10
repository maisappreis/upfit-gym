import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useLoadingStore } from "@/stores/loading";

describe("Loading Store", () => {
  let loadingStore: ReturnType<typeof useLoadingStore>; 

  beforeEach(() => {
    setActivePinia(createPinia());
    loadingStore = useLoadingStore();
  });

  it("should initialize with isLoading as false", () => {
    expect(loadingStore.isLoading).toBe(false);
  });

  it("should change isLoading when loadPage is called", () => {
    loadingStore.loadPage(true);
    expect(loadingStore.isLoading).toBe(true);

    loadingStore.loadPage(false);
    expect(loadingStore.isLoading).toBe(false);
  });

  it("should update isLoading correctly", () => {
    loadingStore.loadPage(true);
    expect(loadingStore.isLoading).toBe(true);
    loadingStore.loadPage(false);
    expect(loadingStore.isLoading).toBe(false);
  });
});
