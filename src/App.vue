<template>
  <LoadingScreen :visible="loadingStore.isLoading" />
  <AlertMessage v-if="alertStore.visible" />
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useApiStore } from "@/stores/api";
import { useAuthStore } from "@/stores/auth";
import { useAlertStore } from "@/stores/alert";
import { useLoadingStore } from "@/stores/loading";

import AlertMessage from "@/components/base//AlertMessage.vue";
import LoadingScreen from "@/components/base/LoadingScreen.vue";

const apiStore = useApiStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();

onMounted(async () => {
  loadingStore.start();
  authStore.checkAuthentication();
  await apiStore.fetchData();
  loadingStore.stop();
});
</script>

<style>
* {
  font-family: "Montserrat", sans-serif;
}

body {
  margin: 0;
  background-color: var(--gray-medium);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
