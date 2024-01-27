<template>
    <div>
        <h2>{{ modalTitle }}</h2>
        <form class="form-area" @submit.prevent="saveRevenue">
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
                <label class="form-label" for="dueDate" style="min-width: 160px"
                    >Dia do Vencimento:</label
                >
                <input
                    class="form-input"
                    type="number"
                    id="dueDate"
                    name="dueDate"
                    v-model="dueDate"
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
                    type="submit"
                >
                    Salvar
                </DefaultButton>
                <DefaultButton
                    style="background-color: red"
                    type="button"
                    @executeAction="$emit('closeModal')"
                >
                    Cancelar
                </DefaultButton>
            </div>
        </form>
    </div>
</template>

<script>
import DefaultButton from "../common/DefaultButton.vue";
import { globalVariablesMixin } from "../../utils/variables.js";
import axios from "axios";

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
            dueDate: 0,
        };
    },

    methods: {
        saveRevenue() {
            if (this.action === "create") {
                this.createRevenue();
            } else {
                this.updateRevenue();
            }
        },

        async createRevenue() {
            try {
                let newRevenue = {
                    customer: this.customer.id,
                    year: this.year,
                    month: this.month,
                    value: this.value,
                    payment_day: this.dueDate,
                    notes: this.notes,
                    paid: "À pagar",
                    actions: "",
                };

                await axios.post(`${this.apiURL}/revenue/create/`, newRevenue);
                this.$emit("showMessage", "Receita criada com sucesso!");

                this.$emit('closeModal');
                this.$emit("updateTable");
            } catch (error) {
                console.error("Erro ao criar receita.", error);
                this.$emit("showMessage", "Erro ao criar receita.");
            }
        },

        async updateRevenue() {
            console.log('item', this.item)
            try {
                let updatedRevenue = {
                    customer: this.item.customer,
                    year: this.year,
                    month: this.month,
                    value: this.value,
                    payment_day: this.dueDate,
                    notes: this.notes,
                };
                await axios.put(`${this.apiURL}/revenue/${this.item.id}/`, updatedRevenue);
                this.$emit("showMessage", "Receita atualizada com sucesso!");

                this.$emit('closeModal');
                this.$emit("updateTable");
            } catch (error) {
                console.error("Erro ao atualizar receita.", error);
                this.$emit("showMessage", "Erro ao atualizar receita.");
            }
        },

        fillModal() {
            if (this.action === "create") {
                let currentDate = new Date();
                let currentMonth = currentDate.getMonth();
                let year = currentDate.getFullYear();
                let month = this.months[currentMonth]

                this.year = year
                this.month = month
            }

            if (this.action === "update") {
                let customerID = Number(this.item.customer);

                this.customer = this.customers.find((e) => e.id === customerID);
                this.value = this.item.value;
                this.notes = this.item.notes;
                this.dueDate = this.item.payment_day;
                this.year = this.item.year;
                this.month = this.item.month;
            }
        },
    },

    mounted() {
        this.fillModal();
    },
};
</script>

<style scoped>
</style>