<template>
    <div class="content-area">
        <DefaultButton>Novo Cliente</DefaultButton>
        <DefaulfTable :columns="columns" :data="users" />
    </div>
</template>

<script>
import DefaulfTable from "../common/DefaulfTable.vue";
import DefaultButton from "../common/DefaultButton.vue";

export default {
    name: "CustomersPage",
    components: {
        DefaulfTable,
        DefaultButton,
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
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Inativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Ativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Ativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Ativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Inativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Ativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Inativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Ativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Inativo", notes: "Anotações", actions: "icone" },
                { name: "Jane Doe", frequency: "2x", start: "22/01/2023", plan: "Mensal", value: 250, status: "Ativo", notes: "Anotações", actions: "icone" },
            ],
        };
    },
};
</script>

<style scoped>
</style>