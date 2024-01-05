<template>
    <div class="modal-area">
        <h2>Adicionar Novo Cliente</h2>
        <!-- <form action="/submit_form" method="post" class="form-area"> -->
        <div class="form-area">
            <div class="form-item">
                <label for="name">Nome:</label>
                <input type="text" id="name" name="name" v-model="customerName" required>
            </div>
            <div class="form-item">
                <label for="frequency">Frequência:</label>
                <select id="frequency" name="frequency" v-model="frequency">
                    <option value="1x">1x</option>
                    <option value="2x">2x</option>
                    <option value="3x">3x</option>
                    <option value="4x">4x</option>
                    <option value="5x">5x</option>
                </select>
            </div>
            <div class="form-item">
                <label for="start">Data de Início:</label>
                <input type="date" id="start" name="start" v-model="start" required>
            </div>
            <div class="form-item">
                <label for="plan">Plano:</label>
                <select id="plan" name="plan" v-model="plan">
                    <option value="mensal">Mensal</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="semestral">Semestral</option>
                    <option value="anual">Anual</option>
                </select>
            </div>
            <div class="form-item">
                <label for="value">Valor:</label>
                <input type="number" id="value" name="value" v-model="value" required>
            </div>
            <div class="form-item">
                <label>Status:</label>
                <input class="radio" type="radio" id="active" name="status" value="active" v-model="status">
                <label for="active">Ativo</label>
                <input class="radio" type="radio" id="inactive" name="status" value="inactive" v-model="status">
                <label for="inactive">Inativo</label>
            </div>
            <div class="form-item">
                <label for="notes">Notas:</label>
                <textarea id="notes" name="notes" rows="4" v-model="notes"></textarea>
            </div>
            <div class="buttons-area">
                <DefaultButton style="background-color: green;" @executeAction="saveCustomer">
                    Salvar
                </DefaultButton>
                <DefaultButton style="background-color: red;" @executeAction="$emit('closeModal')">
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
import DefaultButton from "./common/DefaultButton.vue";
import { postData } from "../services/api.js";

export default {
    name: "CustomerModal",
    components: {
        DefaultButton
    },

    data: function () {
        return {
            customerName: "",
            frequency: "",
            start: "",
            plan: "",
            value: 0,
            status: "",
            notes: ""
        }
    },

    methods: {
        async saveCustomer() {
            try {
                let newCustomer = {
                    name: this.customerName,
                    frequency: this.frequency,
                    start: this.start,
                    plan: this.plan,
                    value: this.value,
                    status: this.status,
                    notes: this.notes,
                    actions: ""
                }

                await postData(newCustomer);
            } catch (error) {
                console.error('Erro ao salvar os dados.', error);
            }
        }
    }
};
</script>

<style scoped>
.modal-area {
    position: absolute;
    top: 30px;
    left: 20vw;
    background-color: white;
    height: 75vh;
    width: 40vw;
    z-index: 12;
    border-radius: 10px;
}

.form-area {
    display: flex;
    flex-direction: column;
    justify-content: left;
    margin: 20px 40px;
}

.form-item {
    display: flex;
    margin: 10px 0;
}

.radio-item {
    display: flex;
}

.radio {
    margin: 10px;
    width: 20px;
}

label {
    text-align: left;
    margin: 5px 15px 0 0;
}

input, textarea, select {
    width: 100%;
    padding: 5px;
    border-radius: 5px;
    border: 2px solid #b4b4b4;
}

.buttons-area {
    display: flex;
    justify-content: center;
}
</style>