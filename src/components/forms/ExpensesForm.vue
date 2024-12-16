<template>
  <div>
    <h2 class="modal-title">{{ modalTitle }}</h2>
    <form class="form-area" @submit.prevent="saveExpense">
      <div class="form-item">
        <label class="form-label" for="name">Nome:</label>
        <input class="form-input" type="text" id="name" name="name" v-model="bill" required />
      </div>
      <div class="form-item">
        <label class="form-label" for="due-date" style="min-width: 170px">
          Data de Vencimento:
        </label>
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
        <label class="form-label" for="has-installments">Possui parcelas?</label>
        <input
          type="checkbox"
          id="has-installments"
          name="has-installments"
          :checked="hasInstallments"
          v-model="hasInstallments"
          @change="setInstallments"
          :disabled="disableInstallments"
        />
      </div>
      <div v-if="hasInstallments" class="form-item">
        <label class="form-label" for="installments">Número de parcelas:</label>
        <input
          class="form-input"
          type="text"
          id="installments"
          name="installments"
          v-model="installments"
          :disabled="disableInstallments"
        />
      </div>
      <p v-if="!validInstallment" class="invalid">Parcelas inválidas.</p>
      <div class="form-item">
        <label class="form-label" for="value">Valor:</label>
        <input class="form-input" type="text" id="value" name="value" v-model="value" required />
      </div>
      <div class="form-item">
        <label class="form-label" for="notes">Notas:</label>
        <textarea class="form-textarea" id="notes" name="notes" rows="4" v-model="notes"></textarea>
      </div>
      <div class="form-buttons-area">
        <DefaultButton type="submit" :disable="disable"> Salvar </DefaultButton>
        <DefaultButton
          style="background-color: red"
          type="button"
          @executeAction="$emit('closeModal')"
        >
          Cancelar
        </DefaultButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import DefaultButton from "@/components/common/DefaultButton.vue";
import { months } from "@/utils/variables";
import { type Expense } from "@/types/expense";
import { useApiStore } from "@/stores/api";
import { useDataUtils } from "@/utils/dataUtils";
import axios from "axios";

const apiStore = useApiStore();
const { capitalize, getValidFloat } = useDataUtils();
const emit = defineEmits(["showMessage", "closeModal"]);

const bill = ref<string>("");
const dueDate = ref<string>("");
const value = ref<number | null>(null);
const notes = ref<string>("");
const hasInstallments = ref<boolean>(false);
const installments = ref<string>("");
const disableInstallments = ref<boolean>(false);
const validInstallment = ref<boolean>(true);

const props = defineProps<{
  item: Expense,
  action: "create" | "update" | "delete" | "";
  modalTitle: String;
}>();

const disable = computed(() => {
  return (
    bill.value === "" ||
    dueDate.value === "" ||
    value.value === null
  );
});

const saveExpense = () => {
  if (props.action === "create") {
    createExpense();
  } else {
    updateExpense();
  }
};

const createExpense = async () => {
  try {
    let validFloat = getValidFloat(value.value);
    let date = getYearAndMonth(dueDate.value);
    let nameCapitalized = capitalize(bill.value);

    let newExpense = {
      year: date.year,
      month: date.month,
      name: nameCapitalized,
      date: dueDate.value,
      installments: installments.value,
      value: validFloat,
      paid: "À pagar",
      notes: notes.value
    };

    await axios.post(`${apiStore.apiURL}/expense/create/`, newExpense);
    emit("showMessage", "Despesa criada com sucesso!");

    emit("closeModal");
    await apiStore.fetchExpenses();
  } catch (error) {
    console.error("Erro ao criar despesa.", error);
    emit("showMessage", "Erro ao criar despesa.");
  }
};

const updateExpense = async () => {
  try {
    let validFloat = getValidFloat(value.value);
    let date = getYearAndMonth(dueDate.value);
    let nameCapitalized = capitalize(bill.value);

    let updatedExpense = {
      year: date.year,
      month: date.month,
      name: nameCapitalized,
      date: dueDate.value,
      value: validFloat,
      notes: notes.value
    };

    await axios.patch(`${apiStore.apiURL}/expense/${props.item.id}/`, updatedExpense);
    emit("showMessage", "Despesa atualizada com sucesso!");

    emit("closeModal");
    await apiStore.fetchExpenses();
  } catch (error) {
    console.error("Erro ao atualizar despesa.", error);
    emit("showMessage", "Erro ao atualizar despesa.");
  }
};

const getYearAndMonth = (dueDate: string) => {
  let parsedDate = new Date(dueDate);
  let year = parsedDate.getFullYear();
  let monthNumber = parsedDate.getMonth();
  let month = months[monthNumber];

  return { year, month };
};

const fillModal = () => {
  let expenseValue = props.item.value;
  let formatedValue = expenseValue.toString().replace(/\./g, ",");

  bill.value = props.item.name;
  dueDate.value = props.item.date;
  value.value = Number(formatedValue);
  installments.value = props.item.installments;
  notes.value = props.item.notes;

  if (props.item.installments !== "") {
    hasInstallments.value = true;
    disableInstallments.value = true;
  }
};

const setInstallments = () => {
  if (!hasInstallments.value) {
    installments.value = "";
    validInstallment.value = true;
  }

  if (hasInstallments.value && installments.value === "") {
    validInstallment.value = false;
  }
  hasInstallments.value == !hasInstallments.value;
};

watch(() => installments.value, () => {
  const integerNumber = parseInt(installments.value);

  if (Number.isInteger(integerNumber) && hasInstallments.value) {
    validInstallment.value = Number.isInteger(integerNumber);
  }

  if (!Number.isInteger(integerNumber)) {
    validInstallment.value = false;
  }

  if (installments.value === "" && !hasInstallments.value) {
    validInstallment.value = true;
  }
});

onMounted(() => {
  if (props.action === "update") {
    fillModal();
  }
});
</script>

<style scoped>
.invalid {
  color: red;
  margin: 0;
  font-size: 13px;
  text-align: right;
  font-weight: bold;
}
</style>