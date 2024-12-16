<template>
  <div class="filter-area">
    <select
      class="form-select font min-width"
      id="status"
      name="status"
      v-model="customerStatus"
      @change="$emit('get-status', customerStatus)"
      required
    >
      <option v-for="(status, index) in statusList" :key="index" :value="status">
        {{ status }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const customerStatus = ref<string>("");
const statusList = ref<string[]>(["Ativo", "Inativo", "Todos"]);

const emit = defineEmits(["get-status"]);

const getStatus = () => {
  customerStatus.value = "Ativo";
  emit("get-status", customerStatus.value);
};

onMounted(() => {
  getStatus();
});
</script>

<style scoped>
.filter-area {
  display: flex;
  font-size: 20px;
}

.font {
  font-size: 16px;
  margin-left: 15px;
}

.min-width {
  min-width: 140px;
}

@media only screen and (max-width: 1000px) {
  .font {
    font-size: 14px;
  }
}
</style>