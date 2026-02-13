<template>
  <Teleport to="body">
    <div v-if="modelValue" class="overlay" @click.self="close">
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
      >
        <header v-if="$slots.header" class="modal-header">
          <slot name="header" />
        </header>

        <section class="modal__body">
          <slot />
        </section>

        <footer v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const close = () => {
  emit("update:modelValue", false);
};

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === "Escape") close();
};

onMounted(() => {
  window.addEventListener("keydown", handleEsc);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleEsc);
});
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-modal, 9998);
}

.modal {
  background: white;
  border-radius: 12px;
  min-width: 320px;
  max-width: 600px;
  width: 90%;
  padding: 24px;
  animation: fadeIn 0.2s ease;
}

.modal-header {
  margin-bottom: 16px;
  font-weight: 600;
  font-size: 18px;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 15px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>