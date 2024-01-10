<template>
    <div class="content">
        <MetricsPage v-if="selectedPage === 'metrics'" />
        <CustomersPage
            v-if="selectedPage === 'customers'"
            :customers="customers"
            :selectedPage="selectedPage"
            @updateData="getData"
        />
        <RevenuePage
            v-if="selectedPage === 'revenue'"
            :revenue="revenue"
            :customers="customers"
            :selectedPage="selectedPage"
            @updateData="getData"
        />
        <ExpensesPage
            v-if="selectedPage === 'expenses'"
            :expenses="expenses"
            :selectedPage="selectedPage"
            @updateData="getData"
        />
    </div>
</template>

<script>
import MetricsPage from "./content/MetricsPage.vue";
import CustomersPage from "./content/CustomersPage.vue";
import RevenuePage from "./content/RevenuePage.vue";
import ExpensesPage from "./content/ExpensesPage.vue";
import { fetchData } from "../services/api.js";

export default {
    name: "ContentPage",

    components: {
        RevenuePage,
        ExpensesPage,
        MetricsPage,
        CustomersPage,
    },

    data() {
        return {
            customers: [],
            revenue: [],
            expenses: [],
        };
    },

    props: {
        selectedPage: String,
    },

    methods: {
        async getData() {
            try {
                const data = await fetchData();
                this.customers = data.customers;
                this.revenue = data.revenue;
                this.expenses = data.expenses;
            } catch (error) {
                console.error("Erro ao requisitar os dados...", error);
            }
        },
    },

    mounted() {
        this.getData();
    },
};
</script>

<style scoped>
.content {
    position: fixed;
    top: 90px;
    left: 230px;

    width: 87vw;
    height: 83vh;
    background-color: var(--gray-light-color);
}
</style>