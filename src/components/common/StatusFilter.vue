<template>
  <div class="filter-area">
    <select
      class="form-select font status"
      id="status"
      name="status"
      v-model="customerStatus"
      @change="$emit('get-status', this.customerStatus)"
      required
    >
      <option v-for="(status, index) in statusList" :key="index" :value="status">
        {{ status }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'StatusFilter',

  data() {
    return {
      customerStatus: '',
      statusList: ['Ativo', 'Inativo', 'Todos']
    }
  },

  methods: {
    getStatus() {
      this.customerStatus = 'Ativo'
      this.$emit('get-status', this.customerStatus)
    }
  },

  mounted() {
    this.getStatus()
  }
}
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

.status {
  min-width: 140px;
}

@media only screen and (max-width: 1000px) {
  .font {
    font-size: 14px;
  }
}
</style>