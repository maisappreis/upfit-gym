<template>
  <div class="form-item">
    <label
      v-if="label"
      :for="String(uuid)"
      class="form-label"
    >
      {{ label }}
    </label>
    <input
      v-bind="{ ...$attrs, onChange: updateValue }"
      :checked="modelValue"
      :id="String(uuid)"
      type="checkbox"
    />
  </div>
  
  <BaseErrorMessage
    v-if="error"
    :id="`${uuid}-error`"
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
  error?: string
  modelValue?: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean | null): void
}>();

const { updateValue } = SetupFormComponent(props, { emit });
const uuid = UniqueID().getID();
</script>
