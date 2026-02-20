<template>
  <section
    :class="['alert-area', alertStore.type]"
    role="alert"
    aria-live="assertive"
  >
    <div :class="['marker', alertStore.type === 'success' ? 'green' : 'red']"></div>

    <div class="message">
      <font-awesome-icon
        :icon="icon"
        class="icon"
      />
      {{ alertStore.message }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAlertStore } from "@/stores/alert";

const alertStore = useAlertStore();

const icon = computed(() => {
  switch (alertStore.type) {
    case "success":
      return "fa-solid fa-check";
    case "error":
      return "fa-solid fa-xmark";
    case "info":
      return "fa-solid fa-circle-info";
    case "warning":
      return "fa-solid fa-triangle-exclamation";
  }
});

onMounted(() => {
  setTimeout(() => {
    alertStore.clear();
  }, 2000);
});

</script>

<style scoped>
.alert-area {
  position: absolute;
  top: 20px;
  right: 20px;

  height: 90px;
  width: 500px;
  z-index: 99;
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
  background-color: var(--red-lighter);
}

.marker {
  width: 4%;
  height: 100%;
  border-radius: 8px 0 0 8px;
}

.red {
  background-color: var(--error-color);
}

.green {
  background-color: var(--success-color);
}

.message {
  display: flex;
  width: 97%;
  font-size: 18px;
  padding: 0 20px;
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
    width: 90%;
    font-size: 14px;
  }

  .icon {
    font-size: 15px;
  }
}
</style>