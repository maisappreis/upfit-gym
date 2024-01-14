<template>
    <div class="content-area">
        <div style="display: flex; justify-content: space-between">
            <DefaultButton @executeAction="addExpense">
                <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
                Nova Despesa
            </DefaultButton>
            <MonthFilter
                @get-month="getMonth"
                @get-year="getYear"
                @get-status="getStatus"
                :statusList="statusList"
            />
            <DefaultSearch @applySearch="applySearch" />
        </div>
        <DefaultTable
            :columns="columns"
            :data="filteredExpenses"
            :searchedField="searchedField"
            :requestMessage="requestMessage"
            :page="selectedPage"
            @updateData="$emit('updateData')"
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
                @updateTable="$emit('updateData')"
                @closeModal="closeModal"
                @showMessage="showMessage"
            />
        </DefaultModal>
        <div v-if="showModal" class="defocus"></div>
    </div>
</template>

<script>
import DefaultTable from "../common/DefaultTable.vue";
import DefaultButton from "../common/DefaultButton.vue";
import DefaultSearch from "../common/DefaultSearch.vue";
import DefaultModal from "../common/DefaultModal.vue";
import MonthFilter from "../common/MonthFilter.vue";
import ExpensesForm from "../forms/ExpensesForm.vue";
import DeleteMessage from "../common/DeleteMessage.vue";
import { deleteData } from "../../services/api.js";

export default {
    name: "ExpensesPage",

    components: {
        DefaultTable,
        DefaultButton,
        DefaultSearch,
        DefaultModal,
        ExpensesForm,
        DeleteMessage,
        MonthFilter,
    },

    props: {
        expenses: Array,
        selectedPage: String,
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
            statusList: ["Pago", "À pagar", "Todos"],
            searchedField: [],
            showModal: false,
            item: {},
            action: "",
            deleteMessage: "",
            modalTitle: "",
            requestMessage: "",
            currentMonth: "",
            currentYear: 0,
            currentStatus: "",
        };
    },

    computed: {
        filteredExpenses() {
            if (
                this.currentMonth === "Todos os meses" &&
                this.currentStatus === "Todos"
            ) {
                return this.expenses.filter((e) => e.year === this.currentYear);
            } else if (
                this.currentMonth !== "Todos os meses" &&
                this.currentStatus === "Todos"
            ) {
                return this.expenses.filter(
                    (e) =>
                        e.month === this.currentMonth &&
                        e.year === this.currentYear
                );
            } else {
                return this.expenses.filter(
                    (e) =>
                        e.month === this.currentMonth &&
                        e.year === this.currentYear &&
                        e.paid === this.currentStatus
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

        getStatus(status) {
            this.currentStatus = status;
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
            this.action = "update";
            this.modalTitle = "Atualizar Despesa";
        },

        async deleteExpense() {
            try {
                await deleteData(this.item.id, "expenses");

                this.showMessage("Despesa excluída com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir despesa.", error);

                this.showMessage("Erro ao excluir despesa.");
            }

            this.showModal = false;
            this.$emit("updateData");
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
        },

        showMessage(msg) {
            this.requestMessage = msg;
        },
    },
};
</script>

<style scoped>
</style>