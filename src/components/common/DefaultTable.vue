<template>
    <div>
        <div v-if="columns.length > 0 && paginatedData.length > 0">
            <table class="table-area">
                <thead>
                    <tr>
                        <th
                            v-for="column in columns"
                            :key="column.key"
                            style="text-align: center"
                        >
                            {{ column.name }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedData" :key="index">
                        <td
                            v-for="column in columns"
                            :key="column.key"
                            style="text-align: center"
                        >
                            <span
                                v-if="column.key === 'actions'"
                                class="align-right"
                            >
                                <font-awesome-icon
                                    v-if="item.notes"
                                    icon="fa-solid fa-circle-info"
                                    class="icon"
                                    @mouseover="
                                        showTooltip('notas', $event, item)
                                    "
                                    @mouseout="hideTooltip()"
                                />
                                <font-awesome-icon
                                    icon="fa-solid fa-pen-to-square"
                                    class="icon"
                                    @click="$emit('updateItem', item)"
                                    @mouseover="
                                        showTooltip('Atualizar', $event)
                                    "
                                    @mouseout="hideTooltip()"
                                />
                                <font-awesome-icon
                                    icon="fa-solid fa-trash-can"
                                    class="icon"
                                    @click="$emit('deleteItem', item)"
                                    @mouseover="showTooltip('Excluir', $event)"
                                    @mouseout="hideTooltip()"
                                />
                            </span>
                            <span
                                v-else-if="column.key === 'status'"
                                class="status"
                                :class="{
                                    active: item[column.key] === 'Ativo',
                                    inactive: item[column.key] === 'Inativo',
                                }"
                            >
                                {{ item[column.key] }}
                            </span>
                            <span v-else-if="column.key === 'value'">
                                R$
                                {{
                                    item[column.key]
                                        .toFixed(2)
                                        .toString()
                                        .replace(/\./g, ",")
                                }}
                            </span>
                            <span
                                v-else-if="column.key === 'paid'"
                                class="status paid"
                                :class="{
                                    active: item[column.key] === 'Pago',
                                    inactive: item[column.key] === 'À pagar',
                                    sent: item[column.key] === 'Link enviado',
                                }"
                                @click="changePaidStatus(item)"
                                @mouseover="
                                    showTooltip(
                                        'status',
                                        $event,
                                        item[column.key]
                                    )
                                "
                                @mouseout="hideTooltip()"
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
            <div class="pagination-area">
                <span class="pagination-items"
                    >Página {{ currentPage }} de {{ totalPages }}</span
                >
                <button
                    class="pagination-button"
                    @click="goToFirstPage"
                    :disabled="currentPage === 1"
                >
                    &laquo;&laquo;
                </button>
                <button
                    class="pagination-button"
                    @click="previousPage"
                    :disabled="currentPage === 1"
                >
                    &laquo;
                </button>
                <template
                    v-for="pageNumber in getPageNumbers()"
                    :key="pageNumber"
                >
                    <button
                        class="pagination-button"
                        @click="goToPage(pageNumber)"
                        :class="{ active: pageNumber === currentPage }"
                    >
                        {{ pageNumber }}
                    </button>
                </template>
                <button
                    class="pagination-button"
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                >
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
                </select>
                <span class="pagination-items"
                    >Total de {{ totalItems }} itens</span
                >
            </div>
            <DefaultTooltip
                v-if="showingTooltip"
                :mouseX="mouseX"
                :mouseY="mouseY"
            >
                <p>{{ this.tooltip }}</p>
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
    </div>
</template>

<script>
import DefaultTooltip from "./DefaultTooltip.vue";
import RequestAlert from "./RequestAlert.vue";
import { updateData } from "../../services/api.js";

export default {
    name: "DefaultTable",
    components: { DefaultTooltip, RequestAlert },
    props: {
        columns: Array,
        data: Array,
        searchedField: Array,
        page: String,
        requestMessage: String,
    },

    data: function () {
        return {
            itemsPerPage: 8,
            currentPage: 1,
            filteredData: [],
            checkboxState: false,
            showingTooltip: false,
            tooltip: "",
            mouseX: 0,
            mouseY: 0,
            responseMessage: "",
        };
    },

    computed: {
        paginatedData() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + Number(this.itemsPerPage);

            return this.filteredList.slice(startIndex, endIndex);
        },

        totalPages() {
            if (this.searchedField && this.searchedField.length > 0) {
                return Math.ceil(this.filteredData.length / this.itemsPerPage);
            } else {
                return Math.ceil(this.orderedData.length / this.itemsPerPage);
            }
        },

        totalItems() {
            if (this.searchedField && this.searchedField.length > 0) {
                return this.filteredData.length;
            } else {
                return this.orderedData.length;
            }
        },

        filteredList() {
            if (this.searchedField && this.searchedField.length > 0) {
                return this.orderedData.reduce((filteredData, item) => {
                    const matched = this.searchedField.some((element) => {
                        const searchedFieldName = element.toLowerCase();
                        const listedFieldName = item.name.toLowerCase();

                        return listedFieldName.includes(searchedFieldName);
                    });
                    if (matched) {
                        filteredData.push(item);
                    }
                    this.filteredData = filteredData;
                    return filteredData;
                }, []);
            } else {
                return this.orderedData;
            }
        },

        orderedData () {
            let orderedList = this.orderData(this.data)
            return orderedList
        },
    },

    methods: {
        showTooltip(tooltip, event, item) {
            if (tooltip === "status") {
                if (item) {
                    this.tooltip = "Marcar como à pagar";
                } else {
                    this.tooltip = "Marcar como pago";
                }
            } else if (tooltip === "notas") {
                this.tooltip = item.notes;
            } else {
                this.tooltip = tooltip;
            }

            this.showingTooltip = true;
            this.mouseX = event.clientX - 40;
            this.mouseY = event.clientY + 15;
        },

        hideTooltip() {
            this.showingTooltip = false;
        },

        async changePaidStatus(item) {
            let updatedPaidStatus = {};

            try {
                if (this.page === "expenses") {
                    if (item.paid === "À pagar") {
                        updatedPaidStatus = {
                            paid: "Pago",
                        };
                    } else if (item.paid === "Pago") {
                        updatedPaidStatus = {
                            paid: "À pagar",
                        };
                    }
                } else if (this.page === "revenue") {
                    if (item.paid === "À pagar") {
                        updatedPaidStatus = {
                            paid: "Link enviado",
                        };
                    } else if (item.paid === "Link enviado") {
                        updatedPaidStatus = {
                            paid: "Pago",
                        };
                    } else if (item.paid === "Pago") {
                        updatedPaidStatus = {
                            paid: "À pagar",
                        };
                    }
                }

                await updateData(item.id, this.page, updatedPaidStatus);
                this.$emit("updateData");

                this.responseMessage = "Status do pagamento salvo com sucesso!";
            } catch (error) {
                console.error(
                    "Erro ao atualizar o status de pagamento...",
                    error
                );

                this.responseMessage = "Erro ao salvar o status do pagamento.";
            }
        },

        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage -= 1;
            }
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage += 1;
            }
        },

        getPageNumbers() {
            const range = 2;
            const start = Math.max(1, this.currentPage - range);
            const end = Math.min(this.totalPages, this.currentPage + range);

            const pageNumbers = [];
            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }
            return pageNumbers;
        },

        goToPage(pageNumber) {
            this.currentPage = pageNumber;
        },

        goToFirstPage() {
            if (this.currentPage !== 1) {
                this.currentPage = 1;
            }
        },

        goToLastPage() {
            if (this.currentPage !== this.totalPages) {
                this.currentPage = this.totalPages;
            }
        },

        orderData(list) {
            return list.sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();

                if (nameA < nameB) {
                    return -1;
                } else if (nameA > nameB) {
                    return 1;
                } else {
                    return 0;
                }
            });
        },
    },

    watch: {
        requestMessage() {
            if (this.requestMessage) {
                this.responseMessage = this.requestMessage;
            }
        },
    },
};
</script>

<style scoped>
.table-area {
    width: 97%;
    border-collapse: collapse;
    margin: 20px;
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
    margin-top: 30px;
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
</style>