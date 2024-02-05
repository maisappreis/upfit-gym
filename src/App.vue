<template>
  <div class="app-area">
    <HeaderPage class="header" :selectedPage="selectedPage" />
    <SideBar class="sidebar" @showContent="openContent" />
    <ContentPage class="content" :selectedPage="selectedPage" />
    <FooterPage class="footer" />
  </div>
</template>

<script>
import HeaderPage from './components/HeaderPage.vue'
import SideBar from './components/SideBar.vue'
import ContentPage from './components/ContentPage.vue'
import FooterPage from './components/FooterPage.vue'

export default {
  name: 'App',
  components: {
    HeaderPage, SideBar, ContentPage, FooterPage
  },

  data: function () {
    return {
      selectedPage: 'metrics'
    }
  },

  methods: {
    openContent (page) {
      this.selectedPage = page
    }
  }
}
</script>

<style>
* {
  font-family: 'Montserrat', sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: var(--gray-light-color);
}

.app-area {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-area {
  display: flex;
  flex-direction: column;
  justify-content: left;

  margin: 30px;
  width: 92%;
  height: 90%;  
  background-color: white;
  box-shadow: 2px 2px 20px rgb(148, 148, 148);
}

</style>
