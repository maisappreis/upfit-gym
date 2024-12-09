<template>
  <div class="app-area">
    <component :is="layoutComponent" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import HomeView from "@/components/views/HomeView.vue";
import LoginView from "@/components/views/LoginView.vue";

const route = useRoute();

const layoutComponent = computed(() => {
  return route.path === "/login" ? LoginView : HomeView
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
