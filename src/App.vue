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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
}

/* .app-area {
  display: grid;
  grid-template-areas:
    'sidebar header header header header header '
    'sidebar content content content content content'
    'sidebar content content content content content'
    'sidebar content content content content content'
    'sidebar content content content content content'
    'sidebar content content content content content'
    'sidebar content content content content content'
    'sidebar footer footer footer footer footer';
  height: 100vh;
  margin: 0;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }

.grid-container > div {
  font-size: 30px;
} */

.app-area {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 20px;
}

</style>
