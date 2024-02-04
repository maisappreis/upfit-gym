<template>
    <div class="modal-area">
        <slot></slot>
        <div v-if="!isForm" class="form-buttons-area">
            <DefaultButton
                style="background-color: green"
                @executeAction="$emit('executeAction')"
            >
                {{ buttonMessage }}
            </DefaultButton>
            <DefaultButton
                style="background-color: red"
                @executeAction="$emit('closeModal')"
            >
                Cancelar
            </DefaultButton>
        </div>
    </div>
</template>

<script>
import DefaultButton from "./DefaultButton.vue";

export default {
    name: "DefaultModal",

    components: {
        DefaultButton,
    },

    props: {
        buttonMessage: {
            type: String,
            required: false,
            default: 'Confirmar'
        },
        isForm: {
            type: Boolean,
            required: false,
            default: false
        },
    },
};
</script>

<style scoped>
.modal-area {
    position: absolute;
    top: 30px;
    left: 20vw;
    background-color: white;
    height: max-content;
    width: 40vw;
    z-index: 12;
    border-radius: 10px;
}
</style>