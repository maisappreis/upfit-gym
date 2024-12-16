<template>
  <div class="app-area">
    <HeaderPage />
    <SideBar />
    <ContentPage class="content" />
    <FooterPage />
  </div>
</template>

<script setup lang="ts">
import HeaderPage from "@/components/layout/HeaderPage.vue";
import SideBar from "@/components/layout/SideBar.vue";
import ContentPage from "@/components/layout/ContentPage.vue";
import FooterPage from "@/components/layout/FooterPage.vue";
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
