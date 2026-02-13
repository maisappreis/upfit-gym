<template>
  <form class="form-area" @submit.prevent>
    <BaseInput
      label="Nome"
      v-model="form.name"
      type="text"
    />

    <BaseSelect
      label="Frequência"
      v-model="form.frequency"
    >
      <option value="1x">1x</option>
      <option value="2x">2x</option>
      <option value="3x">3x</option>
      <option value="4x">4x</option>
      <option value="5x">5x</option>
    </BaseSelect>

    <BaseInput
      label="Data de Início"
      v-model="form.start"
      type="date"
    />

    <BaseSelect
      label="Plano"
      v-model="form.plan"
    >
      <option value="Mensal">Mensal</option>
      <option value="Trimestral">Trimestral</option>
      <option value="Semestral">Semestral</option>
      <option value="Anual">Anual</option>
    </BaseSelect>

    <BaseInput
      label="Valor"
      v-model="form.value"
      type="number"
    />

    <BaseRadioGroup
      name="Status"
      v-model="form.status"
      :options="[
        { label: 'Ativo', value: 'Ativo' },
        { label: 'Inativo', value: 'Inativo' }
      ]"
    />

    <BaseTextarea
      label="Notas"
      v-model="form.notes"
    />
  </form>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type CreateCustomerDTO } from "@/types/customer";

import BaseInput from "@/components/common/form/BaseInput.vue";
import BaseSelect from "@/components/common/form/BaseSelect.vue";
import BaseTextarea from "@/components/common/form/BaseTextarea.vue";
import BaseRadioGroup from "@/components/common/form/BaseRadioGroup.vue";

const props = defineProps<{
  modelValue: CreateCustomerDTO;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: CreateCustomerDTO): void;
}>();

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const isValid = computed(() => {
  return (
    form.value.name.trim() !== "" &&
    form.value.frequency !== "" &&
    form.value.start !== "" &&
    form.value.value !== null
  );
});

defineExpose({
  isValid,
});
</script>