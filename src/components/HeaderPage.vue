<template>
    <div class="hearder-area">
      <div class="text-box" v-if="selectedPage === 'metrics'">
        <h2 class="title">Métricas</h2>
        <p class="subtitle">Estatísticas das entradas e saídas do caixa</p>
      </div>
      <div class="text-box" v-if="selectedPage === 'customers'">
        <h2 class="title">Clientes</h2>
        <p class="subtitle">Cadastramento dos clientes</p>
      </div>
      <div class="text-box" v-if="selectedPage === 'revenue'">
        <h2 class="title">Receitas</h2>
        <p class="subtitle">Descrição</p>
      </div>
      <div class="text-box" v-if="selectedPage === 'expenses'">
        <h2 class="title">Despesas</h2>
        <p class="subtitle">Descrição</p>
      </div>
    </div>
</template>

<script>
export default {
  name: 'HeaderPage',
  props: {
    selectedPage: String
  }
}
</script>

<style scoped>

.hearder-area {
  position: fixed;
  top: 0;
  background-color: rgb(235, 235, 235);
  box-shadow: 0 8px 6px -6px rgb(99, 99, 99);
  height: 90px;
  width: 100%;
  z-index: 9;
}

.text-box {
  text-align: left;
  margin-left: 240px;
}

.title {
  margin: 15px 0 6px 0;
}

.subtitle {
  margin: 10px 0 5px 0;
}
</style>