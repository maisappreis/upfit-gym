<template>
  <section
    :class="['alert-area', showSuccessAlert ? 'success' : 'error']"
    aria-live="assertive"
    role="alert"
  >
    <div :class="['marker', showSuccessAlert ? 'green' : 'red']"></div>
    <div class="message">
      <slot name="icon">
        <font-awesome-icon
          :icon="showSuccessAlert ? 'fa-solid fa-check' : 'fa-solid fa-xmark'"
          class="icon"
        />
      </slot>
      <slot>
        {{ props.responseMessage }}
      </slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";

const props = defineProps({
  responseMessage: String
});

const emit = defineEmits(["close-message"]);

const showSuccessAlert = computed(() => {
  if (!props.responseMessage) return false;
  return !props.responseMessage.trim().toLowerCase().includes("erro");
});

const closeMessage = () => {
  emit("close-message");
};

onMounted(() => {
  setTimeout(closeMessage, 1000);
});
</script>

<style scoped>
.alert-area {
  position: absolute;
  top: 15px;
  right: 65px;
  height: 90px;
  z-index: 99;
  width: 500px;
  border-radius: 8px;

  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.success {
  background-color: rgb(154, 220, 154);
}

.error {
  background-color: rgb(243, 186, 186);
}

.marker {
  width: 3%;
  height: 100%;
  border-radius: 8px 0 0 8px;
}

.red {
  background-color: red;
}

.green {
  background-color: rgb(19, 163, 0);
}

.message {
  width: 97%;
  font-size: 18px;
}

.icon {
  margin-right: 15px;
  font-size: 20px;
}

@media only screen and (max-width: 1000px) {
  .alert-area {
    top: 25px;
    right: 25px;
    height: 50px;
    width: 300px;
  }

  .message {
    width: 95%;
    font-size: 14px;
  }

  .icon {
    font-size: 15px;
  }
}
</style>