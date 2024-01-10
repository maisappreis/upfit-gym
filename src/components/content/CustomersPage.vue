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
import DeleteMessage from "../common/DeleteMessage.vue";

export default {
    name: "CustomersPage",
    components: {
        DefaulfTable,
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
                { key: "notes", name: "Notas" },
                { key: "actions", name: "" },
            ],
            searchedField: [],
            showModal: false,
            item: {},
            action: "",
            deleteMessage: "",
            modalTitle: "",
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

        deleteCustomer() {
            console.log(
                `Fazer método DELETE em ${this.item.name}, id: ${this.item.id}`
            );
        },

        showDeleteModal(item) {
            this.item = item;
            this.showModal = true;
            this.action = "delete";

            this.deleteMessage = `Tem certeza que deseja excluir o cliente ${item.name}?`;
        },

        closeModal() {
            this.showModal = false;
            this.$emit("updateData");
        },
    },
};
</script>

<style scoped>
</style>