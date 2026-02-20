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
import SetupFormComponent from "@/features/SetupFormComponent";
import UniqueID from "@/features/UniqueID";
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

const { updateValue } = SetupFormComponent(props, { emit });
const uuid = UniqueID().getID();

defineExpose({
  focus
});
</script>
