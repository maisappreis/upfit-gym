<template>
    <input class="search-area" type="text"
        placeholder="Pesquisar nomes separados por vírgula..."
        v-model="search" @keyup.enter="applyFilter">
</template>

<script>
export default {
  name: 'DefaultSearch',

  data: function () {
    return {
        search: "",
        searchedField: []
    }
  },

  methods: {
    applyFilter () {
      this.searchedField = this.search.split(',').filter(value => value).map(value => value.trim())

      this.$emit('applySearch', this.searchedField)
    }
  },

  watch:{
    search () {
      if (this.search === "") {
        this.searchedField = []
        this.$emit('applySearch', this.searchedField)
      }
    }
  }
}
</script>

<style scoped>
.search-area {
    margin: 20px 20px 0px 20px;
    padding: 12px;
    width: 400px;

    font-weight: bold;
    font-size: 15px;
    border-radius: 5px;
    border: 2px solid #b4b4b4;
}
</style>