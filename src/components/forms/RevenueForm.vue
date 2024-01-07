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
                    v-model="customer"
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
                    @executeAction="saveRevenue"
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
        item: Object,
        action: String,
        modalTitle: String,
    },

    data: function () {
        return {
            customer: "",
            value: 0,
            notes: "",
        };
    },

    methods: {
        async saveRevenue() {
            if (this.action === "create") {
                this.createRevenue();
            } else {
                this.updateRevenue();
            }
        },

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

        async updateRevenue() {
            console.log("Faz PATCH");
        },

        fillModal() {
            this.customer = this.item.name;
        },
    },

    mounted() {
        if (this.action === "update") {
            this.fillModal();
        }
    },
};
</script>

<style scoped>
</style>