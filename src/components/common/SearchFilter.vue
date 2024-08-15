<template>
  <input
    class="search-area"
    type="text"
    placeholder="Pesquisar nomes separados por vírgula..."
    v-model="search"
    @keyup.enter="applyFilter"
  />
</template>

<script>
export default {
  name: 'SearchFilter',

  data: function () {
    return {
      search: '',
      searchedField: []
    }
  },

  methods: {
    applyFilter() {
      this.searchedField = this.search
        .split(',')
        .filter((value) => value)
        .map((value) => value.trim())

      this.$emit('applySearch', this.searchedField)
    }
  },

  watch: {
    search() {
      if (this.search === '') {
        this.searchedField = []
        this.$emit('applySearch', this.searchedField)
      }
    }
  }
}
</script>

<style scoped>
.search-area {
  margin-left: 20px;
  padding: 12px;
  width: 25vw;

  font-weight: bold;
  font-size: 15px;
  border-radius: 5px;
  border: 2px solid #b4b4b4;
}

@media only screen and (max-width: 1000px) {
  .search-area {
    margin-left: 5px;
    padding: 2px;
    font-weight: lighter;
    font-size: 14px;
  }
}
</style>