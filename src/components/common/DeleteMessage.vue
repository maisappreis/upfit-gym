<template>
    <div>
        <h3 class="delete-message">
            {{ deleteMessage }}
        </h3>
        <div class="form-buttons-area">
            <DefaultButton
                style="background-color: green"
                @executeAction="$emit('deleteItem')"
            >
                Confirmar
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
import DefaultButton from "../common/DefaultButton.vue";

export default {
    name: "DeleteMessage",

    components: {
        DefaultButton,
    },

    props: {
        deleteMessage: String,
    },
};
</script>

<style scoped>
.delete-message {
    padding: 20px 40px 0 20px;
}
</style>