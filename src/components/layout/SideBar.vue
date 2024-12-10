<template>
  <aside class="sidebar-area">
    <LogoType class="logo-area" />
    <ul>
      <li
        class="option pad"
        :class="{ selectedOption: pageStore.currentPage === 'metrics' }"
        @click="pageStore.openPage('metrics')"
      >
        <font-awesome-icon
          icon="fa-solid fa-chart-line"
          class="icon"
          :class="{ selectedIcon: pageStore.currentPage === 'metrics' }"
        />
        <span class="option-text">Métricas</span>
      </li>
      <li
        class="option pad"
        :class="{ selectedOption: pageStore.currentPage === 'customers' }"
        @click="pageStore.openPage('customers')"
      >
        <font-awesome-icon
          icon="fa-solid fa-users"
          class="icon"
          :class="{ selectedIcon: pageStore.currentPage === 'customers' }"
        />
        <span class="option-text">Clientes</span>
      </li>
      <li
        class="option pad"
        :class="{ selectedOption: pageStore.currentPage === 'revenue' }"
        @click="pageStore.openPage('revenue')"
      >
        <font-awesome-icon
          icon="fa-solid fa-hand-holding-dollar"
          class="icon"
          :class="{ selectedIcon: pageStore.currentPage === 'revenue' }"
        />
        <span class="option-text">Receitas</span>
      </li>
      <li
        class="option pad"
        :class="{ selectedOption: pageStore.currentPage === 'expenses' }"
        @click="pageStore.openPage('expenses')"
      >
        <font-awesome-icon
          icon="fa-solid fa-money-bill-transfer"
          class="icon"
          :class="{ selectedIcon: pageStore.currentPage === 'expenses' }"
        />
        <span class="option-text">Despesas</span>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import LogoType from "./LogoType.vue";
import { usePageStore } from "@/stores/page";

const pageStore = usePageStore();

</script>

<style scoped>
.sidebar-area {
  position: fixed;
  top: 0;
  left: 0;
  width: 20vw;
  min-width: 200px;
  max-width: 230px;
  z-index: 10;

  background-color: var(--black-color);
  height: 100vh;
  min-height: 100vh;
  overflow: auto;
}

.logo-area {
  margin: 20px;
  width: 80%;
  height: 130px;
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
  padding: 20px 30px;
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

.option-text {
  display: inline;
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

@media only screen and (max-width: 1300px) {
  .sidebar-area {
    width: 100px;
    min-width: 100px;
  }

  .logo-area {
    margin: 20px 10px;
    height: 70px;
  }

  .option-text {
    display: none;
  }

  .icon {
    font-size: 25px;
  }
}

@media only screen and (max-width: 1000px) {
  .sidebar-area {
    min-width: 20px;
    max-width: 70px;
  }

  .logo-area {
    margin: 15px 3px;
    height: 50px;
    width: 90%;
  }

  .option {
    padding: 10px 20px;
    margin: 15px 0;
  }

  .icon {
    font-size: 20px;
  }

  .selectedOption {
    width: 100%;
  }
}
</style>