<template>
  <div class="modal-area" :class="{ 'top-up': isForm, 'top-down': !isForm }">
    <slot></slot>
    <div v-if="!isForm" class="form-buttons-area">
      <BaseButton size="lg" @click="$emit('execute-action')">
        {{ buttonMessage }}
      </BaseButton>
      <BaseButton size="lg" variant="danger" @click="$emit('close-modal')">
        Cancelar
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/components/common/BaseButton.vue";

defineProps({
  buttonMessage: {
    type: String,
    required: false,
    default: "Confirmar"
  },
  isForm: {
    type: Boolean,
    required: false,
    default: false
  }
});
</script>

<style scoped>
.modal-area {
  position: absolute;
  left: 20vw;
  background-color: white;
  height: fit-content;
  width: 40vw;
  z-index: 12;
  border-radius: 10px;
  padding: 30px;
}

.top-up {
  top: 30px;
}

.top-down {
  top: 25vh;
}

@media only screen and (max-width: 1000px) {
  .modal-area {
    left: 17vw;
    width: 50vw;
    overflow: auto;
    max-height: 240px;
    padding: 20px 30px;
  }
}
</style>