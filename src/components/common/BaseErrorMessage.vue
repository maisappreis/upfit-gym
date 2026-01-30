<template>
  <p
    aria-live="assertive"
    class="errorMessage"
    :id="id"
  >
    <slot />
  </p>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string
}>();
</script>
