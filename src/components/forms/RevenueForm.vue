<template>
  <div>
    <h2 class="modal-title">{{ modalTitle }}</h2>
    <form class="form-area" @submit.prevent="saveRevenue">
      <div class="form-item">
        <label class="form-label" for="plan">Cliente:</label>
        <select class="form-select" id="plan" name="plan" v-model="customer" required>
          <option v-for="(cust, index) in customersList" :key="index" :value="cust">
            {{ cust.name }}
          </option>
        </select>
      </div>
      <div class="form-item">
        <label class="form-label" for="value">Valor:</label>
        <input class="form-input" type="number" id="value" name="value" v-model="value" required />
      </div>
      <div class="form-item">
        <label class="form-label" for="dueDate" style="min-width: 160px">Dia do Vencimento:</label>
        <input
          class="form-input"
          type="number"
          id="dueDate"
          name="dueDate"
          v-model="dueDate"
          min="1"
          max="31"
          required
        />
      </div>
      <div class="form-item">
        <label class="form-label" for="month" style="min-width: 110px">Receber em:</label>
        <select
          class="form-select font month"
          style="margin-right: 10px"
          id="month"
          name="month"
          v-model="month"
          required
        >
          <option v-for="(month, index) in months" :key="index" :value="month">
            {{ month }}
          </option>
        </select>
        <select
          class="form-select font"
          style="max-width: 120px"
          id="year"
          name="year"
          v-model="year"
          required
        >
          <option v-for="(year, index) in years" :key="index" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
      <div class="form-item">
        <label class="form-label" for="notes">Notas:</label>
        <textarea class="form-textarea" id="notes" name="notes" rows="4" v-model="notes"></textarea>
      </div>
      <div class="form-buttons-area">
        <DefaultButton type="submit" :disable="disable">Salvar</DefaultButton>
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
import { ref, computed, onMounted } from "vue";
import DefaultButton from "@/components/common/DefaultButton.vue";
import { type Revenue } from "@/types/revenue";
import { type Customer } from "@/types/customer";
import { months, years } from "@/utils/variablesTs";
import { useApiStore } from "@/stores/api";
import { useUtils } from "@/utils/utils";
import axios from "axios";

const apiStore = useApiStore();
const { getValidFloat } = useUtils();
const emit = defineEmits(["showMessage", "closeModal", "getConfirmation"]);

const customersList = ref<Customer[]>();
const customer = ref<Customer>();
const value = ref<number | null>(null);
const notes = ref<string>("");
const year = ref<number>(0);
const month = ref<string>("");
const dueDate = ref<number>(0);

const props = defineProps<{
  item: Revenue,
  action: "create" | "update" | "delete" | "";
  modalTitle: String;
  customers: Customer[];
}>();

const disable = computed(() => {
  return (
    customer.value === null ||
    year.value === 0 ||
    month.value === "" ||
    value.value === 0 ||
    dueDate.value === 0
  );
});

const saveRevenue = () => {
  if (props.action === "create") {
    createRevenue();
  } else {
    updateRevenue();
  }
};

const createRevenue = async () => {
  try {
    let validFloat = getValidFloat(value.value);

    let newRevenue = {
      customer: customer.value!.id,
      year: year.value,
      month: month.value,
      value: validFloat,
      payment_day: dueDate.value,
      notes: notes.value,
      paid: "À pagar"
    };

    await axios.post(`${apiStore.apiURL}/revenue/create/`, newRevenue);
    emit("showMessage", "Receita criada com sucesso!");

    emit("closeModal");
    await apiStore.fetchRevenue();
  } catch (error) {
    console.error("Erro ao criar receita.", error);
    emit("showMessage", "Erro ao criar receita.");
  }
};

const updateRevenue = async () => {
  try {
    let validFloat = getValidFloat(value.value);

    let updatedRevenue = {
      customer: props.item!.customer,
      year: year.value,
      month: month.value,
      value: validFloat,
      payment_day: dueDate.value,
      notes: notes.value
    };
    await axios.patch(`${apiStore.apiURL}/revenue/${props.item!.id}/`, updatedRevenue);
    emit("showMessage", "Receita atualizada com sucesso!");

    emit("closeModal");
    await apiStore.fetchRevenue();

    checkChangesInValue();
  } catch (error) {
    console.error("Erro ao atualizar receita.", error);
    emit("showMessage", "Erro ao atualizar receita.");
  }
};

const fillModal = () => {
  if (props.action === "create") {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let updatedYear = currentDate.getFullYear();
    let updatedMmonth = months[currentMonth];

    customersList.value = props.customers;
    customer.value = customersList.value[0];
    year.value = updatedYear;
    month.value = updatedMmonth;
  }

  if (props.action === "update") {
    let revenueValue = props.item.value;
    let formatedValue = revenueValue ? revenueValue.toString().replace(/\./g, ",") : 0;
    let customerID = props.item!.customer;
    let currentCustomer = props.customers!.find((e: Customer) => e.id === customerID);

    customersList.value = currentCustomer ? [currentCustomer]: [];
    customer.value = currentCustomer;
    value.value = Number(formatedValue);
    notes.value = props.item!.notes;
    dueDate.value = props.item!.payment_day;
    year.value = props.item!.year;
    month.value = props.item!.month;
  }
};

const checkChangesInValue = () => {
  let customer = props.customers!.filter((e: Customer) => e.id === props.item.customer);
  let customerValue = customer.map((e: Customer) => e.value);
  let customerName = customer.map((e: Customer) => e.name);

  let data = {
    id: props.item!.customer,
    month: props.item!.month,
    year: props.item!.year,
    name: customerName[0],
    currentValue: customerValue[0],
    updatedValue: value.value
  };

  if (customerValue[0] !== value.value) {
    emit("getConfirmation", data);
  }
};

onMounted(() => {
  fillModal();
});
</script>