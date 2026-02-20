<template>
  <input
      type="radio"
      class="form-radio"
      :value="value" 
      v-bind="{ ...$attrs, onChange: updateValue }"
      :checked="modelValue === value"
      :id="String(uuid)"
    />
  <label
    v-if="label"
    class="form-label"
    :for="String(uuid)"
  >
    {{ label }}
  </label>
  <BaseErrorMessage
    v-if="error"
    :id="`${String(uuid)}-error`"
  >
    {{ error }}
  </BaseErrorMessage>
</template>

<script setup lang="ts">
import UniqueID from "@/features/UniqueID";
import SetupFormComponent from "@/features/SetupFormComponent";
import BaseErrorMessage from "@/components/base/BaseErrorMessage.vue";

const props = defineProps<{
  label?: string
  modelValue?: string | number | null
  value: string | number | null
  error?: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean | null): void
}>();

const { updateValue } = SetupFormComponent(props, { emit });
const uuid = UniqueID().getID();
</script>

<style scoped>
.form-radio {
    margin: 7px;
    width: 20px;
}
</style>
