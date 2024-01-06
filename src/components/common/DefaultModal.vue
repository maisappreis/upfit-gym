<template>
    <div class="modal-area">
        <slot></slot>
    </div>
</template>

<script>

export default {
    name: "DefaultModal",
};
</script>

<style scoped>
.modal-area {
    position: absolute;
    top: 30px;
    left: 20vw;
    background-color: white;
    height: 75vh;
    width: 40vw;
    z-index: 12;
    border-radius: 10px;
}
</style>