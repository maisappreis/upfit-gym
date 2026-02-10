<template>
  <div>
    <h2 class="modal-title">{{ modalTitle }}</h2>
    <form class="form-area" @submit.prevent="saveRevenue">
      <BaseSelect
        label="Cliente"
        v-model="customerId">
          <option v-for="(cust, index) in customersList" :key="index" :value="cust.id">
            {{ cust.name }}
          </option>
      </BaseSelect>

      <BaseInput
        label="Valor"
        v-model="value"
        type="number"
      />

      <BaseInput
        label="Dia do Vencimento"
        v-model="dueDate"
        type="number"
        min="1"
        max="31"
      />
      <div class="form-item" style="justify-content: space-between;">
        <BaseSelect
          label="Receber em"
          v-model="month">
            <option v-for="(month, index) in months" :key="index" :value="month">
              {{ month }}
            </option>
        </BaseSelect>

        <BaseSelect
          v-model="year"
          style="width: 120px">
            <option v-for="(year, index) in years" :key="index" :value="year">
            {{ year }}
          </option>
        </BaseSelect>
      </div>

      <BaseTextarea
        label="Notas"
        v-model="notes"
      />
      <div class="form-buttons-area">
        <DefaultButton type="submit" :disable="disable">Salvar</DefaultButton>
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
import { ref, computed, onMounted } from "vue";
import { useApiStore } from "@/stores/api";
import { useAlertStore } from "@/stores/alert";
import { useLoadingStore } from "@/stores/loading";
import { months, years } from "@/utils/variables";
import { useDataUtils } from "@/utils/dataUtils";
import { type Revenue } from "@/types/revenue";
import { type Customer } from "@/types/customer";

import BaseInput from "@/components/common/form/BaseInput.vue";
import BaseSelect from "@/components/common/form/BaseSelect.vue";
import BaseTextarea from "@/components/common/form/BaseTextarea.vue";
import DefaultButton from "@/components/common/DefaultButton.vue";
import axios from "axios";

const apiStore = useApiStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();

const { getValidFloat } = useDataUtils();
const emit = defineEmits(["close-modal", "get-confirmation"]);

const customersList = ref<Customer[]>();
const customerId = ref<number>(0);
const value = ref<number | null>(null);
const notes = ref<string>("");
const year = ref<number>(0);
const month = ref<string>("");
const dueDate = ref<number>(0);

const props = defineProps<{
  item: Revenue | null,
  action: "create" | "update" | "delete" | null;
  modalTitle: String;
  customers: Customer[];
}>();

const customer = computed(() =>
  customersList.value && customersList.value.find(c => c.id === customerId.value)
);

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
  loadingStore.start();
  try {
    let validFloat = getValidFloat(value.value);

    let newRevenue = {
      customer: customerId.value,
      year: year.value,
      month: month.value,
      value: validFloat,
      payment_day: dueDate.value,
      notes: notes.value,
      paid: "À pagar"
    };

    await axios.post(`${apiStore.apiURL}/revenue/create/`, newRevenue);
    await apiStore.fetchRevenue();

    emit("close-modal");
    alertStore.success("Receita criada com sucesso!");
  } catch (error) {
    alertStore.error("Erro ao criar receita.", error);
  } finally {
    loadingStore.stop();
  }
};

const updateRevenue = async () => {
  loadingStore.start();
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
    await apiStore.fetchRevenue();

    emit("close-modal");
    alertStore.success("Receita atualizada com sucesso!");

    checkChangesInValue();
  } catch (error) {
    alertStore.error("Erro ao atualizar receita.", error);
  } finally {
    loadingStore.stop();
  }
};

const fillModal = () => {
  if (props.action === "create") {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let updatedYear = currentDate.getFullYear();
    let updatedMmonth = months[currentMonth];

    customersList.value = props.customers;
    customerId.value = customersList.value[0].id;
    year.value = updatedYear;
    month.value = updatedMmonth;
  }

  if (props.action === "update") {
    let revenueValue = props.item!.value;
    let formatedValue = revenueValue ? revenueValue.toString().replace(/\./g, ",") : 0;
    let customerID = props.item!.customer;
    let currentCustomer = props.customers!.find((e: Customer) => e.id === customerID);

    customersList.value = currentCustomer ? [currentCustomer]: [];
    customerId.value = currentCustomer ? currentCustomer.id : 0;
    value.value = Number(formatedValue);
    notes.value = props.item!.notes;
    dueDate.value = props.item!.payment_day;
    year.value = props.item!.year;
    month.value = props.item!.month;
  }
};

const checkChangesInValue = () => {
  let customer = props.customers!.filter((e: Customer) => e.id === props.item!.customer);
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

  if (customerValue[0] !== Number(value.value)) {
    emit("get-confirmation", data);
  }
};

onMounted(() => {
  fillModal();
});
</script>