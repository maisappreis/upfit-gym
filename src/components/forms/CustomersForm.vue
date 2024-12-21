<template>
  <div>
    <h2 class="modal-title">{{ modalTitle }}</h2>
    <form class="form-area" @submit.prevent="saveCustomer">
      <div class="form-item">
        <label class="form-label" for="name">Nome:</label>
        <input
          class="form-input"
          type="text"
          id="name"
          name="name"
          v-model="customerName"
          required
        />
      </div>
      <div class="form-item">
        <label class="form-label" for="frequency">Frequência:</label>
        <select class="form-select" id="frequency" name="frequency" v-model="frequency" required>
          <option value="1x">1x</option>
          <option value="2x">2x</option>
          <option value="3x">3x</option>
          <option value="4x">4x</option>
          <option value="5x">5x</option>
        </select>
      </div>
      <div class="form-item">
        <label class="form-label" for="start">Data de Início:</label>
        <input class="form-input" type="date" id="start" name="start" v-model="start" required />
      </div>
      <div class="form-item">
        <label class="form-label" for="plan">Plano:</label>
        <select class="form-select" id="plan" name="plan" v-model="plan" required>
          <option value="Mensal">Mensal</option>
          <option value="Trimestral">Trimestral</option>
          <option value="Semestral">Semestral</option>
          <option value="Anual">Anual</option>
        </select>
      </div>
      <div class="form-item">
        <label class="form-label" for="value">Valor:</label>
        <input class="form-input" type="number" id="value" name="value" v-model="value" required />
      </div>
      <div class="form-item">
        <label class="form-label">Status:</label>
        <input
          class="form-radio"
          type="radio"
          id="active"
          name="status"
          value="Ativo"
          v-model="status"
        />
        <label class="form-label" for="active">Ativo</label>
        <input
          class="form-radio"
          type="radio"
          id="inactive"
          name="status"
          value="Inativo"
          v-model="status"
        />
        <label class="form-label" for="inactive">Inativo</label>
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
          @executeAction="$emit('close-modal')"
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
import { type Customer } from "@/types/customer";
import { useApiStore } from "@/stores/api";
import { useLoadingStore } from "@/stores/loading";
import { useDateUtils } from "@/utils/dateUtils";
import { useDataUtils } from "@/utils/dataUtils";
import axios from "axios";

const apiStore = useApiStore();
const loadingStore = useLoadingStore();

const { capitalize, getValidFloat } = useDataUtils();
const { getCurrentYearMonthDay } = useDateUtils();
const emit = defineEmits(["show-message", "close-modal"]);

const customerName = ref<string>("");
const frequency = ref<string>("");
const start = ref<string>("");
const plan = ref<string>("");
const value = ref<number | null>(null);
const status = ref<string>("");
const notes = ref<string>("");

const props = defineProps<{
  item: Customer,
  action: "create" | "update" | "delete" | "";
  modalTitle: String;
}>();

const disable = computed(() => {
  return (
    customerName.value === "" ||
    frequency.value === "" ||
    start.value === "" ||
    plan.value === "" ||
    value.value === null ||
    status.value === ""
  );
});

const saveCustomer = () => {
  if (props.action === "create") {
    createCustomer();
  } else {
    updateCustomer();
  }
};

const createCustomer = async () => {
  loadingStore.isLoading = true;
  try {
    let validFloat = getValidFloat(value.value);
    const customerCapitalized = capitalize(customerName.value);

    let newCustomer = {
      name: customerCapitalized,
      frequency: frequency.value,
      start: start.value,
      plan: plan.value,
      value: validFloat,
      status: status.value,
      notes: notes.value
    };

    let response = await axios.post(`${apiStore.apiURL}/customer/create/`, newCustomer);
    await apiStore.fetchCustomers();

    if (status.value === "Ativo") {
      setTimeout(() => {
        createRevenue(response.data.id, response.data.start);
      }, 500);
    }
    loadingStore.isLoading = false;
    emit("show-message", "Cliente criado com sucesso!");
    emit("close-modal");
  } catch (error) {
    console.error("Erro ao criar cliente.", error);
    loadingStore.isLoading = false;
    emit("show-message", "Erro ao criar cliente.");
  }
};

const updateCustomer = async () => {
  loadingStore.isLoading = true;
  try {
    let validFloat = getValidFloat(value.value);
    let customerNameCapitalized = capitalize(customerName.value);

    let updatedCustomer = {
      name: customerNameCapitalized,
      frequency: frequency.value,
      start: start.value,
      plan: plan.value,
      value: validFloat,
      status: status.value,
      notes: notes.value
    };

    await axios.patch(`${apiStore.apiURL}/customer/${props.item.id}/`, updatedCustomer);
    await apiStore.fetchCustomers();
    await apiStore.fetchRevenue();

    loadingStore.isLoading = false;
    emit("show-message", "Cliente atualizado com sucesso!");
    emit("close-modal")
  } catch (error) {
    console.error("Erro ao atualizar cliente.", error);
    loadingStore.isLoading = false;
    emit("show-message", "Erro ao atualizar cliente.");
  }
};

const createRevenue = async (id: number, startDate: string) => {
  try {
    let date = getCurrentYearMonthDay(startDate);

    let newRevenue = {
      customer: id,
      year: date.year,
      month: date.month,
      value: value.value,
      payment_day: date.day,
      notes: notes.value,
      paid: "À pagar"
    };

    await axios.post(`${apiStore.apiURL}/revenue/create/`, newRevenue);
    await apiStore.fetchRevenue();
  } catch (error) {
    console.error("Erro ao criar receita.", error);
  }
};

const fillModal = () => {
  if (props.action === "create") {
    let today = new Date();
    let year = today.getFullYear();
    let month = (today.getMonth() + 1).toString().padStart(2, "0");
    let day = today.getDate().toString().padStart(2, "0");
    let formattedDate = year + "-" + month + "-" + day;

    start.value = formattedDate;
    plan.value = "Mensal";
    status.value = "Ativo";
  }

  if (props.action === "update") {
    let customerValue = props.item.value;
    let formatedValue = customerValue.toString().replace(/\./g, ",");

    customerName.value = props.item.name;
    frequency.value = props.item.frequency;
    start.value = props.item.start;
    plan.value = props.item.plan;
    value.value = Number(formatedValue);
    status.value = props.item.status;
    notes.value = props.item.notes;
  }
};

onMounted(() => {
  fillModal();
});
</script>