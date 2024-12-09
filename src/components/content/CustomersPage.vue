<template>
  <div class="content-area">
    <div class="flex-between mb-normal">
      <DefaultButton @executeAction="addCustomer" style="background-color: var(--red-dark-color)">
        <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
        <span class="button-text">Novo Cliente</span>
      </DefaultButton>
      <div style="display: flex; justify-content: flex-end">
        <StatusFilter @get-status="getStatus" />
        <SearchFilter @apply-search="applySearch" />
      </div>
    </div>
    <DefaultTable
      :columns="columns"
      :data="filteredCustomers"
      :searchedField="searchedField"
      :requestMessage="requestMessage"
      @updateItem="updateCustomer"
      @deleteItem="showDeleteModal"
    />
    <ModalCard
      v-if="showModal"
      :isForm="isForm"
      :buttonMessage="buttonMessage"
      @executeAction="getModalAction"
      @closeModal="closeModal"
    >
      <h3 v-if="action === 'delete' && blockDelete" class="message-area">
        Não é possível excluir o cliente <strong class="highlight">{{ customerName }}</strong>, pois isso excluiria todo
        o seu histórico de receitas. Ao invés de excluí-lo, mude seu
        status para <strong class="highlight">Inativo</strong>.
      </h3>
      <h3 v-else-if="action === 'delete' && !blockDelete" class="message-area">
        Tem certeza que deseja excluir o cliente
        <strong class="highlight">{{ customerName }}</strong>?
      </h3>
      <CustomersForm
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
import DefaultTable from "@/components/common/DefaultTable.vue"
import DefaultButton from "@/components/common/DefaultButton.vue";
import SearchFilter from "@/components/common/SearchFilter.vue"
import ModalCard from "@/components/common/ModalCard.vue"
import CustomersForm from "@/components/forms/CustomersForm.vue"
import StatusFilter from "@/components/common/StatusFilter.vue"
import { mapStores } from "pinia"
import { useApiStore } from "@/stores/api"
import axios from "axios"

export default {
  name: "CustomersPage",

  components: {
    DefaultTable,
    DefaultButton,
    SearchFilter,
    ModalCard,
    CustomersForm,
    StatusFilter
  },

  data() {
    return {
      columns: [
        { key: "name", name: "Nome" },
        { key: "frequency", name: "Freq." },
        { key: "start", name: "Início" },
        { key: "plan", name: "Plano" },
        { key: "value", name: "Valor" },
        { key: "status", name: "Status" },
        { key: "actions", name: "" }
      ],
      searchedField: [],
      showModal: false,
      item: {},
      action: "",
      customerName: "",
      modalTitle: "",
      requestMessage: "",
      currentStatus: "",
      buttonMessage: "Confirmar",
      isForm: false
    }
  },

  computed: {
    ...mapStores(useApiStore),
    filteredCustomers() {
      if (this.apiStore.customers && this.apiStore.customers.length > 0) {
        if (this.currentStatus === "Todos") {
          return this.apiStore.customers
        } else {
          return this.apiStore.customers.filter((e) => e.status === this.currentStatus)
        }
      } else {
        return []
      }
    }
  },

  methods: {
    applySearch(field) {
      this.searchedField = field
    },

    addCustomer() {
      this.showModal = true
      this.isForm = true
      this.action = "create"
      this.modalTitle = "Adicionar Cliente"
    },

    updateCustomer(item) {
      this.showModal = true
      this.isForm = true
      this.item = item
      this.action = "update"
      this.modalTitle = "Atualizar Cliente"
    },

    getModalAction() {
      if (this.blockDelete) {
        this.inactiveCustomer()
      } else {
        this.deleteCustomer()
      }
    },

    async deleteCustomer() {
      try {
        await axios.delete(`${this.apiStore.apiURL}/customer/${this.item.id}/`)
        this.showMessage("Cliente excluído com sucesso!")
      } catch (error) {
        console.error("Erro ao excluir cliente.", error)

        this.showMessage("Erro ao excluir cliente.")
      }

      this.showModal = false
      await this.apiStore.fetchCustomers()
    },

    async inactiveCustomer() {
      try {
        let data = { status: "Inativo" }

        await axios.patch(`${this.apiStore.apiURL}/customer/${this.item.id}/`, data)
        this.showMessage("Cliente inativado com sucesso!")
      } catch (error) {
        console.error("Erro ao inativar cliente.", error)

        this.showMessage("Erro ao inativar cliente.")
      }

      this.showModal = false
      await this.apiStore.fetchCustomers()
    },

    showDeleteModal(item) {
      this.item = item
      this.showModal = true
      this.action = "delete"
      let revenueHistory = this.apiStore.revenue.filter((e) => e.customer === this.item.id)

      this.customerName = item.name

      if (revenueHistory.length > 0) {
        this.blockDelete = true
        this.buttonMessage = "Inativar"
      } else {
        this.blockDelete = false
      }
    },

    closeModal() {
      this.showModal = false
      this.isForm = false
      this.buttonMessage = "Confirmar"
    },

    showMessage(msg) {
      this.requestMessage = msg
    },

    getStatus(status) {
      this.currentStatus = status
    }
  }
}
</script>

<style scoped></style>