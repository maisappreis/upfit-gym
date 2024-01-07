<template>
    <div class="content-area">
        <div style="display: flex; justify-content: space-between">
            <DefaultButton @executeAction="addCustomer">
                <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
                Novo Cliente
            </DefaultButton>
            <DefaultSearch @applySearch="applySearch" />
        </div>
        <DefaulfTable
            :columns="columns"
            :data="customers"
            :searchedField="searchedField"
            @updateItem="updateCustomer"
        />
        <DefaultModal v-if="showModal">
            <CustomersForm
                :item="item"
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
import CustomersForm from "../forms/CustomersForm.vue";
import { fetchData } from "../../services/api.js";

export default {
    name: "CustomersPage",
    components: {
        DefaulfTable,
        DefaultButton,
        DefaultSearch,
        DefaultModal,
        CustomersForm,
    },

    data() {
        return {
            columns: [
                { key: "name", name: "Nome" },
                { key: "frequency", name: "Freq." },
                { key: "start", name: "Data de início" },
                { key: "plan", name: "Plano" },
                { key: "value", name: "Valor" },
                { key: "status", name: "Status" },
                { key: "notes", name: "Notas" },
                { key: "actions", name: "" },
            ],
            customers: [],
            searchedField: [],
            showModal: false,
            item: {},
        };
    },

    methods: {
        applySearch(field) {
            this.searchedField = field;
        },

        addCustomer() {
            this.showModal = true;
            this.modalTitle = "Adicionar Cliente";
        },

        updateCustomer(item) {
            this.showModal = true;
            this.item = item;
            this.modalTitle = "Atualizar Cliente";
        },

        closeModal() {
            this.showModal = false;
            this.loadData();
        },

        async loadData() {
            try {
                const data = await fetchData();
                this.customers = data.customers;
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