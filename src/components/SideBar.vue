<template>
    <aside class="sidebar-area">
      <LogoType />
      <ul>
        <li class="option pad" :class="{ selectedOption: selectedPage === 'metrics' }" @click="openContent('metrics')">
            <font-awesome-icon icon="fa-solid fa-chart-line" class="icon"
              :class="{ selectedIcon: selectedPage === 'metrics' }" />
            Métricas
        </li>
        <li class="option pad" :class="{ selectedOption: selectedPage === 'customers' }" @click="openContent('customers')">
          <font-awesome-icon icon="fa-solid fa-users" class="icon" 
            :class="{ selectedIcon: selectedPage === 'customers' }"/>
          Clientes
        </li>
        <li class="option pad" :class="{ selectedOption: selectedPage === 'revenue' }" @click="openContent('revenue')">
          <font-awesome-icon icon="fa-solid fa-hand-holding-dollar" class="icon" 
            :class="{ selectedIcon: selectedPage === 'revenue' }"/>
          Receitas
        </li>
        <li class="option pad" :class="{ selectedOption: selectedPage === 'expenses' }" @click="openContent('expenses')">
          <font-awesome-icon icon="fa-solid fa-money-bill-transfer" class="icon" 
            :class="{ selectedIcon: selectedPage === 'expenses' }"/>
          Despesas
        </li>
      </ul>
  </aside>
</template>

<script>
import LogoType from './LogoType.vue'

export default {
  name: 'SideBar',
  components: { LogoType },

  data: function () {
    return {
      selectedPage: 'metrics'
    }
  },

  methods: {
    openContent (page) {
      this.selectedPage = page
      this.$emit('showContent', page)
    }
  }
}
</script>

<style scoped>

.sidebar-area {
  position: fixed;
  top: 0;
  left: 0;
  width: 230px;
  min-width: 230px;
  z-index: 10;

  background-color: var(--black-color);
  min-height: 100vh;
}

ul {
  list-style-type: none;
  padding: 0;
}

.icon {
  padding-right: 10px;
  font-size: 22px;
  color: white;
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
  background-color: var(--red-dark-color);
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px #000000;
}

.selectedOption {
  background-color: var(--gray-light-color);
  color: black;
  font-weight: bold;
  text-shadow: 2px 2px 4px #cfcfcf;
}

.selectedIcon {
  color: var(--black-color);
}

</style>