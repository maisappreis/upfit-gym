<template>
    <div>
        <h2>{{ modalTitle }}</h2>
        <div class="form-area">
            <div class="form-item">
                <label class="form-label" for="plan">Cliente:</label>
                <select
                    class="form-select"
                    id="plan"
                    name="plan"
                    v-model="customerName"
                    required
                >
                    <option value="mensal">Mensal</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="semestral">Semestral</option>
                    <option value="anual">Anual</option>
                </select>
            </div>
            <div class="form-item">
                <label class="form-label" for="value">Valor:</label>
                <input
                    class="form-input"
                    type="number"
                    id="value"
                    name="value"
                    v-model="value"
                    required
                />
            </div>
            <div class="form-item">
                <label class="form-label" for="notes">Notas:</label>
                <textarea
                    class="form-textarea"
                    id="notes"
                    name="notes"
                    rows="4"
                    v-model="notes"
                ></textarea>
            </div>
            <div class="form-buttons-area">
                <DefaultButton
                    style="background-color: green"
                    @executeAction="createRevenue"
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
    name: "RevenueForm",

    components: {
        DefaultButton,
    },

    props: {
        modalTitle: String,
    },

    data: function () {
        return {
            customerName: "",
            value: 0,
            notes: "",
        };
    },

    methods: {
        async createRevenue() {
            try {
                let newRevenue = {
                    id: 1, // Corrigir aqui, os dados estão mocados.
                    idCustomer: "1",
                    year: 2024,
                    month: "Janeiro",
                    notes: "Anotações",
                    paid: false,
                    actions: "",
                };

                await postData("revenue", newRevenue);
            } catch (error) {
                console.error("Erro ao criar uma receita.", error);
            }
        },
    },
};
</script>

<style scoped>
</style>