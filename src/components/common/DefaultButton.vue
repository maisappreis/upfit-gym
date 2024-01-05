<template>
    <button class="button-area">
        <font-awesome-icon icon="fa-solid fa-plus" />
        Novo Registro
    </button>
</template>

<script>
export default {
  name: 'DefaultButton'
}
</script>

<style scoped>
.button-area {
    margin: 20px 20px 0px 20px;
    background-color: var(--red-dark-color);
    border: none;
    padding: 10px 20px;
    color: white;
    width: 200px;

    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    font-size: 15px;
}
</style>