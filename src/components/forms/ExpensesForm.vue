<template>
  <form class="form-area" @submit.prevent>
    <BaseInput
      label="Nome"
      v-model="form.name"
      type="text"
      ref="firstInput"
    />

    <BaseInput
      label="Data de Vencimento"
      v-model="form.date"
      type="date"
    />

    <BaseCheckbox
      label="Possui parcelas?"
      v-model="hasInstallments"
    />

    <div v-if="hasInstallments">
      <BaseInput
        label="Número de parcelas"
        v-model="form.installments"
        type="number"
      />
    </div>
    <p v-if="invalidInstallments" class="invalid">Parcelas inválidas.</p>

    <BaseInput
      label="Valor"
      v-model="form.value"
      type="number"
    />

    <BaseTextarea
      label="Notas"
      v-model="form.notes"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { type CreateExpenseDTO } from "@/types/expense";

import BaseInput from "@/components/base/form/BaseInput.vue";
import BaseCheckbox from "@/components/base/form/BaseCheckbox.vue";
import BaseTextarea from "@/components/base/form/BaseTextarea.vue";

const hasInstallments = ref<boolean>(false);

const props = defineProps<{
  modelValue: CreateExpenseDTO;
}>();

const emit = defineEmits<{
  (e: "update:modalValue", value: CreateExpenseDTO): void;
}>();

const firstInput = ref<InstanceType<typeof BaseInput> | null>(null);

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modalValue", value),
});

const isValid = computed(() => {
  return (
    form.value.name.trim() !== "" &&
    form.value.date !== "" &&
    form.value.value !== null
  );
});

const invalidInstallments = computed(() => {
  return (
    hasInstallments.value === true &&
    !Number.isInteger(Number(form.value.installments))
  );
});

onMounted(() => {
  firstInput.value?.focus();
});

defineExpose({
  isValid,
});
</script>

<style scoped>
.invalid {
  color: var(--error-color);
  margin: 0;
  font-size: 13px;
  text-align: right;
  font-weight: bold;
}
</style>