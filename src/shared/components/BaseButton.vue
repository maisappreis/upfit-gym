<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="computedClasses"
    v-bind="$attrs"
  >
    <span v-if="loading" class="spinner" />
    <span :class="{ 'content-hidden': loading }">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Variant = "primary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
  }>(),
  {
    variant: "primary",
    size: "md",
    loading: false,
    disabled: false,
    type: "button",
  }
);

const computedClasses = computed(() => [
  "btn",
  `btn--${props.variant}`,
  `btn--${props.size}`,
  {
    "is-loading": props.loading,
  },
]);
</script>

<style scoped>
/* Base */
.btn {
  border: none;
  border-radius: 8px;
  font-weight: var(--button-font-weight);
  font-family: "Montserrat", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

/* Sizes */
.btn--sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn--md {
  padding: 10px 18px;
  font-size: 14px;
}

.btn--lg {
  padding: var(--button-padding-lg);
  font-size: var(--button-font-size-lg);
}

/* Variants */
.btn--primary {
  background-color: var(--primary-color);
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background-color: rgb(0, 75, 0);
}

.btn--danger {
  background-color: #dc2626;
  color: white;
}

.btn--danger:hover:not(:disabled) {
  background-color: #b91c1c;
}

.btn--ghost {
  background-color: transparent;
  border: 1px solid #ccc;
  color: #333;
}

/* Disabled */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.content-hidden {
  visibility: hidden;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>