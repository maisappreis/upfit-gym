<template>
    <div>
        <table class="table-area">
            <thead>
                <tr>
                    <th v-for="column in columns" :key="column.key">
                        {{ column.name }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in paginatedData" :key="index">
                    <td v-for="column in columns" :key="column.key">
                        <span v-if="column.key === 'actions'">
                            <font-awesome-icon
                                icon="fa-solid fa-pen-to-square"
                                class="icon"
                            />
                            <font-awesome-icon
                                icon="fa-solid fa-trash-can"
                                class="icon"
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
            <template v-for="pageNumber in getPageNumbers()" :key="pageNumber">
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
                >Total de {{ totalItems }} dados</span
            >
        </div>
    </div>
</template>

<script>
export default {
    name: "DefaulfTable",
    props: {
        columns: Array,
        data: Array,
    },
    data: function () {
        return {
            input: "",
            itemsPerPage: 8,
            currentPage: 1,
            filteredData: []
        };
    },

    computed: {
        paginatedData() {
            this.filterData();
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + Number(this.itemsPerPage);

            console.log('itemsPerPage:', this.itemsPerPage)
            console.log('return:', this.data.slice(startIndex, endIndex))
            return this.data.slice(startIndex, endIndex)
        },
        totalPages() {
            return Math.ceil(this.filteredData.length / this.itemsPerPage);
        },
        totalItems() {
            return this.filteredData.length;
        }
    },

    methods: {
        filterData () {
            if (this.input !== "") {
                this.filteredData = this.data
            } else {
                this.filteredData = this.data
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

.active {
    background-color: green;
}

.inactive {
    background-color: red;
}

.pagination-area {
    display: flex;
    justify-content: center;
    margin-top: 35px;
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
</style>