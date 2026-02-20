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

const { updateValue } = SetupFormComponent(props, { emit });
const uuid = UniqueID().getID();
</script>
