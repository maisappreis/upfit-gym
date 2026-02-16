import { ref, type ComponentPublicInstance } from "vue";

export function useTooltipAnchors() {
  const hoveredId = ref<number | null>(null);
  const refsMap = ref<Record<number, HTMLElement | null>>({});

  const setRef = (
    id: number,
    el: Element | ComponentPublicInstance | null
  ) => {
    if (el && "$el" in el) {
      refsMap.value[id] = el.$el as HTMLElement;
    } else {
      refsMap.value[id] = el as HTMLElement | null;
    }
  };

  return {
    hoveredId,
    refsMap,
    setRef,
  };
}