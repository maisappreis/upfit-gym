<template>
    <div>
        <h2>{{ modalTitle }}</h2>
        <!-- <form action="/submit_form" method="post" class="form-area"> -->
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
                <label class="form-label" for="frequency">Frequência:</label>
                <select
                    class="form-select"
                    id="frequency"
                    name="frequency"
                    v-model="frequency"
                    required
                >
                    <option value="1x">1x</option>
                    <option value="2x">2x</option>
                    <option value="3x">3x</option>
                    <option value="4x">4x</option>
                    <option value="5x">5x</option>
                </select>
            </div>
            <div class="form-item">
                <label class="form-label" for="start">Data de Início:</label>
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
                <label class="form-label" for="plan">Plano:</label>
                <select
                    class="form-select"
                    id="plan"
                    name="plan"
                    v-model="plan"
                    required
                >
                    <option value="Mensal">Mensal</option>
                    <option value="Trimestral">Trimestral</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
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
                <label class="form-label">Status:</label>
                <input
                    class="form-radio"
                    type="radio"
                    id="active"
                    name="status"
                    value="Ativo"
                    v-model="status"
                />
                <label class="form-label" for="active">Ativo</label>
                <input
                    class="form-radio"
                    type="radio"
                    id="inactive"
                    name="status"
                    value="Inativo"
                    v-model="status"
                />
                <label class="form-label" for="inactive">Inativo</label>
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

            <!-- Email Input -->
            <!-- <label for="email">Email:</label>
            <input type="email" id="email" name="email" required> -->

            <!-- Checkbox -->
            <!-- <input type="checkbox" id="subscribe" name="subscribe">
            <label for="subscribe">Subscribe to our newsletter</label> -->
            <!-- </form> -->
        </div>
    </div>
</template>

<script>
import DefaultButton from "../common/DefaultButton.vue";
import { postData, updateData } from "../../services/api.js";

export default {
    name: "CustomersForm",

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
            customerName: "",
            frequency: "",
            start: "",
            plan: "",
            value: 0,
            status: "",
            notes: "",
        };
    },

    methods: {
        saveCustomer() {
            if (this.action === "create") {
                this.createCustomer();
            } else {
                this.updateCustomer();
            }

            this.$emit("updateTable");
        },

        async createCustomer() {
            try {
                let formatedStartDate = this.$methods.formatDate(this.start)
                
                let newCustomer = {
                    name: this.customerName,
                    frequency: this.frequency,
                    start: formatedStartDate,
                    plan: this.plan,
                    value: this.value,
                    status: this.status,
                    notes: this.notes,
                    actions: ""
                };

                await postData("customers", newCustomer);
                this.$emit("showMessage", "Cliente criado com sucesso!");
            } catch (error) {
                console.error("Erro ao criar cliente.", error);
                this.$emit("showMessage", "Erro ao criar cliente.");
            }
        },

        async updateCustomer() {
            try {
                let updatedCustomer = {
                    name: this.customerName,
                    frequency: this.frequency,
                    start: this.start,
                    plan: this.plan,
                    value: this.value,
                    status: this.status,
                    notes: this.notes,
                };

                await updateData(this.item.id, "customers", updatedCustomer);
                this.$emit("showMessage", "Cliente atualizado com sucesso!");
            } catch (error) {
                console.error("Erro ao atualizar cliente.", error);
                this.$emit("showMessage", "Erro ao atualizar cliente.");
            }
        },

        fillModal() {
            this.customerName = this.item.name;
            this.frequency = this.item.frequency;
            this.start = this.item.start;
            this.plan = this.item.plan;
            this.value = this.item.value;
            this.status = this.item.status;
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