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
            <option
                v-for="(month, index) in months"
                :key="index"
                :value="month"
            >
                {{ month }}
            </option>
        </select>
        <select
            class="form-select font"
            id="year"
            name="year"
            v-model="year"
            @change="$emit('get-year', this.year)"
            required
        >
            <option v-for="(year, index) in years"
                :key="index" :value="year">
                {{ year }}
            </option>
        </select>
    </div>
</template>

<script>
import { globalVariablesMixin } from "../../utils/variables.js";

export default {
    name: "MonthFilter",
    mixins: [globalVariablesMixin],

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
            this.month = this.months[currentMonth];

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