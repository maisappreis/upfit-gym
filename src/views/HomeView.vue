<template>
  <!-- <LoadingScreen v-if="loadingStore.isLoading">
    Carregando...
  </LoadingScreen> -->
  <div class="app-area">
    <HeaderPage />
    <SideBar />
    <ContentPage class="content" />
    <FooterPage />
  </div>
</template>

<script setup lang="ts">
import HeaderPage from "@/components/HeaderPage.vue";
import SideBar from "@/components/SideBar.vue";
import ContentPage from "@/components/ContentPage.vue";
import FooterPage from "@/components/FooterPage.vue";
// import LoadingScreen from "@/components/common/LoadingScreen.vue";
// import { useLoadingStore } from "@/stores/loading";
import { useAuthStore } from "@/stores/auth";
import { useApiStore } from "@/stores/api";
import { onMounted } from "vue";

const authStore = useAuthStore();
const apiStore = useApiStore();
// const loadingStore = useLoadingStore();

onMounted(async () => {
  authStore.checkAuthentication();
  apiStore.configureAxios();
  await apiStore.fetchData();
});
</script>

<style>
.content {
  position: absolute;
  top: 80px;
  left: 230px;

  width: 87vw;
  height: 80vh;
  background-color: var(--gray-light-color);
}

.content-area {
  display: flex;
  flex-direction: column;
  justify-content: left;

  margin: 30px;
  width: 90%;
  height: 68vh;
  padding: 20px;
  background-color: white;
  box-shadow: 2px 2px 20px rgb(148, 148, 148);
}

@media only screen and (max-width: 1300px) {
  .content {
    left: 100px;
    width: 92vw;
  }
}

@media only screen and (max-width: 1000px) {
  #app {
    overflow-y: auto;
  }

  .content {
    top: 25px;
    left: 58px;
    width: 92vw;
    height: fit-content;

    flex: 1;
  }

  .content-area {
    width: 80vw;
    height: fit-content;
  }
}
</style>
