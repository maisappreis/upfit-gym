<template>
    <div class="content-area">
        <div style="display: flex; justify-content: space-between">
            <DefaultButton @executeAction="addExpense">
                <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
                Nova Despesa
            </DefaultButton>
            <MonthFilter @get-month="getMonth" @get-year="getYear" />
            <DefaultSearch @applySearch="applySearch" />
        </div>
        <DefaulfTable
            :columns="columns"
            :data="filteredExpenses"
            :searchedField="searchedField"
            :page="currentPage"
            @updateItem="updateExpense"
            @deleteItem="showDeleteModal"
        />
        <DefaultModal v-if="showModal">
            <DeleteMessage
                v-if="action === 'delete'"
                :deleteMessage="deleteMessage"
                @deleteItem="deleteExpense"
                @closeModal="closeModal"
            />
            <ExpensesForm
                v-else
                :item="item"
                :action="action"
                :modalTitle="modalTitle"
                @closeModal="closeModal"
            />
        </DefaultModal>
        <div v-if="showModal" class="defocus"></div>
    </div>
</template>

<script>
import DefaulfTable from "../common/DefaulfTable.vue";
import DefaultButton from "../common/DefaultButton.vue";
import DefaultSearch from "../common/DefaultSearch.vue";
import DefaultModal from "../common/DefaultModal.vue";
import MonthFilter from "../common/MonthFilter.vue";
import ExpensesForm from "../forms/ExpensesForm.vue";
import DeleteMessage from "../common/DeleteMessage.vue";
import { fetchData } from "../../services/api.js";

export default {
    name: "ExpensesPage",

    components: {
        DefaulfTable,
        DefaultButton,
        DefaultSearch,
        DefaultModal,
        ExpensesForm,
        DeleteMessage,
        MonthFilter
    },

    data() {
        return {
            columns: [
                { key: "year", name: "Ano" },
                { key: "month", name: "Mês" },
                { key: "name", name: "Nome" },
                { key: "due_date", name: "Data de vencimento" },
                { key: "value", name: "Valor" },
                { key: "paid", name: "Status" },
                { key: "actions", name: "" },
            ],
            expenses: [],
            searchedField: [],
            showModal: false,
            item: {},
            action: "",
            deleteMessage: "",
            modalTitle: "",
            currentMonth: "",
            currentYear: 0,
            currentPage: ""
        };
    },

    computed: {
        filteredExpenses() {
            if (this.currentMonth === "all") {
                return this.expenses.filter((e) => e.year === this.currentYear);
            } else {
                return this.expenses.filter(
                    (e) =>
                        e.month === this.currentMonth &&
                        e.year === this.currentYear
                );
            }
        },
    },

    methods: {
        getMonth(month) {
            this.currentMonth = month;
        },

        getYear(year) {
            this.currentYear = Number(year);
        },

        applySearch(field) {
            this.searchedField = field;
        },

        addExpense() {
            this.showModal = true;
            this.action = "create";
            this.modalTitle = "Adicionar Despesa";
        },

        updateExpense(item) {
            this.showModal = true;
            this.item = item;
            this.modalTitle = "Atualizar Despesa";
        },

        deleteExpense() {
            console.log(
                `Fazer método DELETE em ${this.item.name}, id: ${this.item.id}`
            );
        },

        showDeleteModal(item) {
            this.item = item;
            this.showModal = true;
            this.action = "delete";

            this.deleteMessage = `Tem certeza que deseja excluir o pagamento da despesa
                                    de ${item.name} referente ao mês de ${item.month}/${item.year}?`;
        },

        closeModal() {
            this.showModal = false;
            this.loadData();
        },

        async loadData() {
            try {
                const data = await fetchData();
                this.expenses = data.expenses;
                this.currentPage = "expenses"
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