<template>
    <div>
        <h2>{{ modalTitle }}</h2>
        <div class="form-area">
            <div class="form-item">
                <label class="form-label" for="name">Nome:</label>
                <input
                    class="form-input"
                    type="text"
                    id="name"
                    name="name"
                    v-model="bill"
                    required
                />
            </div>
            <div class="form-item">
                <label
                    class="form-label"
                    for="due-date"
                    style="min-width: 170px"
                    >Data de Vencimento:</label
                >
                <input
                    class="form-input"
                    type="date"
                    id="due-date"
                    name="due-date"
                    v-model="dueDate"
                    required
                />
            </div>
            <div class="form-item">
                <label class="form-label" for="value">Valor:</label>
                <input
                    class="form-input"
                    type="number"
                    id="value"
                    name="value"
                    v-model="value"
                    required
                />
            </div>
            <div class="form-item">
                <label class="form-label" for="notes">Notas:</label>
                <textarea
                    class="form-textarea"
                    id="notes"
                    name="notes"
                    rows="4"
                    v-model="notes"
                ></textarea>
            </div>
            <div class="form-buttons-area">
                <DefaultButton
                    style="background-color: green"
                    @executeAction="saveExpense"
                >
                    Salvar
                </DefaultButton>
                <DefaultButton
                    style="background-color: red"
                    @executeAction="$emit('closeModal')"
                >
                    Cancelar
                </DefaultButton>
            </div>
        </div>
    </div>
</template>

<script>
import DefaultButton from "../common/DefaultButton.vue";
import { postData, updateData } from "../../services/api.js";
import { globalVariablesMixin } from "../../utils/variables.js";

export default {
    name: "ExpensesForm",
    mixins: [globalVariablesMixin],

    components: {
        DefaultButton,
    },

    props: {
        item: Object,
        action: String,
        modalTitle: String,
    },

    data() {
        return {
            bill: "",
            dueDate: "",
            value: 0,
            notes: "",
        };
    },

    methods: {
        saveExpense() {
            if (this.action === "create") {
                this.createExpense();
            } else {
                this.updateExpense();
            }

            this.$emit("updateTable");
        },

        async createExpense() {
            try {
                let date = this.getYearAndMonth(this.dueDate);
                let formatedDueDate = this.$methods.formatDate(this.dueDate)

                let newExpense = {
                    year: date.year,
                    month: date.month,
                    name: this.bill,
                    due_date: formatedDueDate,
                    value: this.value,
                    paid: false,
                    notes: "",
                };

                await postData("expenses", newExpense);
                this.$emit("showMessage", "Despesa criada com sucesso!");
            } catch (error) {
                console.error("Erro ao criar despesa.", error);
                this.$emit("showMessage", "Erro ao criar despesa.");
            }
        },

        async updateExpense() {
            try {
                let date = this.getYearAndMonth(this.dueDate);

                let newExpense = {
                    year: date.year,
                    month: date.month,
                    name: this.bill,
                    due_date: this.dueDate,
                };

                await updateData(this.item.id, "expenses", newExpense);
                this.$emit("showMessage", "Despesa atualizada com sucesso!");
            } catch (error) {
                console.error("Erro ao atualizar despesa.", error);
                this.$emit("showMessage", "Erro ao atualizar despesa.");
            }
        },

        getYearAndMonth(dueDate) {
            let parsedDate = new Date(dueDate);
            let year = parsedDate.getFullYear();
            let monthNumber = parsedDate.getMonth();
            let month = this.months[monthNumber];

            return { year, month };
        },

        fillModal() {
            this.bill = this.item.name;
            this.dueDate = this.item.due_date;
            this.value = this.item.value;
            this.notes = this.item.notes;
        },
    },

    mounted() {
        if (this.action === "update") {
            this.fillModal();
        }
    },
};
</script>

<style scoped>
</style>