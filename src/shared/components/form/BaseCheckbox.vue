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
      style="cursor: pointer;"
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
import uniqueID from "@/shared/utils/uniqueID";
import setupFormComponent from "@/shared/utils/setupFormComponent";
import BaseErrorMessage from "@/shared/components/BaseErrorMessage.vue";

const props = defineProps<{
  label?: string
  error?: string
  modelValue?: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean | null): void
}>();

const { updateValue } = setupFormComponent(props, { emit });
const uuid = uniqueID().getID();
</script>
