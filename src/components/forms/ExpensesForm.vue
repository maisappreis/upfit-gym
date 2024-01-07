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
                    v-model="bill"
                    required
                />
            </div>
            <div class="form-item">
                <label class="form-label" for="due-date"
                    >Data de Vencimento:</label
                >
                <input
                    class="form-input"
                    type="date"
                    id="due-date"
                    name="due-date"
                    v-model="dueDate"
                    required
                />
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
import { postData } from "../../services/api.js";

export default {
    name: "ExpensesForm",

    components: {
        DefaultButton,
    },

    props: {
        modalTitle: String,
    },

    data() {
        return {
            bill: "",
            dueDate: "",
        };
    },

    methods: {
        async saveCustomer() {
            try {
                let newExpense = {
                    year: 2024, // Mês e ano deve ser pego da própria data de vendimento.
                    month: "Janeiro",
                    name: this.customerName,
                    due_date: this.frequency,
                    paid: false,
                };
                console.log("newExpense", newExpense);
                await postData("expenses", newExpense);
            } catch (error) {
                console.error("Erro ao salvar os dados.", error);
            }
        },
    },
};
</script>

<style scoped>
</style>