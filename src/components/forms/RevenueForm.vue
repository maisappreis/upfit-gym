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
                    <option
                        v-for="(customer, index) in customers"
                        :key="index"
                        :value="customer"
                    >
                        {{ customer.name }}
                    </option>
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
                <label class="form-label" for="month" style="min-width: 110px"
                    >Receber em:</label
                >
                <select
                    class="form-select font month"
                    style="margin-right: 10px"
                    id="month"
                    name="month"
                    v-model="month"
                    required
                >
                    <option
                        v-for="(month, index) in months"
                        :key="index"
                        :value="month"
                    >
                        {{ month }}
                    </option>
                </select>
                <select
                    class="form-select font"
                    style="max-width: 120px"
                    id="year"
                    name="year"
                    v-model="year"
                    required
                >
                    <option
                        v-for="(year, index) in years"
                        :key="index"
                        :value="year"
                    >
                        {{ year }}
                    </option>
                </select>
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
import { postData, updateData } from "../../services/api.js";
import { globalVariablesMixin } from "../../utils/variables.js";

export default {
    name: "RevenueForm",
    mixins: [globalVariablesMixin],

    components: {
        DefaultButton,
    },

    props: {
        item: Object,
        action: String,
        modalTitle: String,
        customers: Array,
    },

    data: function () {
        return {
            customer: "",
            value: 0,
            notes: "",
            year: 0,
            month: "",
        };
    },

    methods: {
        saveRevenue() {
            if (this.action === "create") {
                this.createRevenue();
            } else {
                this.updateRevenue();
            }

            this.$emit("updateTable");
        },

        async createRevenue() {
            try {
                let newRevenue = {
                    customerID: this.customer.id,
                    year: this.year,
                    month: this.month,
                    value: this.value,
                    notes: this.notes,
                    paid: false,
                    actions: "",
                };

                await postData("revenue", newRevenue);
                this.$emit("showMessage", "Receita criada com sucesso!");
            } catch (error) {
                console.error("Erro ao criar receita.", error);
                this.$emit("showMessage", "Erro ao criar receita.");
            }
        },

        async updateRevenue() {
            try {
                let newRevenue = {
                    customerID: "1",
                    year: this.year,
                    month: this.month,
                    value: this.value,
                    notes: this.notes,
                };
                await updateData(this.item.id, "revenue", newRevenue);
                this.$emit("showMessage", "Receita atualizada com sucesso!");
            } catch (error) {
                console.error("Erro ao atualizar receita.", error);
                this.$emit("showMessage", "Erro ao atualizar receita.");
            }
        },

        fillModal() {
            this.customer = this.item.name;
            this.value = this.item.value;
            this.notes = this.item.notes;
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