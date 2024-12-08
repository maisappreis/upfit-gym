<template>
  <div class="content-area">
    <div class="flex-between mb-normal">
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
        <SearchFilter @apply-search="applySearch" />
      </div>
    </div>
    <DefaultTable
      :columns="columns"
      :data="filteredExpenses"
      :searchedField="searchedField"
      :requestMessage="requestMessage"
      @updateItem="updateExpense"
      @deleteItem="showDeleteModal"
    />
    <ModalCard
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
        @closeModal="closeModal"
        @showMessage="showMessage"
      />
    </ModalCard>
    <div v-if="showModal" class="defocus"></div>
  </div>
</template>

<script>
import DefaultTable from '../common/DefaultTable.vue'
import DefaultButton from '../common/DefaultButton.vue'
import SearchFilter from '../common/SearchFilter.vue'
import ModalCard from '../common/ModalCard.vue'
import MonthFilter from '../common/MonthFilter.vue'
import ExpensesForm from '../forms/ExpensesForm.vue'
import { globalVariablesMixin } from '@/utils/variables.js'
import { mapStores } from 'pinia'
import { useApiStore } from '@/stores/api'
import axios from 'axios'

export default {
  name: 'ExpensesPage',
  mixins: [globalVariablesMixin],

  components: {
    DefaultTable,
    DefaultButton,
    SearchFilter,
    ModalCard,
    ExpensesForm,
    MonthFilter
  },

  props: {
    expenses: Array
  },

  data() {
    return {
      columns: [
        { key: 'year', name: 'Ano' },
        { key: 'month', name: 'Mês' },
        { key: 'name', name: 'Nome' },
        { key: 'date', name: 'Vencimento' },
        { key: 'installments', name: 'Parcelas' },
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
    ...mapStores(useApiStore),
    filteredExpenses() {
      return this.$computed.filteredData(
        this.apiStore.expenses,
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
        await axios.delete(`${this.apiStore.apiURL}/expense/${this.item.id}/`)
        this.showMessage('Despesa excluída com sucesso!')
      } catch (error) {
        console.error('Erro ao excluir despesa.', error)

        this.showMessage('Erro ao excluir despesa.')
      }

      this.showModal = false
      await this.apiStore.fetchExpenses()
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