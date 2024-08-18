<template>
  <div>
    <h2 class="modal-title">{{ modalTitle }}</h2>
    <form class="form-area" @submit.prevent="saveExpense">
      <div class="form-item">
        <label class="form-label" for="name">Nome:</label>
        <input class="form-input" type="text" id="name" name="name" v-model="bill" required />
      </div>
      <div class="form-item">
        <label class="form-label" for="due-date" style="min-width: 170px"
          >Data de Vencimento:</label
        >
        <input
          class="form-input"
          type="date"
          id="due-date"
          name="due-date"
          v-model="dueDate"
          required
        />
      </div>
      <div class="form-item">
        <label class="form-label" for="value">Valor:</label>
        <input class="form-input" type="text" id="value" name="value" v-model="value" required />
      </div>
      <div class="form-item">
        <label class="form-label" for="notes">Notas:</label>
        <textarea class="form-textarea" id="notes" name="notes" rows="4" v-model="notes"></textarea>
      </div>
      <div class="form-buttons-area">
        <DefaultButton type="submit" :disable="disable"> Salvar </DefaultButton>
        <DefaultButton
          style="background-color: red"
          type="button"
          @executeAction="$emit('closeModal')"
        >
          Cancelar
        </DefaultButton>
      </div>
    </form>
  </div>
</template>

<script>
import DefaultButton from '../common/DefaultButton.vue'
import { globalVariablesMixin } from '../../utils/variables.js'
import { mapStores } from 'pinia'
import { useApiStore } from '@/stores/api'
import axios from 'axios'

export default {
  name: 'ExpensesForm',
  mixins: [globalVariablesMixin],

  components: {
    DefaultButton
  },

  props: {
    item: Object,
    action: String,
    modalTitle: String
  },

  data() {
    return {
      bill: '',
      dueDate: '',
      value: null,
      notes: ''
    }
  },

  computed: {
    ...mapStores(useApiStore),
    disable() {
      return this.bill === '' || this.dueDate === '' || this.value === 0
    }
  },

  methods: {
    saveExpense() {
      if (this.action === 'create') {
        this.createExpense()
      } else {
        this.updateExpense()
      }
    },

    async createExpense() {
      try {
        this.validateFloat()
        let date = this.getYearAndMonth(this.dueDate)

        let newExpense = {
          year: date.year,
          month: date.month,
          name: this.bill,
          due_date: this.dueDate,
          value: this.value,
          paid: 'À pagar',
          notes: this.notes
        }

        await axios.post(`${this.apiStore.apiURL}/expense/create/`, newExpense, {
          headers: {
            'X-CSRFToken': this.apiStore.tokenCSRF,
            'content-type': 'application/x-www-form-urlencoded'
          },
          withCredentials: true
        })
        this.$emit('showMessage', 'Despesa criada com sucesso!')

        this.$emit('closeModal')
        await this.apiStore.fetchExpenses()
      } catch (error) {
        console.error('Erro ao criar despesa.', error)
        this.$emit('showMessage', 'Erro ao criar despesa.')
      }
    },

    async updateExpense() {
      try {
        this.validateFloat()
        let date = this.getYearAndMonth(this.dueDate)

        let updatedExpense = {
          year: date.year,
          month: date.month,
          name: this.bill,
          due_date: this.dueDate,
          value: this.value,
          notes: this.notes
        }

        await axios.patch(`${this.apiStore.apiURL}/expense/${this.item.id}/`, updatedExpense, {
          headers: {
            'X-CSRFToken': this.apiStore.tokenCSRF,
            'content-type': 'application/x-www-form-urlencoded'
          },
          withCredentials: true
        })
        this.$emit('showMessage', 'Despesa atualizada com sucesso!')

        this.$emit('closeModal')
        await this.apiStore.fetchExpenses()
      } catch (error) {
        console.error('Erro ao atualizar despesa.', error)
        this.$emit('showMessage', 'Erro ao atualizar despesa.')
      }
    },

    getYearAndMonth(dueDate) {
      let parsedDate = new Date(dueDate)
      let year = parsedDate.getFullYear()
      let monthNumber = parsedDate.getMonth()
      let month = this.months[monthNumber]

      return { year, month }
    },

    fillModal() {
      let value = this.item.value
      let formatedValue = value.toString().replace(/\./g, ',')

      this.bill = this.item.name
      this.dueDate = this.item.due_date
      this.value = formatedValue
      this.notes = this.item.notes
    },

    validateFloat() {
      const cleanedValue = this.value.replace(',', '.')
      const floatValue = parseFloat(cleanedValue)

      if (!isNaN(floatValue)) {
        this.value = floatValue
      } else {
        this.value = null
      }
    }
  },

  mounted() {
    if (this.action === 'update') {
      this.fillModal()
    }
  }
}
</script>

<style scoped>
</style>