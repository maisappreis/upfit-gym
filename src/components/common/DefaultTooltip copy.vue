<template>
    <div
        class="tooltip-area"
        :style="{ top: `${mouseY}px`, left: `${mouseX}px` }"
    >
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "DefaultTooltip",

    props: {
        mouseX: Number,
        mouseY: Number,
    },
};
</script>

<style scoped>
.tooltip-area {
    position: fixed;
    background-color: var(--gray-dark-color);
    color: white;
    padding: 0px 20px;
    z-index: 12;
    border-radius: 10px;
    line-height: 1.8;
    margin-right: 30px;
}
</style>