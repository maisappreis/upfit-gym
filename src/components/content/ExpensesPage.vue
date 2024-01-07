<template>
    <div class="content-area">
        <div style="display: flex; justify-content: space-between">
            <DefaultButton @executeAction="addExpense">
                <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
                Nova Despesa
            </DefaultButton>
            <DefaultSearch @applySearch="applySearch" />
        </div>
        <DefaulfTable
            :columns="columns"
            :data="expenses"
            :searchedField="searchedField"
            @updateItem="updateExpense"
            @deleteItem="deleteExpense"
        />
        <DefaultModal v-if="showModal">
            <ExpensesForm
                :item="item"
                :modalTitle="modalTitle"
                @closeModal="closeModal"
            />
            <div>{{ deleteMessage }}</div>
        </DefaultModal>
        <div v-if="showModal" class="defocus"></div>
    </div>
</template>

<script>
import DefaulfTable from "../common/DefaulfTable.vue";
import DefaultButton from "../common/DefaultButton.vue";
import DefaultSearch from "../common/DefaultSearch.vue";
import DefaultModal from "../common/DefaultModal.vue";
import ExpensesForm from "../forms/ExpensesForm.vue";
import { fetchData } from "../../services/api.js";

export default {
    name: "ExpensesPage",

    components: {
        DefaulfTable,
        DefaultButton,
        DefaultSearch,
        DefaultModal,
        ExpensesForm,
    },

    data() {
        return {
            columns: [
                { key: "year", name: "Ano" },
                { key: "month", name: "Mês" },
                { key: "name", name: "Nome" },
                { key: "due_date", name: "Data de vencimento" },
                { key: "paid", name: "Status" },
                { key: "checkbox", name: "Marcar como pago" },
                { key: "actions", name: "" },
            ],
            expenses: [],
            searchedField: [],
            showModal: false,
            item: {},
            deleteMessage: "",
            modalTitle: "",
        };
    },

    methods: {
        applySearch(field) {
            this.searchedField = field;
        },

        addExpense() {
            this.showModal = true;
            this.modalTitle = "Adicionar Despesa";
        },

        updateExpense(item) {
            this.showModal = true;
            this.item = item;
            this.modalTitle = "Atualizar Despesa";
        },

        deleteExpense(item) {
            console.log("item", item);
            this.showModal = true;
            this.deleteMessage = `Tem certeza que deseja excluir a conta `;
        },

        closeModal() {
            this.showModal = false;
            this.loadData();
        },

        async loadData() {
            try {
                const data = await fetchData();
                this.expenses = data.expenses;
            } catch (error) {
                console.error("Erro ao requisitar os dados...", error);
            }
        },
    },

    mounted() {
        this.loadData();
    },
};
</script>

<style scoped>
</style>