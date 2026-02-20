<template>
  <div class="form-item">
    <label class="form-label">{{ name }}:</label>
    <component
      v-for="option in options"
      :key="option.value as string"
      :is="vertical ? 'div' : 'span'"
      :style="vertical ? '' : 'margin-right: 20px;'"
    >
      <BaseRadio
        :name="name"
        :label="option.label"
        :modelValue="modelValue"
        :value="option.value"
        @update:modelValue="$emit('update:modelValue', $event)"
      />
    </component>
  </div>
</template>

<script setup lang="ts">
import BaseRadio from "@/components/base/form/BaseRadio.vue";

interface Option {
  label: string, value: string
};

const props = defineProps<{
  name: string,
  vertical?: boolean,
  modelValue: string | number,
  options: Option[]
}>();
</script>
