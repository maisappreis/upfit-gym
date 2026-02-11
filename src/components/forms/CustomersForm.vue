<template>
  <div>
    <h2 class="modal-title">{{ modalTitle }}</h2>
    <form class="form-area" @submit.prevent="saveCustomer">
      <BaseInput
        label="Nome"
        v-model="customerName"
        type="text"
      />

      <BaseSelect
        label="Frequência"
        v-model="frequency">
          <option value="1x">1x</option>
          <option value="2x">2x</option>
          <option value="3x">3x</option>
          <option value="4x">4x</option>
          <option value="5x">5x</option>
      </BaseSelect>

      <BaseInput
        label="Data de Início"
        v-model="start"
        type="date"
      />

      <BaseSelect
        label="Plano"
        v-model="plan">
          <option value="Mensal">Mensal</option>
          <option value="Trimestral">Trimestral</option>
          <option value="Semestral">Semestral</option>
          <option value="Anual">Anual</option>
      </BaseSelect>

      <BaseInput
        label="Valor"
        v-model="value"
        type="number"
      />

      <BaseRadioGroup
        name="Status"
        v-model="status"
        :options="[
          {label: 'Ativo', value: 'Ativo' },
          {label: 'Inativo', value: 'Inativo' }
        ]"
      />
      
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
import { useDateUtils } from "@/utils/dateUtils";
import { useDataUtils } from "@/utils/dataUtils";
import { customerService } from "@/services/customer.service";
import { revenueService } from "@/services/revenue.service";
import { type Customer } from "@/types/customer";

import BaseInput from "@/components/common/form/BaseInput.vue";
import BaseSelect from "@/components/common/form/BaseSelect.vue";
import BaseTextarea from "@/components/common/form/BaseTextarea.vue";
import BaseRadioGroup from "@/components/common/form/BaseRadioGroup.vue";
import DefaultButton from "@/components/common/DefaultButton.vue";

const apiStore = useApiStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();

const { capitalize, getValidFloat } = useDataUtils();
const { getCurrentYearMonthDay } = useDateUtils();
const emit = defineEmits(["close-modal"]);

const customerName = ref<string>("");
const frequency = ref<"1x" | "2x" | "3x" | "4x" | "5x" | "">("");
const start = ref<string>("");
const plan = ref<"Mensal" | "Trimestral" | "Semestral" | "Anual">("Mensal");
const value = ref<number | null>(null);
const status = ref<"Ativo" | "Inativo">("Ativo");
const notes = ref<string>("");

const props = defineProps<{
  item: Customer | null,
  action: "create" | "update" | "delete" | null;
  modalTitle: String;
}>();

const disable = computed(() => {
  return (
    customerName.value === "" ||
    frequency.value === "" ||
    start.value === "" ||
    value.value === null
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
  loadingStore.start();

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

    let response = await customerService.create(newCustomer);
    await apiStore.fetchCustomers();

    if (status.value === "Ativo") {
      setTimeout(() => {
        createRevenue(response.id, response.start);
      }, 500);
    }
    alertStore.success("Cliente criado com sucesso!");
    emit("close-modal");
  } catch (error) {
    alertStore.error("Erro ao criar cliente.", error);
  } finally {
    loadingStore.stop();
  }
};

const updateCustomer = async () => {
  loadingStore.start();

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

    await customerService.update(props.item!.id, updatedCustomer);
    await apiStore.fetchCustomers();
    await apiStore.fetchRevenue();

    alertStore.success("Cliente atualizado com sucesso!");
    emit("close-modal")
  } catch (error) {
    alertStore.error("Erro ao atualizar cliente.", error);
  } finally {
    loadingStore.stop();
  }
};

const createRevenue = async (id: number, startDate: string) => {
  try {
    let date = getCurrentYearMonthDay(startDate);
    let paidStatus = "À pagar" as "Pago" | "À pagar";

    let newRevenue = {
      customer: id,
      year: date.year,
      month: date.month,
      value: value.value,
      payment_day: Number(date.day),
      notes: notes.value,
      paid: paidStatus
    };

    await revenueService.create(newRevenue);
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
    let customerValue = props.item!.value;
    let formatedValue = customerValue ? customerValue.toString().replace(/\./g, ",") : 0;

    customerName.value = props.item!.name;
    frequency.value = props.item!.frequency;
    start.value = props.item!.start;
    plan.value = props.item!.plan;
    value.value = Number(formatedValue);
    status.value = props.item!.status;
    notes.value = props.item!.notes;
  }
};

onMounted(() => {
  fillModal();
});
</script>