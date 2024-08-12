<template>
    <div class="content-area">
        <div style="display: flex; justify-content: space-between">
            <DefaultButton
                @executeAction="addRevenue"
                style="background-color: var(--red-dark-color)"
            >
                <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
                Nova Receita
            </DefaultButton>
            <div style="display: flex; justify-content: flex-end">
                <MonthFilter
                    @get-month="getMonth"
                    @get-year="getYear"
                    @get-status="getStatus"
                    :statusList="statusList"
                />
                <DefaultSearch @applySearch="applySearch" />
            </div>
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
        <DefaultModal
            v-if="showModal"
            :isForm="isForm"
            @executeAction="getModalAction"
            @closeModal="closeModal"
        >
            <h3 v-if="action === 'delete'" class="message-area">
                Tem certeza que deseja excluir o recebimento da mensalidade do
                cliente
                <strong class="highlight">{{ messageData.name }}</strong>
                referente ao mês de
                <strong class="highlight">{{ messageData.date }}</strong
                >?
            </h3>
            <h3 v-else-if="showConfirmation" class="message-area">
                O valor atual da mensalidade do cliente
                <strong class="highlight">{{ confirmationData.name }}</strong> é
                de
                <strong class="highlight"
                    >R${{ formatValue(confirmationData.currentValue) }}</strong
                >
                segundo o seu cadastro. Você gostaria de atualizar todos os
                futuros pagamentos deste cliente para este novo valor de
                <strong class="highlight"
                    >R${{ formatValue(confirmationData.updatedValue) }}</strong
                >?
            </h3>
            <RevenueForm
                v-else
                :item="item"
                :customers="customers"
                :action="action"
                :modalTitle="modalTitle"
                @updateTable="$emit('updateData')"
                @closeModal="closeModal"
                @showMessage="showMessage"
                @getConfirmation="getConfirmation"
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
import { globalVariablesMixin } from "@/utils/variables.js";
import axios from "axios";

export default {
    name: "RevenuePage",
    mixins: [globalVariablesMixin],

    components: {
        DefaultTable,
        DefaultButton,
        DefaultSearch,
        DefaultModal,
        RevenueForm,
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
            messageData: {},
            modalTitle: "",
            requestMessage: "",
            currentMonth: "",
            currentYear: 0,
            currentStatus: "",
            showConfirmation: false,
            confirmationData: {},
            isForm: false,
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
            this.isForm = true;
            this.action = "create";
            this.modalTitle = "Adicionar Receita";
        },

        updateRevenue(item) {
            this.showModal = true;
            this.isForm = true;
            this.item = item;
            this.action = "update";
            this.modalTitle = "Atualizar Receita";
        },

        async deleteRevenue() {
            try {
                await axios.delete(`${this.apiURL}/revenue/${this.item.id}/`);
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
            let date = `${item.month}/${item.year}`;

            this.messageData = {
                name: item.name,
                date: date,
            };
        },

        closeModal() {
            this.showModal = false;
            this.isForm = false;
            this.showConfirmation = false;
            this.action = "";
        },

        showMessage(msg) {
            this.requestMessage = msg;
        },

        getConfirmation(data) {
            this.confirmationData = data;
            this.showModal = true;
            this.showConfirmation = true;
        },

        getModalAction() {
            if (this.showConfirmation) {
                this.updateCustomerValue();
                this.updateFutureRevenue();

                this.closeModal();
                this.$emit("updateData");
            } else {
                this.deleteRevenue();
            }
        },

        updateFutureRevenue() {
            let nextMonth = this.$methods.getNextMonth(
                this.confirmationData.month,
                this.confirmationData.year
            );
            let nextRevenues = this.revenue.filter(
                (e) => e.month === nextMonth.month && e.year === nextMonth.year
            );

            for (let i = 0; i < nextRevenues.length; i++) {
                this.updateRevenueValue(nextRevenues[i].id);
            }
        },

        async updateCustomerValue() {
            try {
                let updatedCustomer = {
                    value: this.confirmationData.updatedValue,
                };

                await axios.patch(
                    `${this.apiURL}/customer/${this.confirmationData.id}/`,
                    updatedCustomer
                );
                this.$emit("showMessage", "Cliente atualizado com sucesso!");
            } catch (error) {
                console.error("Erro ao atualizar cliente.", error);
                this.$emit("showMessage", "Erro ao atualizar cliente.");
            }
        },

        async updateRevenueValue(id) {
            try {
                let updatedRevenue = {
                    value: this.confirmationData.updatedValue,
                };
                await axios.patch(
                    `${this.apiURL}/revenue/${id}/`,
                    updatedRevenue
                );
            } catch (error) {
                console.error("Erro ao atualizar receita.", error);
            }
        },

        incrementData() {
            this.customers.forEach((customer) => {
                const matchingRevenues = this.revenue.filter(
                    (revenue) => revenue.customer === customer.id
                );

                matchingRevenues.forEach((matchingRevenue) => {
                    matchingRevenue.name = customer.name;
                    matchingRevenue.start = customer.start;
                    matchingRevenue.plan = customer.plan;
                    matchingRevenue.status = customer.status;
                });
            });
        },

        formatValue(value) {
            return value.toFixed(2).toString().replace(/\./g, ",");
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
        this.$emit("updateData");
    },
};
</script>

<style scoped>
</style>