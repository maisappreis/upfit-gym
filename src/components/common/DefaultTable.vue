<template>
  <div>
    <div v-if="columns.length > 0 && paginatedData.length > 0">
      <div class="table-overflow">
        <table class="table-area" style="max-height: 50vh; overflow: auto">
          <thead>
            <tr>
              <th v-for="column in columns" :key="column.key" style="text-align: center">
                {{ column.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td v-for="column in columns" :key="column.key" style="text-align: center">
                <span v-if="column.key === 'actions'" class="align-right">
                  <font-awesome-icon
                    v-if="item.notes"
                    icon="fa-solid fa-circle-info"
                    class="icon"
                    @click="showNotes($event, item)"
                  />
                  <font-awesome-icon
                    icon="fa-solid fa-pen-to-square"
                    class="icon"
                    @click="$emit('updateItem', item)"
                  />
                  <font-awesome-icon
                    icon="fa-solid fa-trash-can"
                    class="icon"
                    @click="$emit('deleteItem', item)"
                  />
                </span>
                <span
                  v-else-if="column.key === 'status'"
                  class="status"
                  :class="{
                    active: item[column.key] === 'Ativo',
                    inactive: item[column.key] === 'Inativo'
                  }"
                >
                  {{ item[column.key] }}
                </span>
                <span v-else-if="column.key === 'value'">
                  R$
                  {{ item[column.key].toFixed(2).toString().replace(/\./g, ',') }}
                </span>
                <span v-else-if="column.key === 'start' || column.key === 'due_date'">
                  {{ this.formatDate(item[column.key]) }}
                </span>
                <span
                  v-else-if="column.key === 'paid'"
                  class="status paid"
                  :class="{
                    active: item[column.key] === 'Pago',
                    inactive: item[column.key] === 'À pagar',
                    sent: item[column.key] === 'Link enviado'
                  }"
                  @click="confirmPaidStatus(item)"
                >
                  {{ item[column.key] }}
                </span>
                <span v-else>
                  {{ item[column.key] }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-area">
        <span class="pagination-items">Página {{ currentPage }} de {{ totalPages }}</span>
        <button class="pagination-button" @click="goToFirstPage" :disabled="currentPage === 1">
          &laquo;&laquo;
        </button>
        <button class="pagination-button" @click="previousPage" :disabled="currentPage === 1">
          &laquo;
        </button>
        <button
          v-for="pageNumber in getPageNumbers()"
          :key="pageNumber"
          class="pagination-button"
          @click="goToPage(pageNumber)"
          :class="{ active: pageNumber === currentPage }"
        >
          {{ pageNumber }}
        </button>
        <button class="pagination-button" @click="nextPage" :disabled="currentPage === totalPages">
          &raquo;
        </button>
        <button
          class="pagination-button"
          @click="goToLastPage"
          :disabled="currentPage === totalPages"
        >
          &raquo;&raquo;
        </button>
        <select v-model="itemsPerPage">
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="8">8</option>
          <option value="15">15</option>
          <option value="30">30</option>
        </select>
        <span class="pagination-items">Total de {{ totalItems }} itens</span>
      </div>
      <DefaultTooltip v-if="showingTooltip" :mouseX="mouseX" :mouseY="mouseY">
        <p class="tooltip-text">{{ this.tooltip }}</p>
      </DefaultTooltip>
    </div>
    <div v-else class="not-found">Nenhum resultado foi encontrado.</div>
    <RequestAlert
      v-if="responseMessage"
      :responseMessage="responseMessage"
      @closeMessage="responseMessage = ''"
    >
      {{ responseMessage }}
    </RequestAlert>
    <DefaultModal v-if="showModal" @executeAction="changePaidStatus" @closeModal="closeModal">
      <span class="message-area" style="font-size: 20px"
        >Marcar como <strong>{{ statusMessage }}</strong
        >?</span
      >
    </DefaultModal>
    <div v-if="showModal" class="defocus"></div>
  </div>
</template>

<script>
import DefaultTooltip from './DefaultTooltip.vue'
import RequestAlert from './RequestAlert.vue'
import DefaultModal from '../common/DefaultModal.vue'
import { mapStores } from 'pinia'
import { useApiStore } from '@/stores/api'
import { usePageStore } from '@/stores/page'
import axios from 'axios'

export default {
  name: 'DefaultTable',
  components: { DefaultTooltip, RequestAlert, DefaultModal },
  props: {
    columns: Array,
    data: Array,
    searchedField: Array,
    requestMessage: String
  },

  data: function () {
    return {
      itemsPerPage: 8,
      currentPage: 1,
      checkboxState: false,
      showingTooltip: false,
      tooltip: '',
      mouseX: 0,
      mouseY: 0,
      responseMessage: '',
      entity: '',
      showModal: false,
      selectedItem: {},
      statusMessage: ''
    }
  },

  computed: {
    ...mapStores(useApiStore, usePageStore),
    paginatedData() {
      if (this.searchedField && this.searchedField.length == 0) {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage
        const endIndex = startIndex + Number(this.itemsPerPage)

        return this.filteredList.slice(startIndex, endIndex)
      } else {
        return this.filteredList
      }
    },

    totalPages() {
      if (this.searchedField && this.searchedField.length > 0) {
        return Math.ceil(this.filteredList.length / this.itemsPerPage)
      } else {
        return Math.ceil(this.orderedData.length / this.itemsPerPage)
      }
    },

    totalItems() {
      if (this.searchedField && this.searchedField.length > 0) {
        return this.filteredList.length
      } else {
        return this.orderedData.length
      }
    },

    filteredList() {
      if (this.searchedField && this.searchedField.length > 0) {
        return this.orderedData.reduce((filteredData, item) => {
          const matched = this.searchedField.some((element) => {
            const searchedFieldName = element.toLowerCase()
            const listedFieldName = item.name.toLowerCase()

            return listedFieldName.includes(searchedFieldName)
          })
          if (matched) {
            filteredData.push(item)
          }
          return filteredData
        }, [])
      } else {
        return this.orderedData
      }
    },

    orderedData() {
      if (this.data && this.data.length > 0) {
        let orderedList = this.orderData(this.data)
        return orderedList
      } else {
        return []
      }
    }
  },

  methods: {
    showNotes(event, item) {
      this.showingTooltip = !this.showingTooltip
      this.tooltip = item.notes
      this.mouseX = event.clientX - 40
      this.mouseY = event.clientY + 15
    },

    confirmPaidStatus(item) {
      this.selectedItem = item

      if (this.pageStore.currentPage === 'revenue') {
        if (this.selectedItem.paid == 'À pagar') {
          this.statusMessage = 'link enviado'
        } else if (this.selectedItem.paid == 'Link enviado') {
          this.statusMessage = 'pago'
        } else if (this.selectedItem.paid == 'Pago') {
          this.statusMessage = 'à pagar'
        }
      }

      if (this.pageStore.currentPage === 'expenses') {
        if (this.selectedItem.paid == 'À pagar') {
          this.statusMessage = 'pago'
        } else if (this.selectedItem.paid == 'Pago') {
          this.statusMessage = 'à pagar'
        }
      }

      this.showModal = true
    },

    closeModal() {
      this.showModal = false
      this.statusMessage = ''
    },

    async changePaidStatus() {
      try {
        let updatedPaidStatus = {}

        if (this.pageStore.currentPage === 'expenses') {
          this.entity = 'expense'
          if (this.selectedItem.paid === 'À pagar') {
            updatedPaidStatus = {
              paid: 'Pago'
            }
          } else if (this.selectedItem.paid === 'Pago') {
            updatedPaidStatus = {
              paid: 'À pagar'
            }
          }
        } else if (this.pageStore.currentPage === 'revenue') {
          this.entity = 'revenue'
          if (this.selectedItem.paid === 'À pagar') {
            updatedPaidStatus = {
              paid: 'Link enviado'
            }
          } else if (this.selectedItem.paid === 'Link enviado') {
            updatedPaidStatus = {
              paid: 'Pago'
            }
          } else if (this.selectedItem.paid === 'Pago') {
            updatedPaidStatus = {
              paid: 'À pagar'
            }
          }
        }

        await axios.patch(
          `${this.apiStore.apiURL}/${this.entity}/${this.selectedItem.id}/`,
          updatedPaidStatus,
          {
            headers: {
              // Authorization: `Token ${this.apiStore.tokenAuthentication}`,
              'X-CSRFToken': this.apiStore.tokenCSRF,
              'content-type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true
          }
        )
        if (this.entity === 'revenue') await this.apiStore.fetchRevenue()
        if (this.entity === 'expense') await this.apiStore.fetchExpenses()
        this.responseMessage = 'Status do pagamento salvo com sucesso!'

        if (updatedPaidStatus.paid === 'Pago') {
          if (this.pageStore.currentPage === 'revenue' && this.selectedItem.status === 'Ativo') {
            this.createRevenueForNextMonth(this.selectedItem)
          } else if (this.pageStore.currentPage === 'expenses') {
            this.createExpenseForNextMonth(this.selectedItem)
          }
        }
        this.closeModal()
      } catch (error) {
        console.error('Erro ao atualizar o status de pagamento...', error)
        this.responseMessage = 'Erro ao salvar o status do pagamento.'
      }
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1
      }
    },

    getPageNumbers() {
      const range = 2
      const start = Math.max(1, this.currentPage - range)
      const end = Math.min(this.totalPages, this.currentPage + range)

      const pageNumbers = []
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }
      return pageNumbers
    },

    goToPage(pageNumber) {
      this.currentPage = pageNumber
    },

    goToFirstPage() {
      if (this.currentPage !== 1) {
        this.currentPage = 1
      }
    },

    goToLastPage() {
      if (this.currentPage !== this.totalPages) {
        this.currentPage = this.totalPages
      }
    },

    orderData(list) {
      return list.sort((a, b) => {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()

        if (nameA < nameB) {
          return -1
        } else if (nameA > nameB) {
          return 1
        } else {
          return 0
        }
      })
    },

    formatDate(date) {
      const [year, month, day] = date.split('-')

      const formattedDateString = `${day}/${month}/${year}`
      return formattedDateString
    },

    async createRevenueForNextMonth(item) {
      try {
        let nextMonth = this.$methods.getNextMonth(item.month, item.year)

        let newRevenue = {
          customer: item.customer,
          year: nextMonth.year,
          month: nextMonth.month,
          value: item.value,
          payment_day: item.payment_day,
          notes: item.notes,
          paid: 'À pagar'
        }
        await axios.post(`${this.apiStore.apiURL}/revenue/create/`, newRevenue, {
          headers: {
            'X-CSRFToken': this.apiStore.tokenCSRF,
            'content-type': 'application/x-www-form-urlencoded'
          },
          withCredentials: true
        })
        await this.apiStore.fetchRevenue()
      } catch (error) {
        console.error('Erro ao criar receita.', error)
      }
    },

    async createExpenseForNextMonth(item) {
      try {
        let nextMonth = this.$methods.getNextMonth(item.month, item.year)
        let paymentDay = parseInt(item.due_date.slice(-2))
        let dueDate = `${nextMonth.year}-${nextMonth.monthNumber}-${paymentDay}`

        let newExpense = {
          year: nextMonth.year,
          month: nextMonth.month,
          name: item.name,
          due_date: dueDate,
          value: item.value,
          paid: 'À pagar',
          notes: item.notes
        }

        await axios.post(`${this.apiStore.apiURL}/expense/create/`, newExpense, {
          headers: {
            'X-CSRFToken': this.apiStore.tokenCSRF,
            'content-type': 'application/x-www-form-urlencoded'
          },
          withCredentials: true
        })
        await this.apiStore.fetchExpenses()
      } catch (error) {
        console.error('Erro ao criar despesa.', error)
      }
    }
  },

  watch: {
    requestMessage() {
      if (this.requestMessage) {
        this.responseMessage = this.requestMessage
      }
    }
  }
}
</script>

<style scoped>
.table-overflow {
  max-height: 360px;
  overflow: auto;
}

.table-area {
  width: 100%;
  border-collapse: collapse;
}

thead {
  position: sticky;
  top: 0;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: var(--gray-dark-color);
  color: white;
}

tr:nth-child(even) {
  background-color: #eeeded;
}

tr:hover {
  background-color: var(--red-light-color);
}

.icon {
  font-size: 20px;
  margin: 0 10px;
  cursor: pointer;
}

.status {
  color: white;
  padding: 3px 10px;
  border-radius: 8px;
}

.paid {
  cursor: pointer;
}

.active {
  background-color: green;
}

.inactive {
  background-color: red;
}

.sent {
  background-color: orange;
}

.pagination-area {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.pagination-button {
  background-color: var(--red-dark-color);
  color: white;
  border: none;
  padding: 5px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  transition-duration: 0.4s;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 5px;
}

.pagination-button:hover,
.pagination-button.active {
  background-color: red;
}

.no-results {
  color: red;
  font-weight: bold;
  font-size: 30px;
}

.total-items {
  font-weight: bold;
  font-size: 16px;
  margin: 10px;
}

.pagination-items {
  font-weight: bold;
  font-size: 14px;
  margin: 10px;
}

.checkbox {
  transform: scale(1.5);
  margin-right: 5px;
}

.align-right {
  display: flex;
  justify-content: flex-end;
  margin-right: 15px;
}

@media only screen and (max-width: 1000px) {
  .table-overflow {
    max-height: 280px;
  }

  th,
  td {
    padding: 5px;
    font-size: 13px;
  }

  .icon {
    font-size: 15px;
    margin: 0 5px;
  }

  .pagination-area {
    margin-top: 10px;
  }

  .pagination-button {
    padding: 0px 16px;
    height: 30px;
  }

  .pagination-items {
    font-size: 12px;
    margin: 7px;
  }

  .align-right {
    margin-right: 0;
  }

  .status {
    padding: 3px 5px;
  }

  .tooltip-text {
    margin: 0;
    font-size: 12px;
  }
}
</style>