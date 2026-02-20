<template>
  <div class="form-item">
    <label
      v-if="label"
      :for="String(uuid)"
      class="form-label"
    >
      {{ label }}:
    </label>
    
    <input
      class="form-input"
      v-bind="{
        ...$attrs,
        onInput: updateValue
      }"
      :id="String(uuid)"
      :value="modelValue"
      :aria-describedby="error ? `${String(uuid)}-error` : undefined"
      :aria-invalid="error ? true : false"
      :class="{ error }"
      ref="inputRef"
    >
  </div>
  <BaseErrorMessage
    v-if="error"
    :id="`${String(uuid)}-error`"
  >
    {{ error }}
  </BaseErrorMessage>
</template>

<script setup lang="ts">
import { ref } from "vue";
import setupFormComponent from "@/utils/setupFormComponent";
import uniqueID from "@/utils/uniqueID";
import BaseErrorMessage from "@/components/base/BaseErrorMessage.vue";

const props = defineProps<{
  label?: string
  error?: string
  modelValue?: string | number | null
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean | null): void
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const focus = () => inputRef.value?.focus();

const { updateValue } = setupFormComponent(props, { emit });
const uuid = uniqueID().getID();

defineExpose({
  focus
});
</script>
