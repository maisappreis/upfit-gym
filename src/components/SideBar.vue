<template>
    <aside class="sidebar-area">
      <LogoType />
      <ul>
        <li class="option pad" @click="openContent('metrics')">Métricas</li>
        <li class="option pad" @click="openContent('revenue')">Receitas</li>
        <li class="option pad" @click="openContent('expenses')">Despesas</li>
      </ul>
  </aside>
</template>

<script>
import LogoType from './LogoType.vue'

export default {
  name: 'SideBar',
  components: { LogoType },

  methods: {
    openContent (page) {
      this.$emit('showContent', page)
    }
  }
}
</script>

<style scoped>

.sidebar-area {
  position: fixed;
  left: 0;
  width: 230px;
  min-width: 230px;
  z-index: 9;

  background-color: rgb(0, 98, 152);
  min-height: 100vh;
}

ul {
  list-style-type: none;
  padding: 10px;
}

.option {
  cursor: pointer;
  font-size: 1.1rem;
  color: white;
  padding: 3vh 1vw 3vh 1.5vw;
  text-shadow: 2px 2px 4px #000000;

  text-align: left;
  margin: 25px 0;
}

.option:hover {
  background-color: rgb(0, 71, 109);
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px #000000;
}

.active {
  background-color: rgb(0, 71, 109);
}

.selectedOption {
  background-color: rgba(248, 248, 248, 255);
  color: black;
  font-weight: bold;
  text-shadow: 2px 2px 4px #cfcfcf;
}

i {
  margin-right: 10px;
  font-size: 1.2rem;
}

</style>