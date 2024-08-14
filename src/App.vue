<!-- <script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style> -->

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
    HeaderPage,
    SideBar,
    ContentPage,
    FooterPage
  },

  data: function () {
    return {
      selectedPage: 'metrics'
    }
  },

  methods: {
    openContent(page) {
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
