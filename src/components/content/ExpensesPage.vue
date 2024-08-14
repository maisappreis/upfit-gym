<template>
  <div class="content-area">
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
      <DefaultButton @executeAction="addExpense" style="background-color: var(--red-dark-color)">
        <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
        <span class="button-text">Nova Despesa</span>
      </DefaultButton>
      <div style="display: flex; justify-content: flex-end">
        <MonthFilter
          @get-month="getMonth"
          @get-year="getYear"
          @get-status="getStatus"
          :statusList="statusList"
        />
        <SearchFilter @applySearch="applySearch" />
      </div>
    </div>
    <DefaultTable
      :columns="columns"
      :data="filteredExpenses"
      :searchedField="searchedField"
      :requestMessage="requestMessage"
      :page="selectedPage"
      @updateData="$emit('updateData')"
      @updateItem="updateExpense"
      @deleteItem="showDeleteModal"
    />
    <DefaultModal
      v-if="showModal"
      :isForm="isForm"
      @executeAction="deleteExpense"
      @closeModal="closeModal"
    >
      <h3 v-if="action === 'delete'" class="message-area">
        Tem certeza que deseja excluir o pagamento da despesa de
        <strong class="highlight">{{ messageData.name }}</strong> referente ao mês de
        <strong class="highlight">{{ messageData.date }}</strong
        >?
      </h3>
      <ExpensesForm
        v-else
        :item="item"
        :action="action"
        :modalTitle="modalTitle"
        @updateTable="$emit('updateData')"
        @closeModal="closeModal"
        @showMessage="showMessage"
      />
    </DefaultModal>
    <div v-if="showModal" class="defocus"></div>
  </div>
</template>

<script>
import DefaultTable from '../common/DefaultTable.vue'
import DefaultButton from '../common/DefaultButton.vue'
import SearchFilter from '../common/SearchFilter.vue'
import DefaultModal from '../common/DefaultModal.vue'
import MonthFilter from '../common/MonthFilter.vue'
import ExpensesForm from '../forms/ExpensesForm.vue'
import { globalVariablesMixin } from '@/utils/variables.js'
import axios from 'axios'

export default {
  name: 'ExpensesPage',
  mixins: [globalVariablesMixin],

  components: {
    DefaultTable,
    DefaultButton,
    SearchFilter,
    DefaultModal,
    ExpensesForm,
    MonthFilter
  },

  props: {
    expenses: Array,
    selectedPage: String
  },

  data() {
    return {
      columns: [
        { key: 'year', name: 'Ano' },
        { key: 'month', name: 'Mês' },
        { key: 'name', name: 'Nome' },
        { key: 'due_date', name: 'Vencimento' },
        { key: 'value', name: 'Valor' },
        { key: 'paid', name: 'Status' },
        { key: 'actions', name: '' }
      ],
      statusList: ['Pago', 'À pagar', 'Todos'],
      searchedField: [],
      showModal: false,
      item: {},
      action: '',
      messageData: {},
      modalTitle: '',
      requestMessage: '',
      currentMonth: '',
      currentYear: 0,
      currentStatus: '',
      isForm: false
    }
  },

  computed: {
    filteredExpenses() {
      return this.$computed.filteredData(
        this.expenses,
        this.currentMonth,
        this.currentYear,
        this.currentStatus
      )
    }
  },

  methods: {
    getMonth(month) {
      this.currentMonth = month
    },

    getYear(year) {
      this.currentYear = year
    },

    getStatus(status) {
      this.currentStatus = status
    },

    applySearch(field) {
      this.searchedField = field
    },

    addExpense() {
      this.showModal = true
      this.isForm = true
      this.action = 'create'
      this.modalTitle = 'Adicionar Despesa'
    },

    updateExpense(item) {
      this.showModal = true
      this.isForm = true
      this.item = item
      this.action = 'update'
      this.modalTitle = 'Atualizar Despesa'
    },

    async deleteExpense() {
      try {
        await axios.delete(`${this.apiURL}/expense/${this.item.id}/`)
        this.showMessage('Despesa excluída com sucesso!')
      } catch (error) {
        console.error('Erro ao excluir despesa.', error)

        this.showMessage('Erro ao excluir despesa.')
      }

      this.showModal = false
      this.$emit('updateData')
    },

    showDeleteModal(item) {
      this.item = item
      this.showModal = true
      this.action = 'delete'
      let date = `${item.month}/${item.year}`

      this.messageData = {
        name: item.name,
        date: date,
        view: 'expense'
      }
    },

    closeModal() {
      this.showModal = false
      this.isForm = false
    },

    showMessage(msg) {
      this.requestMessage = msg
    }
  }
}
</script>

<style scoped>
</style>