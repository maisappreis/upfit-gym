<template>
    <div class="content-area">
        <div style="display: flex; justify-content: space-between">
            <DefaultButton @executeAction="addCustomer">
                <font-awesome-icon icon="fa-solid fa-plus" class="icon" />
                Novo Cliente
            </DefaultButton>
            <DefaultSearch @applySearch="applySearch"/>
        </div>
        <DefaulfTable :columns="columns" :data="customers" :searchedField="searchedField"/>
        <CustomerModal v-if="showModal" @closeModal="closeModal" />
        <div v-if="showModal" class="defocus"></div>
    </div>
</template>

<script>
import DefaulfTable from "../common/DefaulfTable.vue";
import DefaultButton from "../common/DefaultButton.vue";
import DefaultSearch from "../common/DefaultSearch.vue";
import CustomerModal from "../CustomerModal.vue";
import { fetchData } from "../../services/api.js";


export default {
    name: "CustomersPage",
    components: {
        DefaulfTable,
        DefaultButton,
        DefaultSearch,
        CustomerModal
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
            showModal: false
        };
    },

    methods: {
        applySearch (field) {
            this.searchedField = field
        },

        addCustomer () {
            this.showModal = true;
        },

        closeModal () {
            this.showModal = false;
            this.loadData();
        },

        async loadData() {
            try {
                const data = await fetchData();
                this.customers = data.customers;
            } catch (error) {
                console.error('Erro ao requisitar os dados...', error);
            }
        },
    },
    mounted() {
        this.loadData();
    }
};
</script>

<style scoped>
.defocus {
    position: absolute;
    top: 0;
    left: 0px;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.611);
}

.icon {
    margin-right: 10px;
    font-size: 18px;
}
</style>