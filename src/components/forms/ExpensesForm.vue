<template>
    <div>
        <h2>{{ modalTitle }}</h2>
        <div class="form-area">
            <div class="form-item">
                <label class="form-label" for="name">Nome:</label>
                <input
                    class="form-input"
                    type="text"
                    id="name"
                    name="name"
                    v-model="customerName"
                    required
                />
            </div>
            <div class="form-item">
                <label class="form-label" for="start"
                    >Data de Vencimento:</label
                >
                <input
                    class="form-input"
                    type="date"
                    id="start"
                    name="start"
                    v-model="start"
                    required
                />
            </div>
            <div class="form-item">
                <label class="form-label">Status:</label>
                <input
                    class="form-radio"
                    type="radio"
                    id="active"
                    name="status"
                    value="pago"
                    v-model="status"
                />
                <label class="form-label" for="active">Pago</label>
                <input
                    class="form-radio"
                    type="radio"
                    id="inactive"
                    name="status"
                    value="à pagar"
                    v-model="status"
                />
                <label class="form-label" for="inactive">À Pagar</label>
            </div>
            <div class="form-buttons-area">
                <DefaultButton
                    style="background-color: green"
                    @executeAction="saveCustomer"
                >
                    Salvar
                </DefaultButton>
                <DefaultButton
                    style="background-color: red"
                    @executeAction="$emit('closeModal')"
                >
                    Cancelar
                </DefaultButton>
            </div>
        </div>
    </div>
</template>

<script>
import DefaultButton from "../common/DefaultButton.vue";

export default {
    name: "ExpensesForm",

    components: {
        DefaultButton,
    },

    props: {
        modalTitle: String,
    },
};
</script>

<style scoped>
</style>