<template>
  <Teleport to="body">
    <div
      v-if="visible && anchor"
      class="tooltip"
      :style="positionStyle"
      role="tooltip"
    >
      <slot />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from "vue";

interface Props {
  anchor: HTMLElement | HTMLElement[] | null;
  visible: boolean;
  offset?: number;
}

const props = withDefaults(defineProps<Props>(), {
  offset: 8,
});

const resolvedAnchor = computed<HTMLElement | null>(() => {
  if (!props.anchor) return null;

  if (Array.isArray(props.anchor)) {
    return props.anchor[0] ?? null;
  }

  return props.anchor;
});

const positionStyle = computed<CSSProperties>(() => {
  const el = resolvedAnchor.value;

  if (!el || !(el instanceof HTMLElement)) return {};

  const rect = el.getBoundingClientRect();

  return {
    position: "fixed",
    top: `${rect.bottom + props.offset}px`,
    left: `${rect.left}px`,
  };
});

</script>

<style scoped>
.tooltip {
  background: var(--gray-dark-color);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  line-height: 1.4;
  margin: 10px;
  pointer-events: none;
  z-index: var(--z-tooltip, 1000);
}
</style>