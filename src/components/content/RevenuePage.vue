<template>
    <div class="content-area">
        <div style="display: flex; justify-content: space-between">
            <DefaultButton @executeAction="addRevenue">
                <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
                Nova Receita
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
            :data="filteredRevenue"
            :searchedField="searchedField"
            :requestMessage="requestMessage"
            :page="selectedPage"
            @updateData="$emit('updateData')"
            @updateItem="updateRevenue"
            @deleteItem="showDeleteModal"
        />
        <DefaultModal v-if="showModal">
            <DeleteMessage
                v-if="action === 'delete'"
                :deleteMessage="deleteMessage"
                @deleteItem="deleteRevenue"
                @closeModal="closeModal"
            />
            <RevenueForm
                v-else
                :item="item"
                :customers="customers"
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
import RevenueForm from "../forms/RevenueForm.vue";
import DeleteMessage from "../common/DeleteMessage.vue";
import { deleteData } from "../../services/api.js";

export default {
    name: "RevenuePage",
    components: {
        DefaultTable,
        DefaultButton,
        DefaultSearch,
        DefaultModal,
        RevenueForm,
        DeleteMessage,
        MonthFilter,
    },

    props: {
        revenue: Array,
        customers: Array,
        selectedPage: String,
    },

    data() {
        return {
            columns: [
                { key: "year", name: "Ano" },
                { key: "month", name: "Mês" },
                { key: "name", name: "Nome" },
                { key: "start", name: "Data de início" },
                { key: "plan", name: "Plano" },
                { key: "payment_day", name: "Vencimento" },
                { key: "value", name: "Valor" },
                { key: "paid", name: "Status" },
                { key: "actions", name: "" },
            ],
            statusList: ["Pago", "À pagar", "Link enviado", "Todos"],
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
        filteredRevenue() {
            return this.$computed.filteredData(
                this.revenue,
                this.currentMonth,
                this.currentYear,
                this.currentStatus
            );
        },
    },

    methods: {
        getMonth(month) {
            this.currentMonth = month;
        },

        getYear(year) {
            this.currentYear = year;
        },

        getStatus(status) {
            this.currentStatus = status;
        },

        applySearch(field) {
            this.searchedField = field;
        },

        addRevenue() {
            this.showModal = true;
            this.action = "create";
            this.modalTitle = "Adicionar Receita";
        },

        updateRevenue(item) {
            this.showModal = true;
            this.item = item;
            this.action = "update";
            this.modalTitle = "Atualizar Receita";
        },

        async deleteRevenue() {
            try {
                await deleteData(this.item.id, "revenue");

                this.showMessage("Receita excluída com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir receita.", error);

                this.showMessage("Erro ao excluir receita.");
            }

            this.showModal = false;
            this.$emit("updateData");
        },

        showDeleteModal(item) {
            this.item = item;
            this.showModal = true;
            this.action = "delete";

            this.deleteMessage = `Tem certeza que deseja excluir o recebimento da mensalidade do 
                                    cliente ${item.name} referente ao mês de ${item.month}/${item.year}?`;
        },

        closeModal() {
            this.showModal = false;
        },

        showMessage(msg) {
            this.requestMessage = msg;
        },

        incrementData() {
            this.customers.forEach((customer) => {
                const matchingRevenues = this.revenue.filter(
                    (revenue) => revenue.customer_id === customer.id.toString()
                );

                matchingRevenues.forEach((matchingRevenue) => {
                    matchingRevenue.name = customer.name;
                    matchingRevenue.start = customer.start;
                    matchingRevenue.plan = customer.plan;
                });
            });
        },
    },

    watch: {
        revenue() {
            this.incrementData();
        },
    },

    mounted() {
        if (this.customers && this.customers.length > 0) {
            this.incrementData();
        }
    },
};
</script>

<style scoped>
</style>