<template>
  <div class="content-area">
    <div class="flex-between mb-normal">
      <DefaultButton @executeAction="addRevenue" style="background-color: var(--red-dark-color)">
        <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
        <span class="button-text">Nova Receita</span>
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
      :data="filteredRevenue"
      :searchedField="searchedField"
      :requestMessage="requestMessage"
      @updateItem="updateRevenue"
      @deleteItem="showDeleteModal"
    />
    <ModalCard
      v-if="showModal"
      :isForm="isForm"
      @executeAction="getModalAction"
      @closeModal="closeModal"
    >
      <h3 v-if="action === 'delete'" class="message-area">
        Tem certeza que deseja excluir o recebimento da mensalidade do cliente
        <strong class="highlight">{{ messageData.name }}</strong>
        referente ao mês de
        <strong class="highlight">{{ messageData.date }}</strong>?
      </h3>
      <h3 v-else-if="showConfirmation" class="message-area">
        O valor atual da mensalidade do cliente
        <strong class="highlight">{{ confirmationData.name }}</strong> é de
        <strong class="highlight">R${{ formatValue(confirmationData.currentValue) }}</strong>
        segundo o seu cadastro. Você gostaria de atualizar todos os futuros pagamentos deste cliente
        para este novo valor de
        <strong class="highlight">R${{ formatValue(confirmationData.updatedValue) }}</strong>?
      </h3>
      <RevenueForm
        v-else
        :item="item"
        :customers="apiStore.customers"
        :action="action"
        :modalTitle="modalTitle"
        @closeModal="closeModal"
        @showMessage="showMessage"
        @getConfirmation="getConfirmation"
      />
    </ModalCard>
    <div v-if="showModal" class="defocus"></div>
  </div>
</template>

<script>
import DefaultTable from "@/components/common/DefaultTable.vue";
import DefaultButton from "@/components/common/DefaultButton.vue";
import SearchFilter from "@/components/common/SearchFilter.vue";
import ModalCard from "@/components/common/ModalCard.vue";
import MonthFilter from "@/components/common/MonthFilter.vue";
import RevenueForm from "../forms/RevenueForm.vue";
import { globalVariablesMixin } from "@/utils/variables.js";
import { mapStores, mapState } from "pinia";
import { useApiStore } from "@/stores/api";
import axios from "axios";

export default {
  name: "RevenuePage",
  mixins: [globalVariablesMixin],

  components: {
    DefaultTable,
    DefaultButton,
    SearchFilter,
    ModalCard,
    RevenueForm,
    MonthFilter
  },

  data() {
    return {
      columns: [
        { key: "year", name: "Ano" },
        { key: "month", name: "Mês" },
        { key: "name", name: "Nome" },
        { key: "start", name: "Início" },
        { key: "plan", name: "Plano" },
        { key: "payment_day", name: "Venc." },
        { key: "value", name: "Valor" },
        { key: "paid", name: "Status" },
        { key: "actions", name: "" }
      ],
      statusList: ["Pago", "À pagar", "Link enviado", "Todos"],
      searchedField: [],
      showModal: false,
      item: {},
      action: "",
      messageData: {},
      modalTitle: "",
      requestMessage: "",
      currentMonth: "",
      currentYear: 0,
      currentStatus: "",
      showConfirmation: false,
      confirmationData: {},
      isForm: false
    }
  },

  computed: {
    ...mapStores(useApiStore),
    ...mapState(useApiStore, ["revenue"]),
    filteredRevenue() {
      return this.$computed.filteredData(
        this.apiStore.revenue,
        this.currentMonth,
        this.currentYear,
        this.currentStatus
      )
    }
  },

  methods: {
    getMonth(month) {
      this.currentMonth = month;
    },

    getYear(year) {
      this.currentYear = year;
    },

    getStatus(status) {
      this.currentStatus = status;
    },

    applySearch(field) {
      this.searchedField = field;
    },

    addRevenue() {
      this.showModal = true;
      this.isForm = true;
      this.action = "create";
      this.modalTitle = "Adicionar Receita";
    },

    updateRevenue(item) {
      this.showModal = true;
      this.isForm = true;
      this.item = item;
      this.action = "update";
      this.modalTitle = "Atualizar Receita";
    },

    async deleteRevenue() {
      try {
        await axios.delete(`${this.apiStore.apiURL}/revenue/${this.item.id}/`);
        this.showMessage("Receita excluída com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir receita.", error);

        this.showMessage("Erro ao excluir receita.");
      }

      this.showModal = false;
      await this.apiStore.fetchRevenue();
    },

    showDeleteModal(item) {
      this.item = item;
      this.showModal = true;
      this.action = "delete";
      let date = `${item.month}/${item.year}`;

      this.messageData = {
        name: item.name,
        date: date
      };
    },

    closeModal() {
      this.showModal = false;
      this.isForm = false;
      this.showConfirmation = false;
      this.action = "";
    },

    showMessage(msg) {
      this.requestMessage = msg;
    },

    getConfirmation(data) {
      this.confirmationData = data;
      this.showModal = true;
      this.showConfirmation = true;
    },

    async getModalAction() {
      if (this.showConfirmation) {
        this.updateCustomerValue();
        this.updateFutureRevenue();

        this.closeModal();
        await this.apiStore.fetchData();
      } else {
        this.deleteRevenue();
      }
    },

    updateFutureRevenue() {
      let nextMonth = this.$methods.getNextMonth(
        this.confirmationData.month,
        this.confirmationData.year
      );
      let nextRevenues = this.apiStore.revenue.filter(
        (e) => e.month === nextMonth.month && e.year === nextMonth.year
      );

      for (let i = 0; i < nextRevenues.length; i++) {
        this.updateRevenueValue(nextRevenues[i].id);
      }
    },

    async updateCustomerValue() {
      try {
        let updatedCustomer = {
          value: this.confirmationData.updatedValue
        };

        await axios.patch(
          `${this.apiStore.apiURL}/customer/${this.confirmationData.id}/`,
          updatedCustomer
        );
        this.$emit("showMessage", "Cliente atualizado com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar cliente.", error);
        this.$emit("showMessage", "Erro ao atualizar cliente.");
      }
    },

    async updateRevenueValue(id) {
      try {
        let updatedRevenue = {
          value: this.confirmationData.updatedValue
        };
        await axios.patch(`${this.apiStore.apiURL}/revenue/${id}/`, updatedRevenue);
      } catch (error) {
        console.error("Erro ao atualizar receita.", error);
      }
    },

    incrementData() {
      this.apiStore.customers.forEach((customer) => {
        const matchingRevenues = this.apiStore.revenue.filter(
          (revenue) => revenue.customer === customer.id
        );

        matchingRevenues.forEach((matchingRevenue) => {
          matchingRevenue.name = customer.name
          matchingRevenue.start = customer.start
          matchingRevenue.plan = customer.plan
          matchingRevenue.status = customer.status
        });
      });
    },

    formatValue(value) {
      return value.toFixed(2).toString().replace(/\./g, ",");
    }
  },

  watch: {
    revenue() {
      this.incrementData();
    }
  },

  mounted() {
    if (this.apiStore.customers && this.apiStore.customers.length > 0) {
      this.incrementData();
    }
  }
}
</script>