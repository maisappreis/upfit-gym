<template>
    <div class="content-area">
        <div style="display: flex; justify-content: space-between">
            <DefaultButton @executeAction="addRevenue">
                <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
                Nova Receita
            </DefaultButton>
            <DefaultSearch @applySearch="applySearch" />
        </div>
        <DefaulfTable :columns="columns" :data="revenue" />
        <DefaultModal v-if="showModal">
            <CustomersForm :item="item" @closeModal="closeModal" />
        </DefaultModal>
        <div v-if="showModal" class="defocus"></div>
    </div>
</template>

<script>
import DefaulfTable from "../common/DefaulfTable.vue";
import DefaultButton from "../common/DefaultButton.vue";
import DefaultSearch from "../common/DefaultSearch.vue";
import DefaultModal from "../common/DefaultModal.vue";
import CustomersForm from "../forms/CustomersForm.vue";
import { fetchData } from "../../services/api.js";

export default {
    name: "RevenuePage",
    components: {
        DefaulfTable,
        DefaultButton,
        DefaultSearch,
        DefaultModal,
        CustomersForm
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
            revenue: [],
            showModal: false,
            item: {},
        };
    },

    methods: {
        addRevenue() {
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.loadData();
        },

        async loadData() {
            try {
                const data = await fetchData();
                this.customers = data.customers;
                this.revenue = data.revenue;

                this.customers.forEach((customer) => {
                    const matchingRevenue = this.revenue.find(
                        (revenue) =>
                            revenue.idCustomer === customer.id.toString()
                    );

                    if (matchingRevenue) {
                        matchingRevenue.name = customer.name;
                        matchingRevenue.value = customer.value;
                        matchingRevenue.start = customer.start;
                        matchingRevenue.plan = customer.plan;
                    }
                });
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