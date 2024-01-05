<template>
    <div class="content-area">
        <div style="display: flex; justify-content: space-between">
            <DefaultButton>Novo Cliente</DefaultButton>
            <DefaultSearch @applySearch="applySearch"/>
        </div>
        <DefaulfTable :columns="columns" :data="users" :searchedField="searchedField"/>
    </div>
</template>

<script>
import DefaulfTable from "../common/DefaulfTable.vue";
import DefaultButton from "../common/DefaultButton.vue";
import DefaultSearch from "../common/DefaultSearch.vue";

export default {
    name: "CustomersPage",
    components: {
        DefaulfTable,
        DefaultButton,
        DefaultSearch
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
            users: [
                { name: "John Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Ativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Ativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Inativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Ativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Ativo", notes: "Anotações", actions: "icone" },
                { name: "Maisa Preis", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Inativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Ativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Ativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Ativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Inativo", notes: "Anotações", actions: "icone" },
                { name: "Renan Bernhardt", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Ativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Inativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Ativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Inativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Ativo", notes: "Anotações", actions: "icone" },
            ],
            searchedField: []
        };
    },

    methods: {
        applySearch (field) {
            this.searchedField = field
        }
    }
};
</script>

<style scoped>
</style>