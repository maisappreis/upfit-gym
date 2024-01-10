<template>
    <div class="filter-area">
        <select
            class="form-select font month"
            id="month"
            name="month"
            v-model="month"
            @change="$emit('get-month', this.month)"
            required
        >
            <option value="Janeiro">Janeiro</option>
            <option value="Fevereiro">Fevereiro</option>
            <option value="Março">Março</option>
            <option value="Abril">Abril</option>
            <option value="Maio">Maio</option>
            <option value="Junho">Junho</option>
            <option value="Julho">Julho</option>
            <option value="Agosto">Agosto</option>
            <option value="Setembro">Setembro</option>
            <option value="Outubro">Outubro</option>
            <option value="Novembro">Novembro</option>
            <option value="Dezembro">Dezembro</option>
            <option value="all">Todos os meses</option>
        </select>
        <select
            class="form-select font"
            id="year"
            name="year"
            v-model="year"
            @change="$emit('get-year', this.year)"
            required
        >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
        </select>
    </div>
</template>

<script>
export default {
    name: "MonthFilter",

    data() {
        return {
            month: "",
            year: 0,
        };
    },

    methods: {
        getDate() {
            let currentDate = new Date();

            let currentMonth = currentDate.getMonth();
            this.year = currentDate.getFullYear();

            const monthNames = [
                "Janeiro",
                "Fevereiro",
                "march",
                "april",
                "may",
                "june",
                "july",
                "august",
                "september",
                "october",
                "november",
                "december",
            ];
            this.month = monthNames[currentMonth];

            this.$emit("get-month", this.month);
            this.$emit("get-year", this.year);
        },
    },

    mounted() {
        this.getDate();
    },
};
</script>

<style scoped>
.filter-area {
    display: flex;
    margin-top: 20px;
    font-size: 20px;
}

.font {
    font-size: 16px;
}

.month {
    margin-right: 15px;
    min-width: 170px;
}
</style>