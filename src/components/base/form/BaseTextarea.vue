<template>
  <div class="form-item">
    <label
      v-if="label"
      :for="String(uuid)"
      class="form-label"
    >
      {{ label }}:
    </label>
    
    <textarea
      class="form-textarea"
      v-bind="{
        ...$attrs,
        onInput: updateValue
      }"
      :id="String(uuid)"
      :value="modelValue"
      :aria-describedby="error ? `${String(uuid)}-error` : undefined"
      :aria-invalid="error ? true : false"
      :class="{ error }"
    >
    </textarea>
  </div>
</template>

<script setup lang="ts">
import setupFormComponent from "@/utils/setupFormComponent";
import uniqueID from "@/utils/uniqueID";

const props = defineProps<{
  label?: string
  error?: string
  modelValue?: string | number | null
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean | null): void
}>();

const { updateValue } = setupFormComponent(props, { emit })
const uuid = uniqueID().getID();
</script>
