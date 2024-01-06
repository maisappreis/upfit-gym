<template>
    <div class="content-area">
      <div style="display: flex; justify-content: space-between">
            <DefaultButton @executeAction="addRevenue">
                <font-awesome-icon icon="fa-solid fa-plus" class="icon" />
                Nova Receita
            </DefaultButton>
            <DefaultSearch @applySearch="applySearch" />
        </div>
        <DefaulfTable :columns="columns" :data="revenue" />
    </div>
</template>

<script>
import DefaulfTable from "../common/DefaulfTable.vue";
import DefaultButton from "../common/DefaultButton.vue";
import DefaultSearch from "../common/DefaultSearch.vue";
import { fetchData } from "../../services/api.js";

export default {
    name: "RevenuePage",
    components: {
        DefaulfTable, DefaultButton, DefaultSearch
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
        };
    },

    methods: {
        async loadData() {
            try {
                const data = await fetchData();
                this.customers = data.customers
                this.revenue = data.revenue;

                this.updateRevenue()
            } catch (error) {
                console.error("Erro ao requisitar os dados...", error);
            }
        },

        updateRevenue() {
          this.customers.forEach(customer => {
          const matchingRevenue = this.revenue.find(revenue => revenue.idCustomer === customer.id.toString());

          if (matchingRevenue) {
            matchingRevenue.name = customer.name;
            matchingRevenue.value = customer.value;
            matchingRevenue.start = customer.start;
            matchingRevenue.plan = customer.plan;
          }
        });
        }
    },

    mounted() {
        this.loadData();
    },
};
</script>

<style scoped>
.icon {
    margin-right: 10px;
    font-size: 18px;
}
</style>