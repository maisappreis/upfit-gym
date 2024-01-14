<template>
    <div class="hearder-area">
      <div class="text-box" v-if="selectedPage === 'metrics'">
        <div class="header-title">
          <font-awesome-icon icon="fa-solid fa-chart-line" class="icon" />
          <h2 class="title">Métricas</h2>
        </div>        
        <p class="subtitle">Visualização gráfica de receita, despesas, lucro e clientes</p>
      </div>
      <div class="text-box" v-if="selectedPage === 'customers'">
        <div class="header-title">
          <font-awesome-icon icon="fa-solid fa-users" class="icon" />
          <h2 class="title">Clientes</h2>
        </div>
        <p class="subtitle">Cadastramento dos clientes</p>
      </div>
      <div class="text-box" v-if="selectedPage === 'revenue'">
        <div class="header-title">
          <font-awesome-icon icon="fa-solid fa-hand-holding-dollar" class="icon" />
          <h2 class="title">Receitas</h2>
        </div>
        <p class="subtitle">Controle do recebimento das mensalidades dos clientes</p>
      </div>
      <div class="text-box" v-if="selectedPage === 'expenses'">
        <div class="header-title">
          <font-awesome-icon icon="fa-solid fa-money-bill-transfer" class="icon" />
          <h2 class="title">Despesas</h2>
        </div>
        <p class="subtitle">Controle do pagamento das contas</p>
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

.header-title {
  display: flex;
}

.title {
  margin: 15px 0 6px 0;
}

.icon {
  margin: 15px;
  font-size: 25px;
}

.subtitle {
  margin: 2px 0 5px 15px;
}
</style>