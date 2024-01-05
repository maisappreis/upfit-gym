<template>
    <button class="button-area" @click="$emit('executeAction')">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: "DefaultButton",
};
</script>

<style scoped>
.button-area {
    margin: 20px 20px 0px 20px;
    background-color: var(--red-dark-color);
    border: none;
    padding: 12px 20px;
    color: white;
    width: 180px;

    font-family: "Montserrat", sans-serif;
    font-weight: bold;
    font-size: 15px;
    border-radius: 8px;
    cursor: pointer;
}
</style>