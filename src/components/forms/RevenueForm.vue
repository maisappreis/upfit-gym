<template>
  <form class="form-area" @submit.prevent>
    <BaseSelect
      label="Cliente"
      v-model="form.customer"
      ref="firstInput"
    >
        <option
          v-for="(cust, index) in customersList"
          :key="index"
          :value="cust.id"
        >
          {{ cust.name }}
        </option>
    </BaseSelect>

    <BaseInput
      label="Valor"
      v-model="form.value"
      type="number"
    />

    <BaseInput
      label="Dia do Vencimento"
      v-model="form.payment_day"
      type="number"
      min="1"
      max="31"
    />

    <div class="form-item" style="justify-content: space-between;">
      <BaseSelect
        label="Receber em"
        v-model="form.month">
          <option v-for="(month, index) in months" :key="index" :value="month">
            {{ month }}
          </option>
      </BaseSelect>

      <BaseSelect
        v-model="form.year"
        style="width: 120px">
          <option v-for="(year, index) in years" :key="index" :value="year">
          {{ year }}
        </option>
      </BaseSelect>
    </div>

    <BaseTextarea
      label="Notas"
      v-model="form.notes"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { type CreateRevenueDTO } from "@/types/revenue";
import { type Customer } from "@/types/customer";

import BaseInput from "@/components/base/form/BaseInput.vue";
import BaseSelect from "@/components/base/form/BaseSelect.vue";
import BaseTextarea from "@/components/base/form/BaseTextarea.vue";

const props = defineProps<{
  modelValue: CreateRevenueDTO;
  customersList: Customer[];
  months: string[];
  years: number[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: CreateRevenueDTO): void;
}>();

const firstInput = ref<InstanceType<typeof BaseInput> | null>(null);

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const isValid = computed(() => {
  return (
    form.value.customer !== null &&
    form.value.year !== 0 &&
    form.value.month !== "" &&
    form.value.value !== 0 &&
    form.value.payment_day !== 0
  );
});

onMounted(() => {
  firstInput.value?.focus();
});

defineExpose({
  isValid,
});
</script>