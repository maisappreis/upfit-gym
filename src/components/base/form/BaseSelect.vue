<template>
  <div class="form-item">
    <label
      v-if="label"
      :for="String(uuid)"
      class="form-label"
    >
      {{ label }}:
    </label>

    <select
      class="form-select"
      v-bind="$attrs"
      :id="String(uuid)"
      :value="modelValue"
      @change="updateValue"
      :aria-describedby="error ? `${String(uuid)}-error` : undefined"
      :aria-invalid="!!error"
      :class="{ error }"
      ref="inputRef"
    >
      <slot />
    </select>
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
