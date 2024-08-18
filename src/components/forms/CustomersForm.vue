<template>
  <div>
    <h2 class="modal-title">{{ modalTitle }}</h2>
    <form class="form-area" @submit.prevent="saveCustomer">
      <div class="form-item">
        <label class="form-label" for="name">Nome:</label>
        <input
          class="form-input"
          type="text"
          id="name"
          name="name"
          v-model="customerName"
          required
        />
      </div>
      <div class="form-item">
        <label class="form-label" for="frequency">Frequência:</label>
        <select class="form-select" id="frequency" name="frequency" v-model="frequency" required>
          <option value="1x">1x</option>
          <option value="2x">2x</option>
          <option value="3x">3x</option>
          <option value="4x">4x</option>
          <option value="5x">5x</option>
        </select>
      </div>
      <div class="form-item">
        <label class="form-label" for="start">Data de Início:</label>
        <input class="form-input" type="date" id="start" name="start" v-model="start" required />
      </div>
      <div class="form-item">
        <label class="form-label" for="plan">Plano:</label>
        <select class="form-select" id="plan" name="plan" v-model="plan" required>
          <option value="Mensal">Mensal</option>
          <option value="Trimestral">Trimestral</option>
          <option value="Semestral">Semestral</option>
          <option value="Anual">Anual</option>
        </select>
      </div>
      <div class="form-item">
        <label class="form-label" for="value">Valor:</label>
        <input class="form-input" type="text" id="value" name="value" v-model="value" required />
      </div>
      <div class="form-item">
        <label class="form-label">Status:</label>
        <input
          class="form-radio"
          type="radio"
          id="active"
          name="status"
          value="Ativo"
          v-model="status"
        />
        <label class="form-label" for="active">Ativo</label>
        <input
          class="form-radio"
          type="radio"
          id="inactive"
          name="status"
          value="Inativo"
          v-model="status"
        />
        <label class="form-label" for="inactive">Inativo</label>
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
import { globalVariablesMixin } from '@/utils/variables.js'
import { mapStores } from 'pinia'
import { useApiStore } from '@/stores/api'
import axios from 'axios'

export default {
  name: 'CustomersForm',
  mixins: [globalVariablesMixin],

  components: {
    DefaultButton
  },

  props: {
    item: Object,
    action: String,
    modalTitle: String
  },

  data: function () {
    return {
      customerName: '',
      frequency: '',
      start: '',
      plan: '',
      value: null,
      status: '',
      notes: ''
    }
  },

  computed: {
    ...mapStores(useApiStore),
    disable() {
      return (
        this.customerName === '' ||
        this.frequency === '' ||
        this.start === '' ||
        this.plan === '' ||
        this.value === 0 ||
        this.status === ''
      )
    }
  },

  methods: {
    saveCustomer() {
      if (this.action === 'create') {
        this.createCustomer()
      } else {
        this.updateCustomer()
      }
    },

    async createCustomer() {
      try {
        this.validateFloat()

        let newCustomer = {
          name: this.customerName,
          frequency: this.frequency,
          start: this.start,
          plan: this.plan,
          value: this.value,
          status: this.status,
          notes: this.notes
        }

        let response = await axios.post(`${this.apiStore.apiURL}/customer/create/`, newCustomer, {
          headers: {
            'X-CSRFToken': this.apiStore.tokenCSRF,
            'content-type': 'application/x-www-form-urlencoded'
          },
          withCredentials: true
        })

        this.$emit('showMessage', 'Cliente criado com sucesso!')

        this.$emit('closeModal')
        this.$emit('updateTable')

        if (this.status === 'Ativo') {
          setTimeout(() => {
            this.createRevenue(response.data.id)
          }, 500)
        }
      } catch (error) {
        console.error('Erro ao criar cliente.', error)
        this.$emit('showMessage', 'Erro ao criar cliente.')
      }
    },

    async updateCustomer() {
      try {
        this.validateFloat()

        let updatedCustomer = {
          name: this.customerName,
          frequency: this.frequency,
          start: this.start,
          plan: this.plan,
          value: this.value,
          status: this.status,
          notes: this.notes
        }

        await axios.put(`${this.apiStore.apiURL}/customer/${this.item.id}/`, updatedCustomer, {
          headers: {
            'X-CSRFToken': this.apiStore.tokenCSRF,
            'content-type': 'application/x-www-form-urlencoded'
          },
          withCredentials: true
        })
        this.$emit('showMessage', 'Cliente atualizado com sucesso!')

        this.$emit('closeModal')
        this.$emit('updateTable')
      } catch (error) {
        console.error('Erro ao atualizar cliente.', error)
        this.$emit('showMessage', 'Erro ao atualizar cliente.')
      }
    },

    async createRevenue(id) {
      try {
        let date = this.$methods.getCurrentYearAndMonth()

        let newRevenue = {
          customer: id,
          year: date.year,
          month: date.month,
          value: this.value,
          payment_day: 10,
          notes: this.notes,
          paid: 'À pagar'
        }

        await axios.post(`${this.apiStore.apiURL}/revenue/create/`, newRevenue, {
          headers: {
            'X-CSRFToken': this.apiStore.tokenCSRF,
            'content-type': 'application/x-www-form-urlencoded'
          },
          withCredentials: true
        })
      } catch (error) {
        console.error('Erro ao criar receita.', error)
      }
    },

    fillModal() {
      if (this.action === 'create') {
        let today = new Date()
        let year = today.getFullYear()
        let month = (today.getMonth() + 1).toString().padStart(2, '0')
        let day = today.getDate().toString().padStart(2, '0')
        let formattedDate = year + '-' + month + '-' + day

        this.start = formattedDate
        this.plan = 'Mensal'
        this.status = 'Ativo'
      }

      if (this.action === 'update') {
        let value = this.item.value
        let formatedValue = value.toString().replace(/\./g, ',')

        this.customerName = this.item.name
        this.frequency = this.item.frequency
        this.start = this.item.start
        this.plan = this.item.plan
        this.value = formatedValue
        this.status = this.item.status
        this.notes = this.item.notes
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
    }
  },

  mounted() {
    this.fillModal()
  }
}
</script>

<style scoped>
</style>