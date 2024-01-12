<template>
    <div class="content-area">
        <div style="display: flex; justify-content: space-between">
            <DefaultButton @executeAction="addRevenue">
                <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
                Nova Receita
            </DefaultButton>
            <MonthFilter @get-month="getMonth" @get-year="getYear" />
            <DefaultSearch @applySearch="applySearch" />
        </div>
        <DefaultTable
            :columns="columns"
            :data="filteredRevenue"
            :searchedField="searchedField"
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
                { key: "value", name: "Valor" },
                { key: "notes", name: "Notas" },
                { key: "paid", name: "Status" },
                { key: "actions", name: "" },
            ],
            searchedField: [],
            showModal: false,
            item: {},
            action: "",
            deleteMessage: "",
            modalTitle: "",
            currentMonth: "",
            currentYear: 0,
        };
    },

    computed: {
        filteredRevenue() {
            if (this.currentMonth === "all") {
                return this.revenue.filter((e) => e.year === this.currentYear);
            } else {
                return this.revenue.filter(
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

        deleteRevenue() {
            console.log(
                `Fazer método DELETE em ${this.item.name}, id: ${this.item.id}`
            );

            this.showModal = false;
            this.$emit('updateData')
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

        incrementData() {
            this.customers.forEach((customer) => {
                const matchingRevenue = this.revenue.find(
                    (revenue) => revenue.idCustomer === customer.id.toString()
                );

                if (matchingRevenue) {
                    matchingRevenue.name = customer.name;
                    matchingRevenue.start = customer.start;
                    matchingRevenue.plan = customer.plan;
                }
            });
        },
    },

    watch: {
        revenue() {
            this.incrementData();
        }
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