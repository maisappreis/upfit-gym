<template>
  <LoadingScreen v-if="isLoading">
    Carregando...
  </LoadingScreen>
  <div class="app-area">
    <component :is="layoutComponent" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import HomeView from "@/components/views/HomeView.vue";
import LoginView from "@/components/views/LoginView.vue";
import LoadingScreen from "@/components/common/LoadingScreen.vue";
import { useAuthStore } from "@/stores/auth";
import { useApiStore } from "@/stores/api";

const route = useRoute();
const authStore = useAuthStore();
const apiStore = useApiStore();
const isLoading = ref<boolean>(true);

const layoutComponent = computed(() => {
  return route.path === "/login" ? LoginView : HomeView
});

onMounted(async () => {
  authStore.checkAuthentication();
  apiStore.configureAxios();
  await apiStore.fetchData();
  isLoading.value = false;
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
