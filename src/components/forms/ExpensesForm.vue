<template>
  <div>
    <h2 class="modal-title">{{ modalTitle }}</h2>
    <form class="form-area" @submit.prevent="saveExpense">
      <BaseInput
        label="Nome"
        v-model="bill"
        type="text"
      />

      <BaseInput
        label="Data de Vencimento"
        v-model="dueDate"
        type="date"
      />

      <BaseCheckbox
        label="Possui parcelas?"
        v-model="hasInstallments"
      />

      <div v-if="hasInstallments">
        <BaseInput
          label="Número de parcelas"
          v-model="installments"
          type="text"
          :disabled="disableInstallments"
        />
      </div>
      <p v-if="!validInstallment" class="invalid">Parcelas inválidas.</p>

      <BaseInput
        label="Valor"
        v-model="value"
        type="number"
      />

      <BaseTextarea
        label="Notas"
        v-model="notes"
      />
      
      <div class="form-buttons-area">
        <DefaultButton type="submit" :disable="disable">
          Salvar
        </DefaultButton>
        <DefaultButton
          style="background-color: red"
          type="button"
          @execute-action="$emit('close-modal')"
        >
          Cancelar
        </DefaultButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { months } from "@/utils/variables";
import { type Expense } from "@/types/expense";
import { useApiStore } from "@/stores/api";
import { useDataUtils } from "@/utils/dataUtils";
import { useLoadingStore } from "@/stores/loading";
import BaseInput from "@/components/common/form/BaseInput.vue";
import BaseCheckbox from "@/components/common/form/BaseCheckbox.vue";
import BaseTextarea from "@/components/common/form/BaseTextarea.vue";
import DefaultButton from "@/components/common/DefaultButton.vue";
import axios from "axios";

const apiStore = useApiStore();
const loadingStore = useLoadingStore();

const { capitalize, getValidFloat } = useDataUtils();
const emit = defineEmits(["show-message", "close-modal"]);

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
    value.value === null ||
    validInstallment.value === false
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
  loadingStore.start();
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
    await apiStore.fetchExpenses();

    emit("close-modal");
    emit("show-message", "Despesa criada com sucesso!");
  } catch (error) {
    console.error("Erro ao criar despesa.", error);
    emit("show-message", "Erro ao criar despesa.");
  } finally {
    loadingStore.stop();
  }
};

const updateExpense = async () => {
  loadingStore.start();
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
    await apiStore.fetchExpenses();

    emit("close-modal");
    emit("show-message", "Despesa atualizada com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar despesa.", error);
    emit("show-message", "Erro ao atualizar despesa.");
  } finally {
    loadingStore.stop();
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