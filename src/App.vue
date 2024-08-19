<template>
  <div v-if="isLoaded" class="app-area">
    <component :is="layoutComponent" />
  </div>
  <h2 class="loading" v-else>
    <font-awesome-icon icon="fa-solid fa-spinner" style="margin-right: 20px" />
    Carregando...
  </h2>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApiStore } from '@/stores/api'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'

const isLoaded = ref(false)
const route = useRoute()
const apiStore = useApiStore()

const layoutComponent = computed(() => {
  return route.path === '/login' ? LoginView : HomeView
})

onMounted(async () => {
  // await apiStore.getCSRFToken()
  apiStore.checkAuthentication()
  await apiStore.fetchData()

  isLoaded.value = true
})
</script>

<style>
* {
  font-family: 'Montserrat', sans-serif;
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
