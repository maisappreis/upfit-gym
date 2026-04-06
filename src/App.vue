<template>
  <LoadingScreen :visible="loadingStore.isLoading" />
  <AlertMessage v-if="alertStore.visible" />
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppData } from "@/shared/composables/useAppData";
import { useAuthStore } from "@/features/auth/stores/auth";
import { useAlertStore } from "@/shared/stores/alert";
import { useLoadingStore } from "@/shared/stores/loading";

import AlertMessage from "@/shared/components/AlertMessage.vue";
import LoadingScreen from "@/shared/components/LoadingScreen.vue";

const router = useRouter();
const { fetchData } = useAppData();

const authStore = useAuthStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();

onMounted(async () => {
  loadingStore.start();
  authStore.checkAuthentication();

  if (authStore.isAuthenticated) {
    await fetchData();
  } else {
    router.push("/login");
  }
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
