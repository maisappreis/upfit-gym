<template>
    <div class="hearder-area">
      <h3 v-if="selectedPage === 'metrics'">Métricas</h3>
      <h3 v-if="selectedPage === 'revenue'">Receitas</h3>
      <h3 v-if="selectedPage === 'expenses'">Despesas</h3>
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
  background-color: white;
  height: 80px;
  width: 100%;

  padding: 15px;
  text-align: center;
}
</style>