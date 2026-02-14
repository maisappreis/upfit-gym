<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="container">
        <div class="spinner" />
        <p v-if="message" class="message">
          {{ message }}
        </p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onUnmounted, watch } from "vue";

const props = withDefaults(
  defineProps<{
    visible: boolean;
    message?: string;
    lockScroll?: boolean;
  }>(),
  {
    message: "Carregando...",
    lockScroll: true,
  }
);

const lockBodyScroll = () => {
  document.body.style.overflow = "hidden";
};

const unlockBodyScroll = () => {
  document.body.style.overflow = "";
};

watch(
  () => props.visible,
  (value) => {
    if (props.lockScroll) {
      value ? lockBodyScroll() : unlockBodyScroll();
    }
  }
);

onUnmounted(() => {
  unlockBodyScroll();
});
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-overlay, 9999);
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid transparent;
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.message {
  margin-top: 16px;
  font-weight: 600;
  color: white;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>