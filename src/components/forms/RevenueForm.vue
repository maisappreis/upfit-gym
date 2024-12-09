<template>
  <div>
    <h2 class="modal-title">{{ modalTitle }}</h2>
    <form class="form-area" @submit.prevent="saveRevenue">
      <div class="form-item">
        <label class="form-label" for="plan">Cliente:</label>
        <select class="form-select" id="plan" name="plan" v-model="customer" required>
          <option v-for="(customer, index) in customers" :key="index" :value="customer">
            {{ customer.name }}
          </option>
        </select>
      </div>
      <div class="form-item">
        <label class="form-label" for="value">Valor:</label>
        <input class="form-input" type="text" id="value" name="value" v-model="value" required />
      </div>
      <div class="form-item">
        <label class="form-label" for="dueDate" style="min-width: 160px">Dia do Vencimento:</label>
        <input
          class="form-input"
          type="number"
          id="dueDate"
          name="dueDate"
          v-model="dueDate"
          min="1"
          max="31"
          required
        />
      </div>
      <div class="form-item">
        <label class="form-label" for="month" style="min-width: 110px">Receber em:</label>
        <select
          class="form-select font month"
          style="margin-right: 10px"
          id="month"
          name="month"
          v-model="month"
          required
        >
          <option v-for="(month, index) in months" :key="index" :value="month">
            {{ month }}
          </option>
        </select>
        <select
          class="form-select font"
          style="max-width: 120px"
          id="year"
          name="year"
          v-model="year"
          required
        >
          <option v-for="(year, index) in years" :key="index" :value="year">
            {{ year }}
          </option>
        </select>
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
import DefaultButton from "@/components/common/DefaultButton.vue";
import { globalVariablesMixin } from '../../utils/variables.js'
import { mapStores } from 'pinia'
import { useApiStore } from '@/stores/api'
import axios from 'axios'

export default {
  name: 'RevenueForm',
  mixins: [globalVariablesMixin],

  components: {
    DefaultButton
  },

  props: {
    item: Object,
    action: String,
    modalTitle: String,
    customers: Array
  },

  data: function () {
    return {
      customer: '',
      value: null,
      notes: '',
      year: 0,
      month: '',
      dueDate: 0
    }
  },

  computed: {
    ...mapStores(useApiStore),
    disable() {
      return (
        this.customer === '' ||
        this.year === 0 ||
        this.month === '' ||
        this.value === 0 ||
        this.dueDate === 0
      )
    }
  },

  methods: {
    saveRevenue() {
      if (this.action === 'create') {
        this.createRevenue()
      } else {
        this.updateRevenue()
      }
    },

    async createRevenue() {
      try {
        this.validateFloat()

        let newRevenue = {
          customer: this.customer.id,
          year: this.year,
          month: this.month,
          value: this.value,
          payment_day: this.dueDate,
          notes: this.notes,
          paid: 'À pagar'
        }

        await axios.post(`${this.apiStore.apiURL}/revenue/create/`, newRevenue)
        this.$emit('showMessage', 'Receita criada com sucesso!')

        this.$emit('closeModal')
        await this.apiStore.fetchRevenue()
      } catch (error) {
        console.error('Erro ao criar receita.', error)
        this.$emit('showMessage', 'Erro ao criar receita.')
      }
    },

    async updateRevenue() {
      try {
        this.validateFloat()

        let updatedRevenue = {
          customer: this.item.customer,
          year: this.year,
          month: this.month,
          value: this.value,
          payment_day: this.dueDate,
          notes: this.notes
        }
        await axios.patch(`${this.apiStore.apiURL}/revenue/${this.item.id}/`, updatedRevenue)
        this.$emit('showMessage', 'Receita atualizada com sucesso!')

        this.$emit('closeModal')
        await this.apiStore.fetchRevenue()

        this.checkChangesInValue()
      } catch (error) {
        console.error('Erro ao atualizar receita.', error)
        this.$emit('showMessage', 'Erro ao atualizar receita.')
      }
    },

    fillModal() {
      if (this.action === 'create') {
        let currentDate = new Date()
        let currentMonth = currentDate.getMonth()
        let year = currentDate.getFullYear()
        let month = this.months[currentMonth]

        this.year = year
        this.month = month
      }

      if (this.action === 'update') {
        let value = this.item.value
        let formatedValue = value.toString().replace(/\./g, ',')
        let customerID = Number(this.item.customer)

        this.customer = this.customers.find((e) => e.id === customerID)
        this.value = formatedValue
        this.notes = this.item.notes
        this.dueDate = this.item.payment_day
        this.year = this.item.year
        this.month = this.item.month
      }
    },

    validateFloat() {
      const cleanedValue = this.value.replace(',', '.')
      const floatValue = parseFloat(cleanedValue)

      if (!isNaN(floatValue)) {
        this.value = floatValue
      } else {
        this.value = null
      }
    },

    checkChangesInValue() {
      let customer = this.customers.filter((e) => e.id === this.item.customer)
      let customerValue = customer.map((e) => e.value)
      let customerName = customer.map((e) => e.name)

      let data = {
        id: this.item.customer,
        month: this.item.month,
        year: this.item.year,
        name: customerName[0],
        currentValue: customerValue[0],
        updatedValue: this.value
      }

      if (customerValue[0] !== this.value) {
        this.$emit('getConfirmation', data)
      }
    }
  },

  mounted() {
    this.fillModal()
  }
}
</script>

<style scoped>
</style>