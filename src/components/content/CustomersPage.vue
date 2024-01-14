<template>
    <div class="content-area">
        <div style="display: flex; justify-content: space-between">
            <DefaultButton @executeAction="addCustomer">
                <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
                Novo Cliente
            </DefaultButton>
            <DefaultSearch @applySearch="applySearch" />
        </div>
        <DefaultTable
            :columns="columns"
            :data="customers"
            :searchedField="searchedField"
            :requestMessage="requestMessage"
            @updateItem="updateCustomer"
            @deleteItem="showDeleteModal"
        />
        <DefaultModal v-if="showModal">
            <DeleteMessage
                v-if="action === 'delete'"
                :deleteMessage="deleteMessage"
                @deleteItem="deleteCustomer"
                @closeModal="closeModal"
            />
            <CustomersForm
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
import CustomersForm from "../forms/CustomersForm.vue";
import DeleteMessage from "../common/DeleteMessage.vue";
import { deleteData } from "../../services/api.js";

export default {
    name: "CustomersPage",
    components: {
        DefaultTable,
        DefaultButton,
        DefaultSearch,
        DefaultModal,
        CustomersForm,
        DeleteMessage,
    },

    props: {
        customers: Array,
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
                { key: "actions", name: "" },
            ],
            searchedField: [],
            showModal: false,
            item: {},
            action: "",
            deleteMessage: "",
            modalTitle: "",
            requestMessage: "",
        };
    },

    methods: {
        applySearch(field) {
            this.searchedField = field;
        },

        addCustomer() {
            this.showModal = true;
            this.action = "create";
            this.modalTitle = "Adicionar Cliente";
        },

        updateCustomer(item) {
            this.showModal = true;
            this.item = item;
            this.action = "update";
            this.modalTitle = "Atualizar Cliente";
        },

        async deleteCustomer() {
            try {
                await deleteData(this.item.id, "customers");

                this.showMessage("Cliente excluído com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir cliente.", error);

                this.showMessage("Erro ao excluir cliente.");
            }

            this.showModal = false;
            this.$emit("updateData");
        },

        showDeleteModal(item) {
            this.item = item;
            this.showModal = true;
            this.action = "delete";

            this.deleteMessage = `Tem certeza que deseja excluir o cliente ${item.name}?`;
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