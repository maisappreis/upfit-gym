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
    padding: 10px 0;
    height: max-content;
    width: 40vw;
    z-index: 12;
    border-radius: 10px;
}
</style>