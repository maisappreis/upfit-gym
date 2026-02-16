<template>
  <LoadingScreen :visible="loadingStore.isLoading" />
  <AlertMessage v-if="alertStore.visible" />
  <div class="app-area">
    <component :is="layoutComponent" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useApiStore } from "@/stores/api";
import { useAuthStore } from "@/stores/auth";
import { useAlertStore } from "@/stores/alert";
import { useLoadingStore } from "@/stores/loading";
import { useRoute } from "vue-router";

import HomeView from "@/components/views/HomeView.vue";
import LoginView from "@/components/views/LoginView.vue";
import AlertMessage from "@/components/base//AlertMessage.vue";
import LoadingScreen from "@/components/base/LoadingScreen.vue";

const route = useRoute();
const apiStore = useApiStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();

const layoutComponent = computed(() => {
  return route.path === "/login" ? LoginView : HomeView
});

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
  background-color: var(--gray-light-color);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100vw;
  height: 90vh;
}

.app-area {
  display: flex;
  flex-direction: column;
}

.loading {
  padding: 30px 15px;
}
</style>
